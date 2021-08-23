/**
 * Copyright contributors to the ibm-storage-odf-console project
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
import * as _ from "lodash";
import { K8sResourceCommon } from "@openshift-console/dynamic-plugin-sdk";
import { PodKind, PodPhase, ContainerStatus } from "../../types";

type StatusGroup = {
  [key in InventoryStatusGroup | string]: {
    filterType?: string;
    statusIDs: string[];
    count: number;
  };
};

export type StatusGroupMapper<
  T extends K8sResourceCommon = K8sResourceCommon,
  R extends { [key: string]: K8sResourceCommon[] } = {
    [key: string]: K8sResourceCommon[];
  }
> = (resources: T[], additionalResources?: R) => StatusGroup;

export const podPhase = (pod: PodKind): PodPhase => {
  if (!pod || !pod.status) {
    return "";
  }

  if (pod.metadata.deletionTimestamp) {
    return "Terminating";
  }

  if (pod.status.reason === "NodeLost") {
    return "Unknown";
  }

  if (pod.status.reason === "Evicted") {
    return "Evicted";
  }

  let initializing = false;
  let phase = pod.status.phase || pod.status.reason;

  _.each(
    pod.status.initContainerStatuses,
    (container: ContainerStatus, i: number) => {
      const { terminated, waiting } = container.state;
      if (terminated && terminated.exitCode === 0) {
        return true;
      }

      initializing = true;
      if (terminated && terminated.reason) {
        phase = `Init:${terminated.reason}`;
      } else if (terminated && !terminated.reason) {
        phase = terminated.signal
          ? `Init:Signal:${terminated.signal}`
          : `Init:ExitCode:${terminated.exitCode}`;
      } else if (
        waiting &&
        waiting.reason &&
        waiting.reason !== "PodInitializing"
      ) {
        phase = `Init:${waiting.reason}`;
      } else {
        phase = `Init:${i}/${pod.status.initContainerStatuses.length}`;
      }
      return false;
    }
  );

  if (!initializing) {
    let hasRunning = false;
    const containerStatuses = pod.status.containerStatuses || [];
    for (let i = containerStatuses.length - 1; i >= 0; i--) {
      const {
        state: { running, terminated, waiting },
        ready,
      } = containerStatuses[i];
      if (terminated && terminated.reason) {
        phase = terminated.reason;
      } else if (waiting && waiting.reason) {
        phase = waiting.reason;
      } else if (waiting && !waiting.reason) {
        phase = terminated.signal
          ? `Signal:${terminated.signal}`
          : `ExitCode:${terminated.exitCode}`;
      } else if (running && ready) {
        hasRunning = true;
      }
    }

    // Change pod status back to "Running" if there is at least one container
    // still reporting as "Running" status.
    if (phase === "Completed" && hasRunning) {
      phase = "Running";
    }
  }

  return phase;
};
export const podPhaseFilterReducer = (pod: PodKind): PodPhase => {
  const status = podPhase(pod);
  if (status === "Terminating") {
    return status;
  }
  if (status.includes("CrashLoopBackOff")) {
    return "CrashLoopBackOff";
  }
  return _.get(pod, "status.phase", "Unknown");
};

export enum InventoryStatusGroup {
  OK = "OK",
  WARN = "WARN",
  ERROR = "ERROR",
  PROGRESS = "PROGRESS",
  NOT_MAPPED = "NOT_MAPPED",
  UNKNOWN = "UNKNOWN",
}

const POD_PHASE_GROUP_MAPPING = {
  [InventoryStatusGroup.NOT_MAPPED]: ["Running", "Succeeded"],
  [InventoryStatusGroup.ERROR]: ["CrashLoopBackOff", "Failed"],
  [InventoryStatusGroup.PROGRESS]: ["Terminating", "Pending"],
  [InventoryStatusGroup.WARN]: ["Unknown"],
};

const PVC_STATUS_GROUP_MAPPING = {
  [InventoryStatusGroup.NOT_MAPPED]: ["Bound"],
  [InventoryStatusGroup.ERROR]: ["Lost"],
  [InventoryStatusGroup.PROGRESS]: ["Pending"],
};

const PV_STATUS_GROUP_MAPPING = {
  [InventoryStatusGroup.NOT_MAPPED]: ["Available", "Bound"],
  [InventoryStatusGroup.PROGRESS]: ["Released"],
  [InventoryStatusGroup.ERROR]: ["Failed"],
};

export const getStatusGroups = (resources, mapping, mapper, filterType) => {
  const groups = {
    [InventoryStatusGroup.UNKNOWN]: {
      statusIDs: [],
      count: 0,
    },
  };
  Object.keys(mapping).forEach((key) => {
    groups[key] = {
      statusIDs: [...mapping[key]],
      count: 0,
      filterType,
    };
  });

  resources.forEach((resource) => {
    const status = mapper(resource);
    const group =
      Object.keys(mapping).find((key) => mapping[key].includes(status)) ||
      InventoryStatusGroup.UNKNOWN;
    groups[group].count++;
  });

  return groups;
};

export const getPodStatusGroups: StatusGroupMapper = (resources) =>
  getStatusGroups(
    resources,
    POD_PHASE_GROUP_MAPPING,
    podPhaseFilterReducer,
    "pod-status"
  );
export const getPVCStatusGroups: StatusGroupMapper = (resources) =>
  getStatusGroups(
    resources,
    PVC_STATUS_GROUP_MAPPING,
    (pvc) => pvc.status.phase,
    "pvc-status"
  );
export const getPVStatusGroups: StatusGroupMapper = (resources) =>
  getStatusGroups(
    resources,
    PV_STATUS_GROUP_MAPPING,
    (pv) => pv.status.phase,
    "pv-status"
  );

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

import {K8sKind, SecretKind, K8sResourceKind, PodKind} from "../types";
import { IBM_STORAGE_ODF_OPERATOR } from "../constants";

export const getPodVolumes = (pod: PodKind): PodKind["spec"]["volumes"] =>
  pod?.spec?.volumes ? pod.spec.volumes : [];

export const referenceForModel = (storage: K8sKind) => {
  const kind = `${storage.apiGroup}~${storage.apiVersion}~${storage.kind}`;
  return kind;
};

export const resourcePathFromModel = (
  model: K8sKind,
  name?: string,
  namespace?: string
) => {
  const { plural, namespaced, crd } = model;

  let url = "/k8s/";

  if (!namespaced) {
    url += "cluster/";
  }

  if (namespaced) {
    url += namespace ? `ns/${namespace}/` : "all-namespaces/";
  }

  if (crd) {
    url += referenceForModel(model);
  } else if (plural) {
    url += plural;
  }

  if (name) {
    // Some resources have a name that needs to be encoded. For instance,
    // Users can have special characters in the name like `#`.
    url += `/${encodeURIComponent(name)}`;
  }

  return url;
};

export const getCustomizedPVs = (
  pvsData: K8sResourceKind[] = [],
  currentProvisioner: string
): K8sResourceKind[] =>
  pvsData.filter((pv) => {
    return [currentProvisioner].some((provisioner: string) =>
      _.get(
        pv,
        'metadata.annotations["pv.kubernetes.io/provisioned-by"]',
        ""
      ).includes(provisioner)
    );
  });
const enum status {
  BOUND = "Bound",
  AVAILABLE = "Available",
}
const getPVStorageClass = (pv: K8sResourceKind) =>
  _.get(pv, "spec.storageClassName");
const getStorageClassName = (pvc: K8sResourceKind) =>
  _.get(pvc, [
    "metadata",
    "annotations",
    "volume.beta.kubernetes.io/storage-class",
  ]) || _.get(pvc, "spec.storageClassName");
const isBound = (pvc: K8sResourceKind) => pvc.status.phase === status.BOUND;

export const getCustomizedPVCs = (
  customSCNames: string[] = [],
  pvcsData: K8sResourceKind[] = [],
  pvsData: K8sResourceKind[] = [],
  currentProvisioner: string
): K8sResourceKind[] => {
  const customPVs = getCustomizedPVs(pvsData, currentProvisioner);
  const customSCNameSet = new Set<string>([
    ...customSCNames,
    ...customPVs.map(getPVStorageClass),
  ]);
  const customBoundPVCUIDSet = new Set<string>(
    _.map(customPVs, "spec.claimRef.uid")
  );
  // If the PVC is bound use claim uid(links PVC to PV) else storage class to verify it's provisioned by custom.
  return pvcsData.filter((pvc: K8sResourceKind) =>
    isBound(pvc)
      ? customBoundPVCUIDSet.has(pvc.metadata.uid)
      : customSCNameSet.has(getStorageClassName(pvc))
  );
};

export const getCustomizedSC = (
  scData: K8sResourceKind[] = [],
  provisionerName: string
): K8sResourceKind[] =>
  scData.filter((sc) => {
    return [provisionerName].some((provisioner: string) =>
      _.get(sc, "provisioner", "").includes(provisioner)
    );
  });

export const getPodPVCs = (pod: PodKind): string[] => {
  const podVols = getPodVolumes(pod);
  const podPVCsSet = new Set<string>(
    _.map(podVols, "persistentVolumeClaim.claimName")
  );
  const podPVCsTmp = [...podPVCsSet];
  const podPVCs = podPVCsTmp.map((v) => (v === undefined ? "Unknown" : v));
  return podPVCs;
};

export const getCustomizedPods = (
  podData: K8sResourceKind[] = [],
  provisionerName: string,
  pvcsData: K8sResourceKind[]
): K8sResourceKind[] => {
  const filterPods: K8sResourceKind[] = [];
  let flag = false;
  for (const pod of podData) {
    const podPVCS = getPodPVCs(pod as PodKind);
    for (const pvc of podPVCS) {
      for (const pvc2 of pvcsData) {
        if (pvc === pvc2.metadata.name) {
          filterPods.push(pod);
          flag = true;
          break;
        }
      }
      if (flag) break;
    }
    flag = false;
  }
  return filterPods;
};

export const getIBMStorageODFVersion = (items: K8sKind[]): string => {
  const itemsData: K8sKind[] = items;
  const operator: K8sKind = _.find(
    itemsData,
    (item) => _.get(item, "spec.name") === IBM_STORAGE_ODF_OPERATOR
  );
  return _.get(operator, "status.installedCSV");
};

export const getVendor = (storage: K8sKind) =>
  _.get(storage, ["spec", "vendor"]);

export const getDriverName = (storage: K8sKind) =>
  _.get(storage, ["spec", "driverEndpoint", "driverName"]);

export const getId = (storage: K8sKind) => _.get(storage, ["status", "id"]);

export const getVersion = (storage: K8sKind) =>
  _.get(storage, ["status", "version"]);

export const getNamespace = (resource) =>
  _.get(resource, ["metadata", "namespace"]);

export const getEndpoint = (secret: SecretKind) =>
  _.get(secret, ["data", "management_address"]);

export const getNameFromProps = (props) => {
  const CRname = _.get(props, ["match", "params", "name"]);
  const systemName = _.get(props, ["match", "params", "systemName"]);
  return systemName ? systemName.replace("-storagesystem", "") : CRname;
};

export const getNamespaceFromProps = (props) =>
  _.get(props, ["match", "params", "namespace"]);

export const parseProps = (props) => {
  return {
    name: getNameFromProps(props),
    namespace: getNamespaceFromProps(props),
  };
};


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
import * as React from "react";
import * as _ from "lodash";
import {
  DashboardCard,
  DashboardCardBody,
  DashboardCardHeader,
  DashboardCardTitle,
  ActivityBody,
  RecentEventsBody,
} from "@console/dynamic-plugin-sdk/internalAPI";
import { useK8sWatchResource } from "@console/dynamic-plugin-sdk/api";
import { FirehoseResource } from "@console/dynamic-plugin-sdk";
import { IBM_STORAGE_CSI_PROVISIONER } from "../../constants/index";
import { EventModel, StorageInstanceModel } from "../../models";
import "./activity-card.scss";
import { EventKind } from "../../types";
import { parseProps } from "../../selectors/index";

const eventsResource: FirehoseResource = {
  isList: true,
  kind: EventModel.kind,
  prop: "events",
};

const RecentEvent: React.FC<any> = (props) => {
  const { name } = parseProps(props);
  const [events, eventsLoaded] = useK8sWatchResource(eventsResource);
  const FlashsystemEventFilter = (event: EventKind): boolean => {
    const eventSource = event?.source?.component;
    const isIBMStorageCSIprovisioner =
      eventSource?.indexOf(IBM_STORAGE_CSI_PROVISIONER) != -1;
    const isFlashsystemClusterKind =
      eventSource?.indexOf(StorageInstanceModel.kind) != -1;
    const eventName = _.get(event, ["metadata", "name"]);
    const isNameIncluded = name ? eventName?.indexOf(name) != -1 : false;
    return (
      isFlashsystemClusterKind || isIBMStorageCSIprovisioner || isNameIncluded
    );
  };

  return (
    <RecentEventsBody
      events={{ data: events, loaded: eventsLoaded } as any}
      filter={FlashsystemEventFilter}
    />
  );
};

export const ActivityCard: React.FC<any> = (props) => {
  return (
    <DashboardCard gradient>
      <DashboardCardHeader>
        <DashboardCardTitle>Activity</DashboardCardTitle>
      </DashboardCardHeader>
      <DashboardCardBody>
        <ActivityBody className="flashsystem-activity-card__body">
          <RecentEvent {...props} />
        </ActivityBody>
      </DashboardCardBody>
    </DashboardCard>
  );
};

export default ActivityCard;

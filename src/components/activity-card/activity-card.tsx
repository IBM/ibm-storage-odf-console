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
import { useTranslation } from "react-i18next";
import {
  ActivityBody,
  RecentEventsBody,
} from "@openshift-console/dynamic-plugin-sdk-internal";


import { Card, CardBody, CardHeader, CardTitle } from '@patternfly/react-core';
import { useK8sWatchResource } from "@openshift-console/dynamic-plugin-sdk";
import { FirehoseResource } from "@openshift-console/dynamic-plugin-sdk";
import {
  IBM_STORAGE_ODF_CONSOLE_NAME,
  IBM_STORAGE_ODF_PREFIX,
  IBM_STORAGE_CSI_PROVISIONER,
  IBM_STORAGE_ODF_OPERATOR
} from "../../constants/constants";
import { EventModel } from "../../models";
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
    const eventName = event?.metadata.name
    const eventInvolvedObjectName = event?.involvedObject?.name

    const isIBMStorageCSIProvisioner = eventSource ? eventSource.indexOf(IBM_STORAGE_CSI_PROVISIONER) != -1 : false
    const isObjectInvolved = eventInvolvedObjectName ? eventInvolvedObjectName == name : false;
    const isNameIncluded = eventName ?
        eventName.indexOf(IBM_STORAGE_ODF_PREFIX) != -1 ||
        eventName.indexOf(IBM_STORAGE_ODF_CONSOLE_NAME) != -1 ||
        eventName.indexOf(IBM_STORAGE_ODF_OPERATOR) != -1 ||
        eventName.indexOf(name) != -1 : false;

    return (isObjectInvolved || isNameIncluded || isIBMStorageCSIProvisioner);
  };

  return (
    <RecentEventsBody
      events={{ data: events, loaded: eventsLoaded } as any}
      filter={FlashsystemEventFilter}
    />
  );
};

export const ActivityCard: React.FC<any> = (props) => {
  const { t } = useTranslation("plugin__ibm-storage-odf-plugin");
  return (
    <Card>
      <CardHeader>
        <CardTitle>{t("Activity")}</CardTitle>
      </CardHeader>
      <CardBody>
        <ActivityBody className="flashsystem-activity-card__body">
          <RecentEvent {...props} />
        </ActivityBody>
      </CardBody>
    </Card>
  );
};

export default ActivityCard;

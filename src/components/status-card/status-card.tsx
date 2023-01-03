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
import { Gallery, GalleryItem } from "@patternfly/react-core";
import { useK8sWatchResource } from "@openshift-console/dynamic-plugin-sdk";
import {useCustomPrometheusPoll} from "../custom-prometheus-poll/custom-prometheus-poll"
import {
  HealthItem,
  AlertsBody,
  AlertItem
} from "@openshift-console/dynamic-plugin-sdk-internal";

import { Card, CardBody, CardHeader, CardTitle } from '@patternfly/react-core';
import {
  getFlashsystemHealthState,
  // filterIBMFlashSystemAlerts,
  alertURL,
  PrometheusRulesResponse,
  getAlertsAndRules,
} from "./utils";
import { StorageInstanceKind } from "../../types";
import { GetFlashSystemResource } from "../../constants/resources";
import { parseProps } from "../../selectors/index";
import {IBM_FLASHSYSTEM} from "../../constants/constants";

const IBMFlashSystemAlerts: React.FC = () => {
  const [rules, alertsError, alertsLoaded] = useCustomPrometheusPoll({
    query: "",
    endpoint: "api/v1/rules" as any,
  });

  const myRules = rules as unknown as PrometheusRulesResponse;
  const { alerts } = getAlertsAndRules(myRules?.["data"]);
  const alertArray = JSON.parse(JSON.stringify(alerts));
  // const filteredAlerts = filterIBMFlashSystemAlerts(alertArray);
  const filteredAlerts = alertArray.filter((alert) => {
    return alert.annotations?.storage_type.toLowerCase() === IBM_FLASHSYSTEM.toLowerCase() &&
        alert.labels?.managedBy.toLowerCase() === String.name.toLowerCase();
  })
  return (
    <AlertsBody error={alertsError}>
      {!alertsLoaded &&
        filteredAlerts.length > 0 &&
        filteredAlerts.map((alert) => (
          <AlertItem key={alertURL(alert, alert.rule.id)} alert={alert} />
        ))}
    </AlertsBody>
  );
};

export const StatusCard: React.FC<any> = (props) => {
  const { t } = useTranslation("plugin__ibm-storage-odf-plugin");
  const { name } = parseProps(props);
  const [data, loaded, loadError] = useK8sWatchResource<StorageInstanceKind[]>(
      GetFlashSystemResource(props)
  );

  const fscData =  data?.find(fsc => fsc.metadata.name == name);

  const flashHealthState = getFlashsystemHealthState({
    sto: { data: fscData, loaded: loaded, loadError: loadError },
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t("Newest Status")}</CardTitle>
      </CardHeader>
      <CardBody>
        <Gallery className="co-overview-status__health" hasGutter>
          <GalleryItem>
            <HealthItem
              title={name}
              state={flashHealthState.state}
              details={flashHealthState.message}
            />
          </GalleryItem>
        </Gallery>
        <IBMFlashSystemAlerts />
      </CardBody>
    </Card>
  );
};

export default StatusCard;

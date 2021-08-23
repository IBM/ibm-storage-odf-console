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
import { useK8sWatchResource } from "@openshift-console/dynamic-plugin-sdk/api";
import {
  DashboardCard,
  DashboardCardBody,
  DashboardCardHeader,
  DashboardCardTitle,
  HealthItem,
  AlertsBody,
  AlertItem,
  usePrometheusPoll,
} from "@openshift-console/dynamic-plugin-sdk/internalAPI";
import {
  getFlashsystemHealthState,
  filterIBMFlashSystemAlerts,
  alertURL,
  PrometheusRulesResponse,
  getAlertsAndRules,
} from "./utils";
import { StorageInstanceKind } from "../../types";
import { GetFlashSystemResource } from "../../constants/resources";
import { parseProps } from "../../selectors/index";

const IBMFlashSystemAlerts: React.FC = () => {
  const [rules, alertsError, alertsLoaded] = usePrometheusPoll({
    query: "",
    endpoint: "api/v1/rules" as any,
  });

  const myRules = rules as unknown as PrometheusRulesResponse;
  const { alerts } = getAlertsAndRules(myRules?.["data"]);
  const filteredAlerts = filterIBMFlashSystemAlerts(alerts);
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
  const { t } = useTranslation();
  const { name } = parseProps(props);
  const [data, loaded, loadError] = useK8sWatchResource<StorageInstanceKind>(
    GetFlashSystemResource(props)
  );
  const flashHealthState = getFlashsystemHealthState({
    sto: { data: data, loaded: loaded, loadError: loadError },
  });

  return (
    <DashboardCard gradient>
      <DashboardCardHeader>
        <DashboardCardTitle>
          {t("plugin__ibm-storage-odf-plugin~Status")}
        </DashboardCardTitle>
      </DashboardCardHeader>
      <DashboardCardBody>
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
      </DashboardCardBody>
    </DashboardCard>
  );
};

export default StatusCard;

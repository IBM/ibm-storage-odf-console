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
import { Link, BrowserRouter as Router } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Base64 } from "js-base64";
import { useK8sWatchResource } from "@openshift-console/dynamic-plugin-sdk";
import {
  DashboardCard,
  DashboardCardBody,
  DashboardCardHeader,
  DashboardCardTitle,
  DetailItem,
  DetailsBody,
} from "@openshift-console/dynamic-plugin-sdk/lib/api/internal-api";
import { ExternalLink } from "./Link";
import { StorageInstanceKind, K8sKind, SecretKind } from "../../types";
import {
  getEndpoint,
  getIBMStorageODFVersion,
  resourcePathFromModel,
} from "../../selectors";
import { ClusterServiceVersionModel } from "../../models";
import {
  GetFlashSystemResource,
  SubscriptionResource,
  GetSecretResource,
} from "../../constants/resources";

const DetailsCard: React.FC<any> = (props) => {
  const { t } = useTranslation("plugin__ibm-storage-odf-plugin");
  const flashClusterResource = GetFlashSystemResource(props);

  const [data, flashsystemloaded, flashsystemloadError] =
    useK8sWatchResource<StorageInstanceKind>(flashClusterResource);
  const [subscriptions, subscriptionloaded, subscriptionloadError] =
    useK8sWatchResource<K8sKind[]>(SubscriptionResource);

  const stoData = data?.[0];
  const flashSecretResource = GetSecretResource(
    stoData?.metadata?.name,
    stoData?.metadata?.namespace
  );
  const [secret, secretloaded, secretloadError] =
    useK8sWatchResource<SecretKind>(flashSecretResource);
  const secretData = getEndpoint(secret);
  const endpointAddress = React.useMemo(
    () =>
      secretloaded && !secretloadError && secretData
        ? Base64.decode(secretData)
        : "unknown",
    [data, secretloaded, secretloadError]
  );

  const flashOperatorVersion =
    flashsystemloaded && !flashsystemloadError
      ? getIBMStorageODFVersion(subscriptions)
      : "unknown";
  const operatorPath =
    subscriptionloaded && !subscriptionloadError
      ? `${resourcePathFromModel(
          ClusterServiceVersionModel,
          flashOperatorVersion,
          stoData?.metadata.namespace
        )}`
      : "unknown";

  return (
    <DashboardCard>
      <DashboardCardHeader>
        <DashboardCardTitle>{t("Details")}</DashboardCardTitle>
      </DashboardCardHeader>
      <DashboardCardBody>
        <DetailsBody>
          <DetailItem
            key="operator-name"
            title={t("Operator Name")}
            error={false}
            isLoading={false}
          >
            <Router>
              {" "}
              <Link
                to={operatorPath}
                onClick={() => (window.location.href = operatorPath)}
              >
                OpenShift Data Foundation - IBM
              </Link>{" "}
            </Router>
          </DetailItem>
          <DetailItem
            key="provider"
            title={t("Provider")}
            error={false}
            isLoading={false}
          >
            {
              <ExternalLink
                href={"https://" + endpointAddress}
                text="IBM FlashSystem"
              />
            }
          </DetailItem>
          <DetailItem
            key="mode"
            title={t("Mode")}
            error={false}
            isLoading={false}
          >
            External
          </DetailItem>
          <DetailItem
            key="storage-type"
            title={t("Storage Type")}
            error={false}
            isLoading={false}
          >
            Block
          </DetailItem>
          <DetailItem
            key="version"
            title={t("Version")}
            error={false}
            isLoading={false}
          >
            {flashOperatorVersion}
          </DetailItem>
        </DetailsBody>
      </DashboardCardBody>
    </DashboardCard>
  );
};

export default DetailsCard;

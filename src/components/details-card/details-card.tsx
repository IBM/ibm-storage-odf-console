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
import { useK8sWatchResource } from "@console/dynamic-plugin-sdk/api";
import {
  DashboardCard,
  DashboardCardBody,
  DashboardCardHeader,
  DashboardCardTitle,
  DetailItem,
  DetailsBody,
} from "@console/dynamic-plugin-sdk/internalAPI";
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
  const { t } = useTranslation();
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
  const endpointAddress = React.useMemo(
    () =>
      secretloaded && !secretloadError
        ? Base64.decode(getEndpoint(secret))
        : "",
    [data, secretloaded, secretloadError]
  );

  const flashOperatorVersion = getIBMStorageODFVersion(subscriptions);
  const operatorPath = `${resourcePathFromModel(
    ClusterServiceVersionModel,
    flashOperatorVersion,
    stoData?.metadata.namespace
  )}`;

  return (
    <DashboardCard>
      <DashboardCardHeader>
        <DashboardCardTitle>
          {t("plugin__ibm-storage-odf-plugin~Details")}
        </DashboardCardTitle>
      </DashboardCardHeader>
      <DashboardCardBody>
        <DetailsBody>
          <DetailItem
            key="operator-name"
            title={t("plugin__ibm-storage-odf-plugin~Operator Name")}
            error={!!subscriptionloadError}
            isLoading={!subscriptionloaded}
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
            title={t("plugin__ibm-storage-odf-plugin~Provider")}
            error={!!flashsystemloadError}
            isLoading={!flashsystemloaded}
          >
            <ExternalLink
              href={"https://" + endpointAddress}
              text="IBM flashsystem"
            />
          </DetailItem>
          <DetailItem
            key="mode"
            title={t("plugin__ibm-storage-odf-plugin~Mode")}
            error={!!flashsystemloadError}
            isLoading={!flashsystemloaded}
          >
            External
          </DetailItem>
          <DetailItem
            key="storage-type"
            title={t("plugin__ibm-storage-odf-plugin~Storage Type")}
            error={!!flashsystemloadError}
            isLoading={!flashsystemloaded}
          >
            Block
          </DetailItem>
          <DetailItem
            key="version"
            title={t("plugin__ibm-storage-odf-plugin~Version")}
            error={!!flashsystemloadError}
            isLoading={!flashsystemloaded}
          >
            {flashOperatorVersion}
          </DetailItem>
        </DetailsBody>
      </DashboardCardBody>
    </DashboardCard>
  );
};

export default DetailsCard;

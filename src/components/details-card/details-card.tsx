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
  DetailsBody,
} from "@openshift-console/dynamic-plugin-sdk-internal";

import { OverviewDetailItem as DetailItem} from "@openshift-console/plugin-shared";

import { Card, CardBody, CardHeader, CardTitle } from '@patternfly/react-core';
import { ExternalLink } from "./Link";
import { StorageInstanceKind, K8sKind, SecretKind } from "../../types";
import {
  getEndpoint,
  getIBMStorageODFVersion,
  parseProps,
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
  const { name } = parseProps(props);
  const [data, , ] = useK8sWatchResource<StorageInstanceKind[]>(
      GetFlashSystemResource(props)
    );

  const fscData =  data?.find(fsc => fsc.metadata.name == name);

  const [subscriptions, subscriptionloaded, subscriptionloadError] =
    useK8sWatchResource<K8sKind[]>(SubscriptionResource);

  const flashSecretResource = GetSecretResource(
      fscData?.metadata?.name,
      fscData?.metadata?.namespace
  );
  const [secret, secretloaded, secretloadError] =
    useK8sWatchResource<SecretKind>(flashSecretResource);
  const secretData = getEndpoint(secret);
  const endpointAddress = React.useMemo(
    () =>
      secretloaded && !secretloadError && secretData
        ? Base64.decode(secretData)
        : "unknown",
    [fscData, secretloaded, secretloadError]
  );

  const flashOperatorVersion = React.useMemo(
      () =>
          subscriptionloaded && !subscriptionloadError
              ? getIBMStorageODFVersion(subscriptions)
              : "unknown",
      [fscData, subscriptionloaded, subscriptionloadError]
  );

  const operatorPath =
      subscriptionloaded && !subscriptionloadError
          ? `${resourcePathFromModel(
              ClusterServiceVersionModel,
              flashOperatorVersion,
              fscData?.metadata.namespace
          )}`
          : "unknown";

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t("Details")}</CardTitle>
      </CardHeader>
      <CardBody>
        <DetailsBody>
          <DetailItem
            key="operator-name"
            title={t("Operator Name")}
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
            isLoading={false}
          >
            External
          </DetailItem>
          <DetailItem
            key="storage-type"
            title={t("Storage Type")}
            isLoading={false}
          >
            Block
          </DetailItem>
          <DetailItem
            key="version"
            title={t("Version")}
            isLoading={false}
          >
            {flashOperatorVersion}
          </DetailItem>
        </DetailsBody>
      </CardBody>
    </Card>
  );
};

export default DetailsCard;

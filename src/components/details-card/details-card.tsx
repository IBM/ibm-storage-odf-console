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
import * as React from 'react';
import * as _ from 'lodash';
import { Link, BrowserRouter as Router, } from 'react-router-dom';
import {
    Card,
    CardBody,
    CardHeader,
    CardTitle,
  } from "@patternfly/react-core";
import { Base64 } from 'js-base64';
import {
    useK8sWatchResource,
} from "@console/dynamic-plugin-sdk/api";
import {
  DetailItem,
  DetailsBody,
} from "@console/dynamic-plugin-sdk/provisional";
import {ExternalLink} from './Link';
import { 
  StorageInstanceKind, 
  K8sKind,
  SecretKind
 } from '../../types';
import { 
  getEndpoint,  
  getIBMStorageODFVersion,
  resourcePathFromModel,
  } from '../../selectors';
import {
  ClusterServiceVersionModel,
} from '../../models';
import {
  GetFlashSystemResource, 
  SubscriptionResource,
  GetSecretResource 
} from '../../constants/resources'

const DetailsCard: React.FC<any> = (props) => {
  const flashClusterResource = GetFlashSystemResource(props?.match?.params?.name, props?.match?.params?.namespace);
  const [data, flashsystemloaded, flashsystemloadError] = useK8sWatchResource<StorageInstanceKind>(flashClusterResource);
  const [subscriptions, subscriptionloaded, subscriptionloadError] = useK8sWatchResource<K8sKind[]>(SubscriptionResource);

  const stoData = data?.[0];
  const flashSecretResource = GetSecretResource(stoData?.metadata?.name, stoData?.metadata?.namespace);
  const [secret, secretloaded, secretloadError] = useK8sWatchResource<SecretKind>(flashSecretResource);
  const endpointAddress = secretloaded && !secretloadError ? Base64.decode(getEndpoint(secret)) : '';

  const flashOperatorVersion = getIBMStorageODFVersion(subscriptions);
  const operatorPath = `${resourcePathFromModel(
    ClusterServiceVersionModel,
    flashOperatorVersion,
    stoData?.metadata.namespace,
  )}`;

  return (
    <Card className="co-dashboard-card co-dashboard-card--gradient">
    <CardHeader className="co-dashboard-card__header">
      <CardTitle className="co-dashboard-card__title">Details</CardTitle>
    </CardHeader>
    <CardBody className="co-dashboard-card__body">
       <DetailsBody>
          <DetailItem
            key="operator-name"
            title="Operator Name"
            error={!!subscriptionloadError }
            isLoading={!subscriptionloaded }
          >
            <Router> <Link to={operatorPath} onClick={() => window.location.href=operatorPath}>OpenShift Data Foundation - IBM</Link> </Router>
          </DetailItem>
          <DetailItem
            key="provider"
            title="Provider"
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
            title="Mode"
            error={!!flashsystemloadError}
            isLoading={!flashsystemloaded}
          >
            External
          </DetailItem>
          <DetailItem
            key="storage-type"
            title="Storage Type"
            error={!!flashsystemloadError}
            isLoading={!flashsystemloaded}
          >
            Block
          </DetailItem>
          <DetailItem
            key="version"
            title="Version"
            error={!!flashsystemloadError}
            isLoading={!flashsystemloaded}
          >
            {flashOperatorVersion}
          </DetailItem>
        </DetailsBody>
    </CardBody>
  </Card>
  );
};

export default DetailsCard;

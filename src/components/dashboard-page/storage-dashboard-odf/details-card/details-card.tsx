import * as React from 'react';
import * as _ from 'lodash';
import { Link, BrowserRouter as Router, } from 'react-router-dom';
import {
    Card,
    CardBody,
    CardHeader,
    CardTitle,
  } from "@patternfly/react-core";

import {
    useK8sWatchResource,
} from "@console/dynamic-plugin-sdk/api";
import {DetailItem} from './DetailItem';
import DetailsBody from './DetailsBody';
import {ExternalLink} from './Link';
import { 
  StorageInstanceKind, 
  K8sKind,
 } from '../../../../types';
import { 
  getEndpoint,  
  getIBMStorageODFVersion,
  resourcePathFromModel,
  } from '../../../../selectors';
import {
  ClusterServiceVersionModel,
} from '../../../../models';
import {
  GetFlashSystemResource, 
  SubscriptionResource, 
} from '../../../../constants/resources'

const DetailsCard: React.FC<any> = (props) => {
  const flashClusterResource = GetFlashSystemResource(props?.match?.params?.name, props?.match?.params?.namespace);
  const [data, flashsystemloaded, flashsystemloadError] = useK8sWatchResource<StorageInstanceKind>(flashClusterResource);
  const [subscriptions, subscriptionloaded, subscriptionloadError] = useK8sWatchResource<K8sKind[]>(SubscriptionResource);

  const stoData = data?.[0];
  const endpointAddress = getEndpoint(stoData);
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
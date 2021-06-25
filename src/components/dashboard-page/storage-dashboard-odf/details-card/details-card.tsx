import * as React from 'react';
import * as _ from 'lodash';
//import { Link } from 'react-router-dom';
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
//import {ExternalLink} from './Link';
import { 
  StorageInstanceKind, 
  //K8sKind,
 } from '../../../../types';
import { 
  getEndpoint,  
  //getIBMStorageODFVersion,
  //resourcePathFromModel,
  } from '../../../../selectors';
import {
  //ClusterServiceVersionModel,
} from '../../../../models';
import {
  GetFlashSystemResource, 
  //SubscriptionResource, 
} from '../../../../constants/resources'

const DetailsCard: React.FC<any> = (props) => {
  const flashClusterResource = GetFlashSystemResource(props?.match?.params?.name, props?.match?.params?.namespace);
  const [data, flashsystemloaded, flashsystemloadError] = useK8sWatchResource<StorageInstanceKind>(flashClusterResource);
  //const [subscriptions, subscriptionloaded, subscriptionloadError] = useK8sWatchResource<K8sKind[]>(SubscriptionResource);
  
  console.log({data: data});

  const stoData = data?.[0];
  const endpointAddress = getEndpoint(stoData);
  //const odfVersion = getIBMStorageODFVersion(subscriptions);
  /*
  const odfPath = `${resourcePathFromModel(
    ClusterServiceVersionModel,
    odfVersion,
    stoData?.metadata.namespace,
  )}`;
  */
 const odfVersion = 'test123' + endpointAddress;

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
            error={!!flashsystemloadError }
            isLoading={!flashsystemloaded }
          >
            
          </DetailItem>
          <DetailItem
            key="provider"
            title="Provider"
            error={!!flashsystemloadError}
            isLoading={!flashsystemloaded}
          >
            
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
            {odfVersion}
          </DetailItem>
        </DetailsBody>
    </CardBody>
  </Card>
  );
  /*
  return (
    <DashboardCard>
      <DashboardCardHeader>
        <DashboardCardTitle>Details</DashboardCardTitle>
      </DashboardCardHeader>
      <DashboardCardBody>
        <DetailsBody>
          <DetailItem
            key="operator-name"
            title="Operator Name"
            error={!!flashsystemloadError}
            isLoading={!flashsystemloaded || !subscriptionsLoaded}
          >
            <Link to={odfPath}>OpenShift Data Foundation - IBM</Link>
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
            {odfVersion}
          </DetailItem>
        </DetailsBody>
      </DashboardCardBody>
    </DashboardCard>
  );*/
};

export default DetailsCard;
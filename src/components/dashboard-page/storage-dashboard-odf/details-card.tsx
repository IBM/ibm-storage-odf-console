import * as React from 'react';
import * as _ from 'lodash';
import { Link } from 'react-router-dom';
import DashboardCard from '@console/shared/src/components/dashboard/dashboard-card/DashboardCard';
import DashboardCardBody from '@console/shared/src/components/dashboard/dashboard-card/DashboardCardBody';
import DashboardCardHeader from '@console/shared/src/components/dashboard/dashboard-card/DashboardCardHeader';
import DashboardCardTitle from '@console/shared/src/components/dashboard/dashboard-card/DashboardCardTitle';
import DetailItem from '@console/shared/src/components/dashboard/details-card/DetailItem';
import {
  DashboardItemProps,
  withDashboardResources,
} from '@console/internal/components/dashboard/with-dashboard-resources';
import DetailsBody from '@console/shared/src/components/dashboard/details-card/DetailsBody';
import { FirehoseResource, FirehoseResult,ExternalLink } from '@console/internal/components/utils';
//import { K8sResourceKind } from '@console/internal/module/k8s/index';
//import { getName, getCreationTimestamp } from '@console/shared/src/selectors/common';
//import { useK8sGet } from '@console/internal/components/utils/k8s-get-hook';
import { StorageInstanceModel } from '../../../models';
import { StorageInstanceKind } from '../../../types';
import { 
  getEndpoint,  
  getIBMStorageODFVersion,
  } from '../../../selectors';
import { referenceForModel } from '@console/internal/module/k8s/k8s';
import { resourcePathFromModel } from '@console/internal/components/utils/resource-link';
import {
  SubscriptionModel,
  ClusterServiceVersionModel,
} from '@console/operator-lifecycle-manager/src/models';
//import { SubscriptionKind } from '@console/operator-lifecycle-manager';
/*
import {
  FeatureFlag,
  isFeatureFlag,
  SetFeatureFlag,
  ModelFeatureFlag,
  useResolvedExtensions,
  isModelFeatureFlag,
  FooFeatureFlag,
  isFooFeatureFlag,
} from '@console/dynamic-plugin-sdk';
*/
//import {getODFSubscription} from './activity-card/activity-card';
import {OdfDashboardContext} from '../../../odf-dashboard';

const DetailsCard: React.FC<DashboardItemProps> = ({
  watchK8sResource,
  stopWatchK8sResource,
  resources,
}) => {
  const { obj } = React.useContext(OdfDashboardContext);
  const stoClusterResource: FirehoseResource = {
    kind: referenceForModel(StorageInstanceModel),
    name:obj?.metadata.name,
    namespace: obj?.metadata.namespace,
    prop: 'sto'
  };
  const subscriptionResource: FirehoseResource = {
    isList: true,
    kind: referenceForModel(SubscriptionModel),
    namespaced: false,
    prop: 'subs',
  };
 
  React.useEffect(() => {
    watchK8sResource(stoClusterResource);
    watchK8sResource(subscriptionResource);
    return () => {
      stopWatchK8sResource(stoClusterResource);
      stopWatchK8sResource(subscriptionResource);
    };
  }, [watchK8sResource, stopWatchK8sResource]);

  const sto = resources?.sto;
  const stoLoaded = sto?.loaded || false;
  const stoError = sto?.loadError;
  const stoData = sto?.data as StorageInstanceKind;

  const endpointAddress = getEndpoint(stoData);
  const subscriptions = resources?.subs as FirehoseResult;
  const subscriptionsLoaded = subscriptions?.loaded;
  //const odfSubscription: SubscriptionKind = getODFSubscription(subscriptions);
  const odfVersion = getIBMStorageODFVersion(subscriptions);
  const odfPath = `${resourcePathFromModel(
    ClusterServiceVersionModel,
    odfVersion,
    obj?.metadata.namespace,
  )}`;

  /* dynamic plugin test
  const featureFlagController: SetFeatureFlag = (flag: string, enabled: boolean) => {
    console.log({flag: flag, enabled: enabled});
  };
  
  const [fileUploadExtensions2, resolved2] = useResolvedExtensions<FooFeatureFlag>(isFooFeatureFlag);
  console.log({fileUploadExtensions2: fileUploadExtensions2, resolved2: resolved2});
  const ret2 = fileUploadExtensions2[0]?.properties.handler({label: 'test123'});
  console.log({ret2: ret2});

  const [fileUploadExtensions1, resolved1] = useResolvedExtensions<FeatureFlag>(isFeatureFlag);
  console.log({fileUploadExtensions1: fileUploadExtensions1, resolved1: resolved1});
  fileUploadExtensions1[0]?.properties.handler(featureFlagController);
  const ret = fileUploadExtensions1[1]?.properties.handler(featureFlagController);
  console.log({ret: ret});
  

  const [fileUploadExtensions, resolved] = useResolvedExtensions<ModelFeatureFlag>(isModelFeatureFlag);
  console.log({fileUploadExtensions: fileUploadExtensions, resolved: resolved});
  */

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
            error={!!stoError}
            isLoading={!stoLoaded || !subscriptionsLoaded}
          >
            <Link to={odfPath}>OpenShift Data Foundation - IBM</Link>
          </DetailItem>
          <DetailItem
            key="provider"
            title="Provider"
            error={!!stoError}
            isLoading={!stoLoaded}
          >
            <ExternalLink
              href={"https://" + endpointAddress} 
              text="IBM flashsystem"
            />
            </DetailItem>
          <DetailItem
            key="mode"
            title="Mode"
            error={!!stoError}
            isLoading={!stoLoaded}
          >
            External
          </DetailItem>
          <DetailItem
            key="storage-type"
            title="Storage Type"
            error={!!stoError}
            isLoading={!stoLoaded}
          >
            Block
          </DetailItem>
          <DetailItem
            key="version"
            title="Version"
            error={!!stoError}
            isLoading={!stoLoaded}
          >
            {odfVersion}
          </DetailItem>
        </DetailsBody>
      </DashboardCardBody>
    </DashboardCard>
  );
};

export default withDashboardResources(DetailsCard);

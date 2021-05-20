import * as React from 'react';
import * as _ from 'lodash';
import DashboardCard from '@console/shared/src/components/dashboard/dashboard-card/DashboardCard';
import DashboardCardBody from '@console/shared/src/components/dashboard/dashboard-card/DashboardCardBody';
import DashboardCardHeader from '@console/shared/src/components/dashboard/dashboard-card/DashboardCardHeader';
import DashboardCardTitle from '@console/shared/src/components/dashboard/dashboard-card/DashboardCardTitle';
import { EventKind, K8sResourceKind } from '@console/internal/module/k8s';
import { FirehoseResource, FirehoseResult } from '@console/internal/components/utils';
import { EventModel, PersistentVolumeClaimModel } from '@console/internal/models';
import ActivityBody, {
  RecentEventsBody,
  OngoingActivityBody,
} from '@console/shared/src/components/dashboard/activity-card/ActivityBody';
import { PrometheusResponse } from '@console/internal/components/graphs';
import { getNamespace } from '@console/shared';
import {
  DashboardItemProps,
  withDashboardResources,
} from '@console/internal/components/dashboard/with-dashboard-resources';
import { referenceForModel } from '@console/internal/module/k8s/k8s';
import { SubscriptionModel, SubscriptionKind } from '@console/operator-lifecycle-manager';
import { IBM_STORAGE_ODF_OPERATOR } from '../../../../constants/index';
import { DATA_RESILIENCY_QUERY, StorageDashboardQuery } from '../../../../constants/queries';
import { getResiliencyProgress } from '../../../../utils';
import {
   //OCSServiceModel, 
   StorageInstanceModel,     
  } from '../../../../models';
import { isClusterExpandActivity, ClusterExpandActivity } from './cluster-expand-activity';
import { isOCSUpgradeActivity, OCSUpgradeActivity } from './ocs-upgrade-activity';
import './activity-card.scss';
import {OdfDashboardContext} from '../../../../odf-dashboard';

const eventsResource: FirehoseResource = { isList: true, kind: EventModel.kind, prop: 'events' };
const subscriptionResource: FirehoseResource = {
  isList: true,
  kind: referenceForModel(SubscriptionModel),
  namespaced: false,
  prop: 'subs',
};

const storageClusterResource: FirehoseResource = {
  isList: true,
  kind: referenceForModel(StorageInstanceModel),
  namespaced: false,
  prop: 'storage-cluster',
};

export const getODFSubscription = (subscriptions: FirehoseResult): SubscriptionKind => {
  const itemsData: K8sResourceKind[] = subscriptions?.data;
  return _.find(itemsData, (item) => item?.spec?.name === IBM_STORAGE_ODF_OPERATOR) as SubscriptionKind;
};

const RecentEvent = withDashboardResources(
  ({ watchK8sResource, 
    stopWatchK8sResource, 
    resources }: DashboardItemProps) => {
    
    const { obj } = React.useContext(OdfDashboardContext);
    const namespace= obj?.metadata.namespace;
    const odfEventNamespaceKindFilter = (event: EventKind): boolean => {
      const eventKind = event?.involvedObject?.kind;
      const eventNamespace = getNamespace(event);
      return eventNamespace === namespace || eventKind === PersistentVolumeClaimModel.kind;
    };
    React.useEffect(() => {
      watchK8sResource(eventsResource);
      return () => {
        stopWatchK8sResource(eventsResource);
      };
    }, [watchK8sResource, stopWatchK8sResource]);
    return (
      <RecentEventsBody
        events={resources.events as FirehoseResult<EventKind[]>}
        filter={odfEventNamespaceKindFilter}
      />
    );
  },
);

const OngoingActivity = withDashboardResources(
  ({
    watchPrometheus,
    stopWatchPrometheusQuery,
    watchK8sResource,
    stopWatchK8sResource,
    resources,
    prometheusResults,
  }) => {
    React.useEffect(() => {
      watchK8sResource(subscriptionResource);
      watchK8sResource(storageClusterResource);
      watchPrometheus(DATA_RESILIENCY_QUERY[StorageDashboardQuery.RESILIENCY_PROGRESS]);
      return () => {
        stopWatchK8sResource(subscriptionResource);
        stopWatchK8sResource(storageClusterResource);
        stopWatchPrometheusQuery(DATA_RESILIENCY_QUERY[StorageDashboardQuery.RESILIENCY_PROGRESS]);
      };
    }, [watchPrometheus, stopWatchPrometheusQuery, watchK8sResource, stopWatchK8sResource]);

    const progressResponse = prometheusResults.getIn([
      DATA_RESILIENCY_QUERY[StorageDashboardQuery.RESILIENCY_PROGRESS],
      'data',
    ]) as PrometheusResponse;
    const progressError = prometheusResults.getIn([
      DATA_RESILIENCY_QUERY[StorageDashboardQuery.RESILIENCY_PROGRESS],
      'loadError',
    ]);
    const subscriptions = resources?.subs as FirehoseResult;
    const subscriptionsLoaded = subscriptions?.loaded;
    const odfSubscription: SubscriptionKind = getODFSubscription(subscriptions);

    const storageClusters = resources?.['storage-cluster'] as FirehoseResult;
    const storageClustersLoaded = storageClusters?.loaded;
    const ibmStorageODFCluster: K8sResourceKind = storageClusters?.data?.[0];

    const prometheusActivities = [];
    const resourceActivities = [];

    if (getResiliencyProgress(progressResponse) < 1) {
      prometheusActivities.push({
        results: progressResponse,
        loader: () => import('./data-resiliency-activity').then((m) => m.DataResiliency),
      });
    }
    if (isOCSUpgradeActivity(odfSubscription)) {
      resourceActivities.push({
        resource: odfSubscription,
        timestamp: odfSubscription?.status?.lastUpdated,
        loader: () => Promise.resolve(OCSUpgradeActivity),
      });
    }
    if (isClusterExpandActivity(ibmStorageODFCluster)) {
      resourceActivities.push({
        resource: ibmStorageODFCluster,
        timestamp: null,
        loader: () => Promise.resolve(ClusterExpandActivity),
      });
    }
    return (
      <OngoingActivityBody
        loaded={(progressResponse || progressError) && subscriptionsLoaded && storageClustersLoaded}
        resourceActivities={resourceActivities}
        prometheusActivities={prometheusActivities}
      />
    );
  },
);

export const ActivityCard: React.FC = React.memo(() => (
  <DashboardCard gradient>
    <DashboardCardHeader>
      <DashboardCardTitle>Activity</DashboardCardTitle>
    </DashboardCardHeader>
    <DashboardCardBody>
      <ActivityBody className="ceph-activity-card__body">
        <OngoingActivity />
        <RecentEvent />
      </ActivityBody>
    </DashboardCardBody>
  </DashboardCard>
));

export default withDashboardResources(ActivityCard);

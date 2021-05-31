import * as React from 'react';
import * as _ from 'lodash';
import { Gallery, GalleryItem } from '@patternfly/react-core';
import DashboardCard from '@console/shared/src/components/dashboard/dashboard-card/DashboardCard';
import DashboardCardBody from '@console/shared/src/components/dashboard/dashboard-card/DashboardCardBody';
import DashboardCardHeader from '@console/shared/src/components/dashboard/dashboard-card/DashboardCardHeader';
import DashboardCardTitle from '@console/shared/src/components/dashboard/dashboard-card/DashboardCardTitle';
import HealthBody from '@console/shared/src/components/dashboard/status-card/HealthBody';
import HealthItem from '@console/shared/src/components/dashboard/status-card/HealthItem';
import AlertsBody from '@console/shared/src/components/dashboard/status-card/AlertsBody';
import AlertItem from '@console/shared/src/components/dashboard/status-card/AlertItem';
import { alertURL } from '@console/internal/components/monitoring/utils';
import { FirehoseResource } from '@console/internal/components/utils/index';
import { referenceForModel } from '@console/internal/module/k8s/k8s';
import {
  withDashboardResources,
  DashboardItemProps,
} from '@console/internal/components/dashboard/with-dashboard-resources';
import { useK8sWatchResource } from '@console/internal/components/utils/k8s-watch-hook';
import { getStoHealthState, filterIBMFlashSystemAlerts } from './utils';
import { StorageInstanceKind } from '../../../../types';
import { StorageInstanceModel } from '../../../../models';
import {OdfDashboardContext} from '../../../../odf-dashboard';

export const IBMFlashSystemAlerts = withDashboardResources(
  ({ watchAlerts, stopWatchAlerts, notificationAlerts }) => {
    React.useEffect(() => {
      watchAlerts();
      return () => {
        stopWatchAlerts();
      };
    }, [watchAlerts, stopWatchAlerts]);
    //const { obj } = React.useContext(OdfDashboardContext);
    const { data, loaded, loadError } = notificationAlerts || {};
    const alerts = filterIBMFlashSystemAlerts(data);

    return (
      <AlertsBody error={!_.isEmpty(loadError)}>
        {loaded &&
          alerts.length > 0 &&
          alerts.map((alert) => <AlertItem key={alertURL(alert, alert.rule.id)} alert={alert} />)}
      </AlertsBody>
    );
  },
);

export const StatusCard: React.FC<DashboardItemProps> = ({
  }) => {
  /*
  var [storage] = useK8sGet<StorageInstanceKind>(
    StorageInstanceModel,
    'console-storage',
    'default',
  );
  */
  const { obj } = React.useContext(OdfDashboardContext);
  const stoClusterResource: FirehoseResource = {
    kind: referenceForModel(StorageInstanceModel),
    name:obj?.metadata.name,
    namespace: obj?.metadata.namespace,
    prop: 'sto'
  };
  
  const storageCRName = obj?.metadata.name;
  const [data, loaded, loadError] = useK8sWatchResource<StorageInstanceKind>(stoClusterResource);
  
  const stoHealthState = getStoHealthState({ sto: { data: [data], loaded: loaded, loadError: loadError } });
  //const [stoHealthState,setstoHealthState] = React.useState<SubsystemHealth>(null);
  //React.useEffect(() => {
  //  const tmpstoHealthState = getStoHealthState({ sto: { data: [data], loaded: loaded, loadError: loadError } });
  //  setstoHealthState(tmpstoHealthState);
  //}, [data]);

  return (
    <DashboardCard gradient>
      <DashboardCardHeader>
        <DashboardCardTitle>{storageCRName}</DashboardCardTitle>
      </DashboardCardHeader>
      <DashboardCardBody>
        <HealthBody>
          <Gallery className="co-overview-status__health" hasGutter>
            <GalleryItem>
              <HealthItem
                title={stoHealthState?.state} //"System Status"
                state={stoHealthState?.state}
                details={stoHealthState?.message}
              />
            </GalleryItem>
          </Gallery>
        </HealthBody>
        <IBMFlashSystemAlerts/>
      </DashboardCardBody>
    </DashboardCard>
  );
};

export default withDashboardResources(StatusCard);

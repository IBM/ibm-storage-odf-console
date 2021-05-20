import * as React from 'react';
import * as _ from 'lodash';
import DashboardCard from '@console/shared/src/components/dashboard/dashboard-card/DashboardCard';
import DashboardCardBody from '@console/shared/src/components/dashboard/dashboard-card/DashboardCardBody';
import DashboardCardHeader from '@console/shared/src/components/dashboard/dashboard-card/DashboardCardHeader';
import DashboardCardTitle from '@console/shared/src/components/dashboard/dashboard-card/DashboardCardTitle';
import {
  DashboardItemProps,
  withDashboardResources,
} from '@console/internal/components/dashboard/with-dashboard-resources';
import { FirehoseResource } from '@console/internal/components/utils';
import { K8sResourceKind } from '@console/internal/module/k8s';
import { ResourceInventoryItem } from '@console/shared/src/components/dashboard/inventory-card/InventoryItem';
import {
  PersistentVolumeModel,
  PersistentVolumeClaimModel,
  StorageClassModel,
  PodModel,
} from '@console/internal/models';
import {
  getCustomizedPVCs,
  getCustomizedSC,
  getCustomizedPVs,
  getCustomizedPods,
} from '../../../selectors';
import {
  getPVCStatusGroups,
  getPVStatusGroups,
  getPodStatusGroups,
} from '@console/shared/src/components/dashboard/inventory-card/utils';
//import {OdfDashboardContext} from '../../../odf-dashboard';

const pvcResource: FirehoseResource = {
  isList: true,
  kind: PersistentVolumeClaimModel.kind,
  prop: 'pvcs',
};
const scResource: FirehoseResource = {
  isList: true,
  kind: StorageClassModel.kind,
  prop: 'sc',
};
const pvResource: FirehoseResource = {
  isList: true,
  kind: PersistentVolumeModel.kind,
  prop: 'pvs',
};
const podResource: FirehoseResource = {
  isList: true,
  kind: PodModel.kind,
  prop: 'pods',
};

export const InventoryCard: React.FC<DashboardItemProps> = ({
  watchK8sResource,
  stopWatchK8sResource,
  resources,
}) => {
  //const { obj } = React.useContext(OdfDashboardContext);

  React.useEffect(() => {
    //watchK8sResource(ocsResource);
    watchK8sResource(pvcResource);
    watchK8sResource(scResource);
    watchK8sResource(pvResource);
    watchK8sResource(podResource);
    return () => {
      //stopWatchK8sResource(ocsResource);
      stopWatchK8sResource(pvcResource);
      stopWatchK8sResource(scResource);
      stopWatchK8sResource(pvResource);
      stopWatchK8sResource(podResource);
    };
  }, [watchK8sResource, stopWatchK8sResource]);

  const currentProvisioner = "block.csi.ibm.com";

  const pvcsLoaded = _.get(resources.pvcs, 'loaded');
  const pvcsLoadError = _.get(resources.pvcs, 'loadError');
  const pvcsData = _.get(resources.pvcs, 'data', []) as K8sResourceKind[];

  const pvsLoaded = _.get(resources.pvs, 'loaded');
  const pvsLoadError = _.get(resources.pvs, 'loadError');
  const pvsData = _.get(resources.pvs, 'data', []) as K8sResourceKind[];

  const podsLoaded = _.get(resources.pods, 'loaded');
  const podsLoadError = _.get(resources.pods, 'loadError');
  const podsData = _.get(resources.pods, 'data', []) as K8sResourceKind[];

  const scLoaded = _.get(resources.sc, 'loaded');
  const scLoadError = _.get(resources.sc, 'loadError');
  const scData = _.get(resources.sc, 'data', []) as K8sResourceKind[];
  const filteredSC = getCustomizedSC(scData, currentProvisioner);
  const filteredSCNames = filteredSC.map((sc) => _.get(sc, 'metadata.name'));

  const scHref = `/k8s/cluster/storageclasses?rowFilter-sc-provisioner=${currentProvisioner}`;
  const pvcHref = `/k8s/all-namespaces/persistentvolumeclaims?rowFilter-pvc-provisioner=${currentProvisioner}`;
  const pvHref = `/k8s/cluster/persistentvolumes?rowFilter-pv-provisioner=${currentProvisioner}`;
  const podHref = `/k8s/cluster/pods?rowFilter-pod-provisioner=${currentProvisioner}`;

  const filteredPVCs = getCustomizedPVCs(filteredSCNames, pvcsData, pvsData, currentProvisioner);

  return (
    <DashboardCard>
      <DashboardCardHeader>
        <DashboardCardTitle>Inventory</DashboardCardTitle>
      </DashboardCardHeader>
      <DashboardCardBody>
        <ResourceInventoryItem
          isLoading={!scLoaded}
          error={!!scLoadError}
          kind={StorageClassModel}
          resources={filteredSC}
          //mapper={getPVCStatusGroups}
          showLink={true}
          basePath={scHref}
        />
        <ResourceInventoryItem
          isLoading={!pvcsLoaded}
          error={!!pvcsLoadError}
          kind={PersistentVolumeClaimModel}
          resources={filteredPVCs}
          mapper={getPVCStatusGroups}
          showLink={true}
          basePath={pvcHref}
        />
        <ResourceInventoryItem
          isLoading={!pvsLoaded}
          error={!!pvsLoadError}
          kind={PersistentVolumeModel}
          resources={getCustomizedPVs(pvsData, currentProvisioner)}
          mapper={getPVStatusGroups}
          showLink={true}
          basePath={pvHref}
        />
        <ResourceInventoryItem
          isLoading={!podsLoaded}
          error={!!podsLoadError}
          kind={PodModel}
          resources={getCustomizedPods(podsData, currentProvisioner, filteredPVCs)}
          mapper={getPodStatusGroups}
          showLink={true}
          basePath={podHref}
        />
      </DashboardCardBody>
    </DashboardCard>
  );
};

export default withDashboardResources(InventoryCard);

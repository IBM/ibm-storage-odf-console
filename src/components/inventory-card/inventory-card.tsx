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
//import { useTranslation } from 'react-i18next';
import { 
  DashboardCard,
  DashboardCardHeader,
  DashboardCardTitle,
  DashboardCardBody,
  ResourceInventoryItem,
 } from "@console/dynamic-plugin-sdk/provisional";
import { FirehoseResource, K8sResourceCommon } from "@console/dynamic-plugin-sdk";
import {
  useK8sWatchResource,
} from "@console/dynamic-plugin-sdk/api";
import {
  PersistentVolumeModel,
  PersistentVolumeClaimModel,
  StorageClassModel,
  PodModel,
} from '../../models';
import {
  getCustomizedPVCs,
  getCustomizedSC,
  getCustomizedPVs,
  getCustomizedPods,
} from '../../selectors/index';
import {IBM_STORAGE_CSI_PROVISIONER} from '../../constants/index';
import {
  getPVCStatusGroups,
  getPodStatusGroups,
  getPVStatusGroups,
} from './utils';

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

export const InventoryCard: React.FC<any> = (props) => {
  //const { t } = useTranslation();
  const currentProvisioner = IBM_STORAGE_CSI_PROVISIONER;

  const [pvcsData, pvcsLoaded, pvcsLoadError] = useK8sWatchResource<K8sResourceCommon[]>(pvcResource);
  
  //const pvcsLoaded = _.get(resources.pvcs, 'loaded');
  //const pvcsLoadError = _.get(resources.pvcs, 'loadError');
  //const pvcsData = _.get(resources.pvcs, 'data', []) as K8sResourceKind[];

  const [pvsData, pvsLoaded, pvsLoadError] = useK8sWatchResource<K8sResourceCommon[]>(pvResource);
  //const pvsLoaded = _.get(resources.pvs, 'loaded');
  //const pvsLoadError = _.get(resources.pvs, 'loadError');
  //const pvsData = _.get(resources.pvs, 'data', []) as K8sResourceKind[];

  const [podsData, podsLoaded, podsLoadError] = useK8sWatchResource<K8sResourceCommon[]>(podResource);
  //const podsLoaded = _.get(resources.pods, 'loaded');
  //const podsLoadError = _.get(resources.pods, 'loadError');
  //const podsData = _.get(resources.pods, 'data', []) as K8sResourceKind[];

  const [scData, scLoaded, scLoadError] = useK8sWatchResource<K8sResourceCommon[]>(scResource);
  //const scLoaded = _.get(resources.sc, 'loaded');
  //const scLoadError = _.get(resources.sc, 'loadError');
  //const scData = _.get(resources.sc, 'data', []) as K8sResourceKind[];
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

export default InventoryCard;

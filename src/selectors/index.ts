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
import * as _ from 'lodash';
import { Alert } from '@console/internal/components/monitoring/types';
import { K8sResourceKind, PodKind } from '@console/internal/module/k8s';
import { FirehoseResult, convertToBaseValue } from '@console/internal/components/utils';
import { cephStorageProvisioners } from '@console/shared/src/utils';
import { IBM_STORAGE_ODF_OPERATOR } from '../constants';
import { getPodVolumes } from '@console/shared/src/selectors/pod';

export const cephStorageLabel = 'cluster.ocs.openshift.io/openshift-storage';

const enum status {
  BOUND = 'Bound',
  AVAILABLE = 'Available',
}
export const filterCephAlerts = (alerts: Alert[]): Alert[] =>
  alerts.filter((alert) => _.get(alert, 'annotations.storage_type') === 'ceph');

export const getCephPVs = (pvsData: K8sResourceKind[] = []): K8sResourceKind[] =>
  pvsData.filter((pv) => {
    return cephStorageProvisioners.some((provisioner: string) =>
      _.get(pv, 'metadata.annotations["pv.kubernetes.io/provisioned-by"]', '').includes(
        provisioner,
      ),
    );
  });

export const getCustomizedPVs = (pvsData: K8sResourceKind[] = [], currentProvisioner: string,): K8sResourceKind[] =>
  pvsData.filter((pv) => {
    return [currentProvisioner].some((provisioner: string) =>
      _.get(pv, 'metadata.annotations["pv.kubernetes.io/provisioned-by"]', '').includes(
        provisioner,
      ),
    );
  });

const getPVStorageClass = (pv: K8sResourceKind) => _.get(pv, 'spec.storageClassName');
const getStorageClassName = (pvc: K8sResourceKind) =>
  _.get(pvc, ['metadata', 'annotations', 'volume.beta.kubernetes.io/storage-class']) ||
  _.get(pvc, 'spec.storageClassName');
const isBound = (pvc: K8sResourceKind) => pvc.status.phase === status.BOUND;

export const getCephPVCs = (
  cephSCNames: string[] = [],
  pvcsData: K8sResourceKind[] = [],
  pvsData: K8sResourceKind[] = [],
): K8sResourceKind[] => {
  const cephPVs = getCephPVs(pvsData);
  const cephSCNameSet = new Set<string>([...cephSCNames, ...cephPVs.map(getPVStorageClass)]);
  const cephBoundPVCUIDSet = new Set<string>(_.map(cephPVs, 'spec.claimRef.uid'));
  // If the PVC is bound use claim uid(links PVC to PV) else storage class to verify it's provisioned by ceph.
  return pvcsData.filter((pvc: K8sResourceKind) =>
    isBound(pvc)
      ? cephBoundPVCUIDSet.has(pvc.metadata.uid)
      : cephSCNameSet.has(getStorageClassName(pvc)),
  );
};

export const getCustomizedPVCs = (
  customSCNames: string[] = [],
  pvcsData: K8sResourceKind[] = [],
  pvsData: K8sResourceKind[] = [],
  currentProvisioner: string,
): K8sResourceKind[] => {
  const customPVs = getCustomizedPVs(pvsData, currentProvisioner);
  const customSCNameSet = new Set<string>([...customSCNames, ...customPVs.map(getPVStorageClass)]);
  const customBoundPVCUIDSet = new Set<string>(_.map(customPVs, 'spec.claimRef.uid'));
  // If the PVC is bound use claim uid(links PVC to PV) else storage class to verify it's provisioned by custom.
  return pvcsData.filter((pvc: K8sResourceKind) =>
    isBound(pvc)
      ? customBoundPVCUIDSet.has(pvc.metadata.uid)
      : customSCNameSet.has(getStorageClassName(pvc)),
  );
};

export const getCustomizedSC = (scData: K8sResourceKind[], provisionerName: string): K8sResourceKind[] =>
  scData.filter((sc) => {
    return [provisionerName].some((provisioner: string) =>
      _.get(sc, 'provisioner', '').includes(provisioner),
    );
  });

export const getPodPVCs = (pod: PodKind): string[] => {
  const podVols = getPodVolumes(pod);
  const podPVCsSet = new Set<string>(_.map(podVols, 'persistentVolumeClaim.claimName'));
  const podPVCsTmp = [...podPVCsSet];
  const podPVCs = podPVCsTmp.map(v => v === undefined ? 'Unknown' : v);
  return podPVCs;
}

export const getCustomizedPods = (podData: K8sResourceKind[], provisionerName: string, pvcsData: K8sResourceKind[]): K8sResourceKind[] =>{
  var filterPods:K8sResourceKind[] = [];
  var flag:boolean = false;
  for(let pod of podData) {
    const podPVCS = getPodPVCs(pod as PodKind);
    for(let pvc of podPVCS) {
      for(let pvc2 of pvcsData){
        if(pvc == pvc2.metadata.name ){
          filterPods.push(pod);
          flag = true;
          break;
        }
      }
      if(flag) break;
    }
    flag = false;
  }
  return filterPods;
}

export const getIBMStorageODFVersion = (items: FirehoseResult): string => {
  const itemsData: K8sResourceKind[] = _.get(items, 'data');
  const operator: K8sResourceKind = _.find(
    itemsData,
    (item) => _.get(item, 'spec.name') === IBM_STORAGE_ODF_OPERATOR,
  );
  return _.get(operator, 'status.installedCSV');
};

export const calcPVsCapacity = (pvs: K8sResourceKind[]): number =>
  pvs.reduce((sum, pv) => {
    const storage = Number(convertToBaseValue(pv.spec.capacity.storage));
    return sum + storage;
  }, 0);

export const getSCAvailablePVs = (pvsData: K8sResourceKind[], sc: string): K8sResourceKind[] =>
  pvsData.filter((pv) => getPVStorageClass(pv) === sc && pv.status.phase === status.AVAILABLE);

export const getVendor = (storage: K8sResourceKind) =>
  _.get(storage, ['spec', 'vendor']);

export const getDriverName = (storage: K8sResourceKind) =>
  _.get(storage, ['spec', 'driverEndpoint', 'driverName']);

export const getId = (storage: K8sResourceKind) =>
  _.get(storage, ['status', 'id']);

export const getVersion = (storage: K8sResourceKind) =>
  _.get(storage, ['status', 'version']);

export const getEndpoint = (storage: K8sResourceKind) =>
  _.get(storage, ['spec', 'endpoint']);

export const getMetricsName = (storage: K8sResourceKind, metricsKey: string) =>
  _.get(storage, ['spec', 'driverEndpoint', 'metrics', metricsKey]);

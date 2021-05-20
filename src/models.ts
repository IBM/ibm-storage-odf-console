import { K8sKind } from '@console/internal/module/k8s';

export const StorageInstanceModel: K8sKind = {
  label: 'Storage System',
  labelPlural: 'Storage Systems',
  apiVersion: 'v1alpha1',
  apiGroup: 'odf.ibm.com',
  plural: 'flashsystemclusters',
  abbr: 'SS',
  namespaced: true,
  kind: 'FlashSystemCluster', 
  id: 'StorageSystem',
  crd: true,
};

export const StorageClassTraitModel: K8sKind = {
  label: 'Storage Class Capability',
  labelPlural: 'Storage Class Capabilities',
  apiVersion: 'v1alpha1',
  apiGroup: 'storage.ibm.com',
  plural: 'storageclasstraits',
  abbr: 'SCT',
  namespaced: false,
  kind: 'StorageClassTrait', 
  id: 'StorageClassTraitkind',
  crd: true,
};

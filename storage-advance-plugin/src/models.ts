//import { K8sKind } from '@console/internal/module/k8s';

export type K8sKind = {
  abbr: string;
  kind: string;
  label: string;
  labelKey?: string;
  labelPlural: string;
  labelPluralKey?: string;
  plural: string;
  propagationPolicy?: 'Foreground' | 'Background';

  id?: string;
  crd?: boolean;
  apiVersion: string;
  apiGroup?: string;
  namespaced?: boolean;
  //selector?: Selector;
  labels?: { [key: string]: string };
  annotations?: { [key: string]: string };
  //verbs?: K8sVerb[];
  shortNames?: string[];
  //badge?: BadgeType;
  color?: string;

  // Legacy option for supporing plural names in URL paths when `crd: true`.
  // This should not be set for new models, but is needed to avoid breaking
  // existing links as we transition to using the API group in URL paths.
  legacyPluralURL?: boolean;
};

export const StorageInstanceModel: K8sKind = {
  label: 'StorageInstance',
  labelPlural: 'StorageInstances',
  apiVersion: 'v1',
  apiGroup: 'ocs.ibm.com',
  plural: 'ocsmanagedstorages',
  abbr: 'OMS',
  namespaced: true,
  kind: 'OCSManagedStorage', // OCSStorageExtension 
  id: 'StorageInstancekind',
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

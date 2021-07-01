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
import { K8sKind } from './types';

export const StorageInstanceModel: K8sKind = {
  label: 'IBM Flash System',
  labelPlural: 'IBM Flash Systems',
  apiVersion: 'v1alpha1',
  apiGroup: 'odf.ibm.com',
  plural: 'flashsystemclusters',
  abbr: 'FS',
  namespaced: true,
  kind: 'FlashSystemCluster', 
  crd: true,
};

export const SubscriptionModel: K8sKind = {
  kind: 'Subscription',
  label: 'Subscription',
  labelPlural: 'Subscriptions',
  apiGroup: 'operators.coreos.com',
  apiVersion: 'v1alpha1',
  abbr: 'SUB',
  namespaced: true,
  crd: true,
  plural: 'subscriptions',
  legacyPluralURL: true,
};

export const ClusterServiceVersionModel: K8sKind = {
  kind: 'ClusterServiceVersion',
  label: 'ClusterServiceVersion',
  labelPlural: 'ClusterServiceVersions',
  apiGroup: 'operators.coreos.com',
  apiVersion: 'v1alpha1',
  abbr: 'CSV',
  namespaced: true,
  crd: true,
  plural: 'clusterserviceversions',
  propagationPolicy: 'Foreground',
  legacyPluralURL: true,
};

export const SecretModel: K8sKind = {
  apiVersion: 'v1',
  apiGroup: 'core',
  label: 'Secret',
  labelKey: 'public~Secret',
  plural: 'secrets',
  abbr: 'S',
  namespaced: true,
  kind: 'Secret',
  id: 'secret',
  labelPlural: 'Secrets',
  labelPluralKey: 'public~Secrets',
};

export const PersistentVolumeClaimModel: K8sKind = {
  label: 'PersistentVolumeClaim',
  // t('public~PersistentVolumeClaim')
  labelKey: 'public~PersistentVolumeClaim',
  apiVersion: 'v1',
  plural: 'persistentvolumeclaims',
  abbr: 'PVC',
  namespaced: true,
  kind: 'PersistentVolumeClaim',
  id: 'persistentvolumeclaim',
  labelPlural: 'PersistentVolumeClaims',
  // t('public~PersistentVolumeClaims')
  labelPluralKey: 'public~PersistentVolumeClaims',
};

export const EventModel: K8sKind = {
  apiVersion: 'v1',
  label: 'Event',
  // t('public~Event')
  labelKey: 'public~Event',
  plural: 'events',
  abbr: 'E',
  namespaced: true,
  kind: 'Event',
  id: 'event',
  labelPlural: 'Events',
  // t('public~Events')
  labelPluralKey: 'public~Events',
};

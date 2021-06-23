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

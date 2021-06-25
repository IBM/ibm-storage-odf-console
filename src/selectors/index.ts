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

import {
  K8sKind,
} from "../types";
import { IBM_STORAGE_ODF_OPERATOR } from '../constants';

export const referenceForModel = (storage: K8sKind) => {
  const kind=`${storage.apiGroup}~${storage.apiVersion}~${storage.kind}`;
  return kind;
}

export const resourcePathFromModel = (model: K8sKind, name?: string, namespace?: string) => {
  const { plural, namespaced, crd } = model;

  let url = '/k8s/';

  if (!namespaced) {
    url += 'cluster/';
  }

  if (namespaced) {
    url += namespace ? `ns/${namespace}/` : 'all-namespaces/';
  }

  if (crd) {
    url += referenceForModel(model);
  } else if (plural) {
    url += plural;
  }

  if (name) {
    // Some resources have a name that needs to be encoded. For instance,
    // Users can have special characters in the name like `#`.
    url += `/${encodeURIComponent(name)}`;
  }

  return url;
};

export const getIBMStorageODFVersion = (items: K8sKind[]): string => {
  const itemsData: K8sKind[] = items;
  const operator: K8sKind = _.find(
    itemsData,
    (item) => _.get(item, 'spec.name') === IBM_STORAGE_ODF_OPERATOR,
  );
  return _.get(operator, 'status.installedCSV');
};

export const getVendor = (storage: K8sKind) =>
  _.get(storage, ['spec', 'vendor']);

export const getDriverName = (storage: K8sKind) =>
  _.get(storage, ['spec', 'driverEndpoint', 'driverName']);

export const getId = (storage: K8sKind) =>
  _.get(storage, ['status', 'id']);

export const getVersion = (storage: K8sKind) =>
  _.get(storage, ['status', 'version']);

export const getEndpoint = (storage: K8sKind) =>
  _.get(storage, ['spec', 'endpoint']);

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
import * as models from './models';
import {
  ClusterServiceVersionAction,
  DashboardsCard,
  DashboardsTab,
  HorizontalNavTab,
  KebabActions,
  ModelDefinition,
  ModelFeatureFlag,
  Plugin,
  ResourceTabPage,
  RoutePage,
  ResourceDetailsPage,
  DashboardsOverviewResourceActivity,
  CustomFeatureFlag,
  StorageClassProvisioner,
} from '@console/plugin-sdk';
//import { GridPosition } from '@console/shared/src/components/dashboard/DashboardGrid';
import { referenceForModel } from '@console/internal/module/k8s';
import { StorageClassFormProvisoners } from './utils/odf-storageclass-param';
import { ClusterServiceVersionModel } from '@console/operator-lifecycle-manager/src/models';

type ConsumedExtensions =
  | ModelFeatureFlag
  | HorizontalNavTab
  | ModelDefinition
  | DashboardsTab
  | DashboardsCard
  | RoutePage
  | CustomFeatureFlag
  | ClusterServiceVersionAction
  | KebabActions
  | ResourceDetailsPage
  | ResourceTabPage
  | ClusterServiceVersionAction
  | KebabActions
  | DashboardsOverviewResourceActivity
  | StorageClassProvisioner;

const plugin: Plugin<ConsumedExtensions> = [
  {
    type: 'ModelDefinition',
    properties: {
      models: _.values(models),
    },
  },
  {
    type: 'StorageClass/Provisioner',
    properties: {
      getStorageClassProvisioner: StorageClassFormProvisoners,
    },
  },
  {
    type: 'Page/Route',
    properties: {
      exact: true,
      path: `/k8s/ns/:ns/${ClusterServiceVersionModel.plural}/:appName/${referenceForModel(models.StorageInstanceModel)}/~new`,
      loader: () =>
        import('./components/create-storage-instance/create-storage-instance').then(
          (m) => m.StorageInstance,
        ),
    },
  },
  
  /*
  {
    type: 'Dashboards/Tab',
    properties: {
      navSection: 'home',
      id: 'storage-advance',
      title: 'OCS Managed Storages',
    },
  },
  {
    type: 'Page/Route',
    properties: {
      path: `/k8s/ns/:ns/${referenceForModel(models.StorageInstanceModel)}/~new/form`,
      loader: () =>
        import(
          './components/create-storage-instance/create-storage-instance' 
        ).then((m) => m.StorageInstance()),
    },
  },
  {
    type: 'Page/Route',
    properties: {
      path: `/k8s/all-namespaces/${referenceForModel(models.StorageInstanceModel)}/~new/form`,
      loader: () =>
        import(
          './components/create-storage-instance/create-storage-instance' 
        ).then((m) => m.StorageInstance()),
    },
  },
  */
  
];

export default plugin;

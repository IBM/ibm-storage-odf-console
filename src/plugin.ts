import * as _ from 'lodash';
import * as models from './models';
import {
  ClusterServiceVersionAction,
  DashboardsCard,
  DashboardsOverviewUtilizationItem,
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
//import { referenceForModel } from '@console/internal/module/k8s';

type ConsumedExtensions =
  | ModelFeatureFlag
  | HorizontalNavTab
  | ModelDefinition
  | DashboardsTab
  | DashboardsCard
  | DashboardsOverviewUtilizationItem
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

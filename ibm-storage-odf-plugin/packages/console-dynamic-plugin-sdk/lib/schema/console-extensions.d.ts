import { FeatureFlag, FooFeatureFlag, ModelFeatureFlag } from '../extensions/feature-flags';
import { CreateIBMStorage } from '../extensions/ibm-storage';
import { ReduxReducer } from '../extensions/redux';
import { ContextProvider } from '../extensions/context-providers';
import { StandaloneRoutePage, RoutePage, ResourceDetailsPage, ResourceListPage, ResourceTabPage } from '../extensions/pages';
import { YAMLTemplate } from '../extensions/yaml-templates';
import { AddAction } from '../extensions/add-actions';
import { ClusterGlobalConfig } from '../extensions/cluster-settings';
import { HrefNavItem, ResourceNSNavItem, ResourceClusterNavItem, Separator, NavSection } from '../extensions/navigation';
import { SupportedCatalogExtensions } from '../extensions/catalog';
import { FileUpload } from '../extensions/file-upload';
import { ModelMetadata } from '../extensions/resource-metadata';
import { AlertAction } from '../extensions/notification-alert';
import { PVCCreateProp, PVCStatus, PVCAlert, PVCDelete } from '../extensions/pvc';
import { StorageProvider } from '../extensions/storage-provider';
import { TelemetryListener } from '../extensions/telemetry';
import { SupportedActionExtensions } from '../extensions/actions';
import { SupportedTopologyDetailsExtensions } from '../extensions/topology-details';
import { DashboardsTab, DashboardsCard, DashboardsOverviewHealthPrometheusSubsystem, DashboardsOverviewURLSubsystem, DashboardsOverviewHealthResourceSubsystem, DashboardsOverviewHealthOperator, DashboardsInventoryItemGroup, DashboardsOverviewInventoryItem, DashboardsOverviewResourceActivity } from '../extensions/dashboards';
export declare type SupportedExtension = CreateIBMStorage | FeatureFlag | FooFeatureFlag | ModelFeatureFlag | ReduxReducer | ContextProvider | StandaloneRoutePage | PVCCreateProp | PVCStatus | PVCAlert | PVCDelete | YAMLTemplate | AddAction | ClusterGlobalConfig | HrefNavItem | ResourceNSNavItem | ResourceClusterNavItem | Separator | NavSection | FileUpload | ModelMetadata | AlertAction | StorageProvider | TelemetryListener | SupportedCatalogExtensions | SupportedActionExtensions | SupportedTopologyDetailsExtensions | RoutePage | ResourceListPage | ResourceTabPage | ResourceDetailsPage | DashboardsTab | DashboardsCard | DashboardsOverviewHealthPrometheusSubsystem | DashboardsOverviewURLSubsystem | DashboardsOverviewHealthResourceSubsystem | DashboardsOverviewHealthOperator | DashboardsInventoryItemGroup | DashboardsOverviewInventoryItem | DashboardsOverviewResourceActivity;
/**
 * Schema of Console plugin's `console-extensions.json` file.
 */
export declare type ConsoleExtensionsJSON = SupportedExtension[];

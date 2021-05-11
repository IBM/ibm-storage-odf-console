/// <reference types="react" />
import { TFunction } from 'i18next';
import { Extension, ExtensionDeclaration, CodeRef } from '../types';
import { HealthState, K8sResourceCommon, PrometheusResponse, ResourcesObject, StatusGroupMapper, WatchK8sResources, WatchK8sResults, FirehoseResource, FirehoseResourcesResult, FirehoseResult } from './console-types';
/** Adds a new dashboard tab, placed after the Overview tab. */
export declare type DashboardsTab = ExtensionDeclaration<'console.dashboards/tab', {
    /** A unique tab identifier, used as tab link `href` and when adding cards to this tab. */
    id: string;
    /** The title of the tab. */
    title: string;
}>;
/** Adds a new dashboard card. */
export declare type DashboardsCard = ExtensionDeclaration<'console.dashboards/card', {
    /** The id of the dashboard tab to which the card will be added. */
    tab: string;
    /** The grid position of the card on the dashboard. */
    position: 'LEFT' | 'RIGHT' | 'MAIN';
    /** Dashboard card component. */
    loader: CodeRef<React.ComponentType>;
    /** Card's vertical span in the column. Ignored for small screens, defaults to 12. */
    span?: DashboardCardSpan;
}>;
/** Adds a health subsystem to the status card of Overview dashboard where the source of status is Prometheus. */
export declare type DashboardsOverviewHealthPrometheusSubsystem = ExtensionDeclaration<'console.dashboards/overview/health/prometheus', {
    /** The display name of the subsystem. */
    title: string;
    /** Resolve the subsystem's health. */
    healthHandler: CodeRef<PrometheusHealthHandler>;
    /** Additional resource which will be fetched and passed to `healthHandler`. */
    additionalResource?: CodeRef<FirehoseResource>;
    /** Loader for popup content. If defined, a health item will be represented as a link which opens popup with given content. */
    popupComponent?: CodeRef<React.ComponentType<PrometheusHealthPopupProps>>;
    /** The title of the popover. */
    popupTitle?: string;
    /** Cloud providers which for which the subsystem should be hidden. */
    disallowedProviders?: string[];
}>;
/** Adds a health subsystem to the status card of Overview dashboard where the source of status is a K8s REST API. */
export declare type DashboardsOverviewURLSubsystem<T = any, R extends K8sResourceCommon | K8sResourceCommon[] = K8sResourceCommon | K8sResourceCommon[]> = ExtensionDeclaration<'console.dashboards/overview/health/url', {
    /** The display name of the subsystem. */
    title: string;
    /** The URL to fetch data from. It will be prefixed with base k8s URL. */
    url: string;
    /** Resolve the subsystem's health. */
    healthHandler: CodeRef<URLHealthHandler<T>>;
    /** Additional resource which will be fetched and passed to `healthHandler`. */
    additionalResource?: CodeRef<FirehoseResource>;
    /** Loader for popup content. If defined, a health item will be represented as a link which opens popup with given content. */
    popupComponent?: CodeRef<React.ComponentType<{
        healthResult?: T;
        healthResultError?: any;
        k8sResult?: FirehoseResult<R>;
    }>>;
    /** The title of the popover. */
    popupTitle?: string;
}>;
/** Adds a health subsystem to the status card of Overview dashboard where the source of status is a K8s Resource. */
export declare type DashboardsOverviewHealthResourceSubsystem<T extends ResourcesObject = ResourcesObject> = ExtensionDeclaration<'console.dashboards/overview/health/resource', {
    /** The display name of the subsystem. */
    title: string;
    /** Kubernetes resources which will be fetched and passed to `healthHandler`. */
    resources: CodeRef<WatchK8sResources<T>>;
    /** Resolve the subsystem's health. */
    healthHandler: CodeRef<ResourceHealthHandler<T>>;
    /** Loader for popup content. If defined, a health item will be represented as a link which opens popup with given content. */
    popupComponent?: CodeRef<WatchK8sResults<T>>;
    /** The title of the popover. */
    popupTitle?: string;
}>;
/** Adds a health subsystem to the status card of Overview dashboard where the source of status is a K8s REST API. */
export declare type DashboardsOverviewHealthOperator<T extends K8sResourceCommon = K8sResourceCommon> = ExtensionDeclaration<'console.dashboards/overview/health/operator', {
    /** Title of operators section in the popup. */
    title: string;
    /** Kubernetes resources which will be fetched and passed to `healthHandler`. */
    resources: CodeRef<FirehoseResource[]>;
    /** Resolves status for the operators. */
    getOperatorsWithStatuses?: CodeRef<GetOperatorsWithStatuses<T>>;
    /** Loader for popup row component. */
    operatorRowLoader?: CodeRef<React.ComponentType<OperatorRowProps<T>>>;
    /** Links to all resources page. If not provided then a list page of the first resource from resources prop is used. */
    viewAllLink?: string;
}>;
/** Adds an inventory status group. */
export declare type DashboardsInventoryItemGroup = ExtensionDeclaration<'console.dashboards/inventory/item/group', {
    /** The id of the status group. */
    id: string;
    /** React component representing the status group icon. */
    icon: CodeRef<React.ReactElement>;
}>;
/** Adds a resource tile to the overview inventory card. */
export declare type DashboardsOverviewInventoryItem<T extends K8sResourceCommon = K8sResourceCommon, R extends {
    [key: string]: K8sResourceCommon[];
} = {}> = ExtensionDeclaration<'console.dashboards/inventory/item', {
    /** The model for `resource` which will be fetched. Used to get the model's `label` or `abbr`. */
    model: CodeRef<T>;
    /** Function which maps various statuses to groups. */
    mapper?: CodeRef<StatusGroupMapper<T, R>>;
    /** Additional resources which will be fetched and passed to the `mapper` function. */
    additionalResources?: CodeRef<WatchK8sResources<R>>;
}>;
/** Adds an activity to the Activity Card of Overview Dashboard where the triggering of activity is based on watching a K8s resource. */
export declare type DashboardsOverviewResourceActivity<T extends K8sResourceCommon = K8sResourceCommon> = ExtensionDeclaration<'console.dashboards/overview/activity/resource', {
    /** The utilization item to be replaced. */
    k8sResource: CodeRef<FirehoseResource & {
        isList: true;
    }>;
    /** Function which determines if the given resource represents the action. If not defined, every resource represents activity. */
    isActivity?: CodeRef<(resource: T) => boolean>;
    /** Timestamp for the given action, which will be used for ordering. */
    getTimestamp?: CodeRef<(resource: T) => Date>;
    /** Loader for the corresponding action component. */
    loader: CodeRef<React.ComponentType<K8sActivityProps<T>>>;
}>;
export declare const isDashboardsTab: (e: Extension<any>) => e is ExtensionDeclaration<"console.dashboards/tab", {
    /** A unique tab identifier, used as tab link `href` and when adding cards to this tab. */
    id: string;
    /** The title of the tab. */
    title: string;
}>;
export declare const isDashboardsCard: (e: Extension<any>) => e is ExtensionDeclaration<"console.dashboards/card", {
    /** The id of the dashboard tab to which the card will be added. */
    tab: string;
    /** The grid position of the card on the dashboard. */
    position: "LEFT" | "RIGHT" | "MAIN";
    /** Dashboard card component. */
    loader: CodeRef<import("react").ComponentType<{}>>;
    /** Card's vertical span in the column. Ignored for small screens, defaults to 12. */
    span?: DashboardCardSpan;
}>;
export declare const isDashboardsOverviewHealthPrometheusSubsystem: (e: Extension<any>) => e is ExtensionDeclaration<"console.dashboards/overview/health/prometheus", {
    /** The display name of the subsystem. */
    title: string;
    /** Resolve the subsystem's health. */
    healthHandler: CodeRef<PrometheusHealthHandler>;
    /** Additional resource which will be fetched and passed to `healthHandler`. */
    additionalResource?: CodeRef<FirehoseResource>;
    /** Loader for popup content. If defined, a health item will be represented as a link which opens popup with given content. */
    popupComponent?: CodeRef<import("react").ComponentType<PrometheusHealthPopupProps>>;
    /** The title of the popover. */
    popupTitle?: string;
    /** Cloud providers which for which the subsystem should be hidden. */
    disallowedProviders?: string[];
}>;
export declare const isDashboardsOverviewURLSubsystem: (e: Extension<any>) => e is ExtensionDeclaration<"console.dashboards/overview/health/url", {
    /** The display name of the subsystem. */
    title: string;
    /** The URL to fetch data from. It will be prefixed with base k8s URL. */
    url: string;
    /** Resolve the subsystem's health. */
    healthHandler: CodeRef<URLHealthHandler<any, K8sResourceCommon | K8sResourceCommon[]>>;
    /** Additional resource which will be fetched and passed to `healthHandler`. */
    additionalResource?: CodeRef<FirehoseResource>;
    /** Loader for popup content. If defined, a health item will be represented as a link which opens popup with given content. */
    popupComponent?: CodeRef<import("react").ComponentType<{
        healthResult?: any;
        healthResultError?: any;
        k8sResult?: FirehoseResult<K8sResourceCommon | K8sResourceCommon[]>;
    }>>;
    /** The title of the popover. */
    popupTitle?: string;
}>;
export declare const isDashboardsOverviewHealthResourceSubsystem: (e: Extension<any>) => e is ExtensionDeclaration<"console.dashboards/overview/health/resource", {
    /** The display name of the subsystem. */
    title: string;
    /** Kubernetes resources which will be fetched and passed to `healthHandler`. */
    resources: CodeRef<WatchK8sResources<ResourcesObject>>;
    /** Resolve the subsystem's health. */
    healthHandler: CodeRef<ResourceHealthHandler<ResourcesObject>>;
    /** Loader for popup content. If defined, a health item will be represented as a link which opens popup with given content. */
    popupComponent?: CodeRef<WatchK8sResults<ResourcesObject>>;
    /** The title of the popover. */
    popupTitle?: string;
}>;
export declare const isDashboardsOverviewHealthOperator: (e: Extension<any>) => e is ExtensionDeclaration<"console.dashboards/overview/health/operator", {
    /** Title of operators section in the popup. */
    title: string;
    /** Kubernetes resources which will be fetched and passed to `healthHandler`. */
    resources: CodeRef<FirehoseResource[]>;
    /** Resolves status for the operators. */
    getOperatorsWithStatuses?: CodeRef<GetOperatorsWithStatuses<K8sResourceCommon>>;
    /** Loader for popup row component. */
    operatorRowLoader?: CodeRef<import("react").ComponentType<OperatorRowProps<K8sResourceCommon>>>;
    /** Links to all resources page. If not provided then a list page of the first resource from resources prop is used. */
    viewAllLink?: string;
}>;
export declare const isDashboardsInventoryItemGroup: (e: Extension<any>) => e is ExtensionDeclaration<"console.dashboards/inventory/item/group", {
    /** The id of the status group. */
    id: string;
    /** React component representing the status group icon. */
    icon: CodeRef<import("react").ReactElement<any, string | ((props: any) => import("react").ReactElement<any, string | any | (new (props: any) => import("react").Component<any, any, any>)>) | (new (props: any) => import("react").Component<any, any, any>)>>;
}>;
export declare const isDashboardsOverviewInventoryItem: (e: Extension<any>) => e is ExtensionDeclaration<"console.dashboards/inventory/item", {
    /** The model for `resource` which will be fetched. Used to get the model's `label` or `abbr`. */
    model: CodeRef<K8sResourceCommon>;
    /** Function which maps various statuses to groups. */
    mapper?: CodeRef<StatusGroupMapper<K8sResourceCommon, {}>>;
    /** Additional resources which will be fetched and passed to the `mapper` function. */
    additionalResources?: CodeRef<WatchK8sResources<{}>>;
}>;
export declare const isDashboardsOverviewResourceActivity: (e: Extension<any>) => e is ExtensionDeclaration<"console.dashboards/overview/activity/resource", {
    /** The utilization item to be replaced. */
    k8sResource: CodeRef<FirehoseResource & {
        isList: true;
    }>;
    /** Function which determines if the given resource represents the action. If not defined, every resource represents activity. */
    isActivity?: CodeRef<(resource: K8sResourceCommon) => boolean>;
    /** Timestamp for the given action, which will be used for ordering. */
    getTimestamp?: CodeRef<(resource: K8sResourceCommon) => Date>;
    /** Loader for the corresponding action component. */
    loader: CodeRef<import("react").ComponentType<K8sActivityProps<K8sResourceCommon>>>;
}>;
export declare type DashboardCardSpan = 4 | 6 | 12;
export declare type GetOperatorsWithStatuses<R extends K8sResourceCommon = K8sResourceCommon> = (resources: FirehoseResourcesResult) => OperatorStatusWithResources<R>[];
export declare type K8sActivityProps<R extends K8sResourceCommon = K8sResourceCommon> = {
    resource: R;
};
export declare type OperatorRowProps<R extends K8sResourceCommon = K8sResourceCommon> = {
    operatorStatus: OperatorStatusWithResources<R>;
};
export declare type OperatorStatusWithResources<R extends K8sResourceCommon = K8sResourceCommon> = {
    operators: R[];
    status: OperatorStatusPriority;
};
export declare type OperatorStatusPriority = {
    title: string;
    priority: number;
    icon: React.ReactNode;
    health: keyof typeof HealthState;
};
export declare type PrometheusHealthHandler = (responses: {
    response: PrometheusResponse;
    error: any;
}[], t?: TFunction, additionalResource?: FirehoseResult<K8sResourceCommon | K8sResourceCommon[]>) => SubsystemHealth;
export declare type PrometheusHealthPopupProps = {
    responses: {
        response: PrometheusResponse;
        error: any;
    }[];
    k8sResult?: FirehoseResult<K8sResourceCommon | K8sResourceCommon[]>;
};
export declare type ResourceHealthHandler<R extends ResourcesObject> = (resourcesResult: WatchK8sResults<R>, t?: TFunction) => SubsystemHealth;
export declare type SubsystemHealth = {
    message?: string;
    state: HealthState;
};
export declare type URLHealthHandler<R, T extends K8sResourceCommon | K8sResourceCommon[] = K8sResourceCommon | K8sResourceCommon[]> = (response: R, error: any, additionalResource?: FirehoseResult<T>) => SubsystemHealth;

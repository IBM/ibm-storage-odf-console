export declare type OwnerReference = {
    name: string;
    kind: string;
    uid: string;
    apiVersion: string;
    controller?: boolean;
    blockOwnerDeletion?: boolean;
};
export declare type ObjectReference = {
    kind?: string;
    namespace?: string;
    name?: string;
    uid?: string;
    apiVersion?: string;
    resourceVersion?: string;
    fieldPath?: string;
};
export declare type ObjectMetadata = {
    annotations?: {
        [key: string]: string;
    };
    clusterName?: string;
    creationTimestamp?: string;
    deletionGracePeriodSeconds?: number;
    deletionTimestamp?: string;
    finalizers?: string[];
    generateName?: string;
    generation?: number;
    labels?: {
        [key: string]: string;
    };
    managedFields?: any[];
    name?: string;
    namespace?: string;
    ownerReferences?: OwnerReference[];
    resourceVersion?: string;
    uid?: string;
};
export declare type K8sResourceCommon = {
    apiVersion?: string;
    kind?: string;
    metadata?: ObjectMetadata;
};
export declare type K8sVerb = 'create' | 'get' | 'list' | 'update' | 'patch' | 'delete' | 'deletecollection' | 'watch';
export declare type AccessReviewResourceAttributes = {
    group?: string;
    resource?: string;
    subresource?: string;
    verb?: K8sVerb;
    name?: string;
    namespace?: string;
};
export declare type MatchExpression = {
    key: string;
    operator: 'Exists' | 'DoesNotExist' | 'In' | 'NotIn' | 'Equals' | 'NotEqual';
    values?: string[];
    value?: string;
};
export declare type MatchLabels = {
    [key: string]: string;
};
export declare type Selector = {
    matchLabels?: MatchLabels;
    matchExpressions?: MatchExpression[];
};
/**
 * GroupVersionKind unambiguously identifies a kind.
 * https://godoc.org/k8s.io/apimachinery/pkg/runtime/schema#GroupVersionKind
 * TODO: Change this to a regex-type if it ever becomes a thing (https://github.com/Microsoft/TypeScript/issues/6579)
 */
export declare type GroupVersionKind = string;
/**
 * The canonical, unique identifier for a Kubernetes resource type.
 * Maintains backwards-compatibility with references using the `kind` string field.
 */
export declare type K8sResourceKindReference = GroupVersionKind | string;
declare enum InventoryStatusGroup {
    WARN = "WARN",
    ERROR = "ERROR",
    PROGRESS = "PROGRESS",
    NOT_MAPPED = "NOT_MAPPED",
    UNKNOWN = "UNKNOWN"
}
declare type StatusGroup = {
    [key in InventoryStatusGroup | string]: {
        filterType?: string;
        statusIDs: string[];
        count: number;
    };
};
export declare type StatusGroupMapper<T extends K8sResourceCommon = K8sResourceCommon, R extends {
    [key: string]: K8sResourceCommon[];
} = {
    [key: string]: K8sResourceCommon[];
}> = (resources: T[], additionalResources?: R) => StatusGroup;
export declare enum HealthState {
    OK = "OK",
    ERROR = "ERROR",
    WARNING = "WARNING",
    LOADING = "LOADING",
    UNKNOWN = "UNKNOWN",
    UPDATING = "UPDATING",
    PROGRESS = "PROGRESS",
    NOT_AVAILABLE = "NOT_AVAILABLE"
}
export declare type PrometheusLabels = {
    [key: string]: string;
};
export declare type PrometheusValue = [number, string];
export declare type PrometheusResult = {
    metric: PrometheusLabels;
    values?: PrometheusValue[];
    value?: PrometheusValue;
};
export declare type PrometheusData = {
    resultType: 'matrix' | 'vector' | 'scalar' | 'string';
    result: PrometheusResult[];
};
export declare type PrometheusResponse = {
    status: string;
    data: PrometheusData;
    errorType?: string;
    error?: string;
    warnings?: string[];
};
export declare type WatchK8sResource = {
    kind: K8sResourceKindReference;
    name?: string;
    namespace?: string;
    isList?: boolean;
    selector?: Selector;
    namespaced?: boolean;
    limit?: number;
    fieldSelector?: string;
    optional?: boolean;
};
export declare type ResourcesObject = {
    [key: string]: K8sResourceCommon | K8sResourceCommon[];
};
export declare type WatchK8sResultsObject<R extends K8sResourceCommon | K8sResourceCommon[]> = {
    data: R;
    loaded: boolean;
    loadError: any;
};
export declare type WatchK8sResults<R extends ResourcesObject> = {
    [k in keyof R]: WatchK8sResultsObject<R[k]>;
};
export declare type WatchK8sResources<R extends ResourcesObject> = {
    [k in keyof R]: WatchK8sResource;
};
export declare type FirehoseResource = {
    kind: K8sResourceKindReference;
    name?: string;
    namespace?: string;
    isList?: boolean;
    selector?: Selector;
    prop: string;
    namespaced?: boolean;
    optional?: boolean;
    limit?: number;
    fieldSelector?: string;
};
export declare type FirehoseResult<R extends K8sResourceCommon | K8sResourceCommon[] = K8sResourceCommon[]> = {
    loaded: boolean;
    loadError: string;
    optional?: boolean;
    data: R;
    kind?: string;
};
export declare type FirehoseResourcesResult = {
    [key: string]: FirehoseResult<K8sResourceCommon | K8sResourceCommon[]>;
};
export {};

import { K8sResourceCommon, K8sResourceKindReference, Selector } from '../extensions/console-types';
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
export declare type WatchK8sResult<R extends K8sResourceCommon | K8sResourceCommon[]> = [R, boolean, any];
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
export declare type UseK8sWatchResource = <R extends K8sResourceCommon | K8sResourceCommon[]>(initResource: WatchK8sResource) => WatchK8sResult<R>;
export declare type UseK8sWatchResources = <R extends ResourcesObject>(initResources: WatchK8sResources<R>) => WatchK8sResults<R>;

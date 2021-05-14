import { ExtensionK8sModel } from '../api/common-types';
import { Extension, ExtensionDeclaration, CodeRef } from '../types';
/** Gives full control over Console feature flags. */
export declare type FeatureFlag = ExtensionDeclaration<'console.flag', {
    /** Used to set/unset arbitrary feature flags. */
    handler: CodeRef<(callback: SetFeatureFlag) => void>;
}>;
/** Adds new Console feature flag driven by the presence of a CRD on the cluster. */
export declare type ModelFeatureFlag = ExtensionDeclaration<'console.flag/model', {
    /** The name of the flag to set once the CRD is detected. */
    flag: string;
    /** The model which refers to a `CustomResourceDefinition`. */
    model: ExtensionK8sModel;
}>;
export declare const isFeatureFlag: (e: Extension<any>) => e is ExtensionDeclaration<"console.flag", {
    /** Used to set/unset arbitrary feature flags. */
    handler: CodeRef<(callback: SetFeatureFlag) => void>;
}>;
export declare const isModelFeatureFlag: (e: Extension<any>) => e is ExtensionDeclaration<"console.flag/model", {
    /** The name of the flag to set once the CRD is detected. */
    flag: string;
    /** The model which refers to a `CustomResourceDefinition`. */
    model: ExtensionK8sModel;
}>;
export declare type SetFeatureFlag = (flag: string, enabled: boolean) => void;
export declare type FooFeatureFlag = ExtensionDeclaration<'console.flag/foo', {
    /** Used to set/unset arbitrary feature flags. */
    handler: CodeRef<(SetFooFeatureFlag: SetFooFeatureFlag) => void>;
}>;
export declare const isFooFeatureFlag: (e: Extension<any>) => e is ExtensionDeclaration<"console.flag/foo", {
    /** Used to set/unset arbitrary feature flags. */
    handler: CodeRef<(SetFooFeatureFlag: SetFooFeatureFlag) => void>;
}>;
export declare type SetFooFeatureFlag = {
    label: string;
};

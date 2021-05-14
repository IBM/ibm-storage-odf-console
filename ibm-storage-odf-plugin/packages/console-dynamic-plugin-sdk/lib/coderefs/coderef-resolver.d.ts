import { Extension, RemoteEntryModule, EncodedCodeRef, CodeRef, ResolvedCodeRefProperties, ExtensionProperties } from '../types';
export declare const applyCodeRefSymbol: <T = any>(ref: CodeRef<T>) => CodeRef<T>;
export declare const isEncodedCodeRef: (obj: any) => obj is EncodedCodeRef;
export declare const isExecutableCodeRef: (obj: any) => obj is CodeRef<any>;
export declare const filterEncodedCodeRefProperties: (properties: any) => {
    [propName: string]: EncodedCodeRef;
};
export declare const filterExecutableCodeRefProperties: (properties: any) => {
    [propName: string]: CodeRef<any>;
};
/**
 * Parse the `EncodedCodeRef` value into `[moduleName, exportName]` tuple.
 *
 * Returns an empty array if the value doesn't match the expected format.
 */
export declare const parseEncodedCodeRefValue: (value: string) => [] | [string, string];
/**
 * Returns the object referenced by the `EncodedCodeRef`.
 *
 * If an error occurs, calls `errorCallback` and returns `null`.
 *
 * _Does not throw errors by design._
 */
export declare const loadReferencedObject: <TExport = any>(ref: EncodedCodeRef, entryModule: RemoteEntryModule, pluginID: string, errorCallback: VoidFunction) => Promise<TExport>;
/**
 * Returns new `extensions` array, resolving `EncodedCodeRef` values into `CodeRef` functions.
 *
 * _Does not execute `CodeRef` functions to load the referenced objects._
 */
export declare const resolveEncodedCodeRefs: (extensions: Extension<any>[], entryModule: RemoteEntryModule, pluginID: string, errorCallback: VoidFunction) => Extension<any>[];
/**
 * Returns the properties of extension `E` with `CodeRef` functions replaced with referenced objects.
 */
export declare const resolveCodeRefProperties: <E extends Extension<P>, P = ExtensionProperties<E>>(extension: E) => Promise<ResolvedCodeRefProperties<P>>;
/**
 * Returns an extension with its `CodeRef` properties replaced with referenced objects.
 */
export declare const resolveExtension: <E extends Extension<P>, P = ExtensionProperties<E>, R = { [K in keyof E]: K extends "properties" ? {
    properties: { [K_1 in keyof P]: K_1 extends keyof P ? ResolvedCodeRefProperties<P>[K_1] : P[K_1]; };
}[K] : E[K]; }>(extension: E) => Promise<R>;

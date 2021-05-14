/* eslint-disable no-console */
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import * as _ from 'lodash';
import { mergeExtensionProperties } from '../utils/store';
// TODO(vojtech): support code refs at any level within the properties object
const codeRefSymbol = Symbol('CodeRef');
export const applyCodeRefSymbol = (ref) => {
    ref[codeRefSymbol] = true;
    return ref;
};
export const isEncodedCodeRef = (obj) => _.isPlainObject(obj) &&
    _.isEqual(Object.getOwnPropertyNames(obj), ['$codeRef']) &&
    typeof obj.$codeRef === 'string';
export const isExecutableCodeRef = (obj) => _.isFunction(obj) &&
    _.isEqual(Object.getOwnPropertySymbols(obj), [codeRefSymbol]) &&
    obj[codeRefSymbol] === true;
export const filterEncodedCodeRefProperties = (properties) => _.pickBy(properties, isEncodedCodeRef);
export const filterExecutableCodeRefProperties = (properties) => _.pickBy(properties, isExecutableCodeRef);
/**
 * Parse the `EncodedCodeRef` value into `[moduleName, exportName]` tuple.
 *
 * Returns an empty array if the value doesn't match the expected format.
 */
export const parseEncodedCodeRefValue = (value) => {
    const match = value.match(/^([^.]+)(?:\.(.+)){0,1}$/);
    return match ? [match[1], match[2] || 'default'] : [];
};
/**
 * Returns the object referenced by the `EncodedCodeRef`.
 *
 * If an error occurs, calls `errorCallback` and returns `null`.
 *
 * _Does not throw errors by design._
 */
export const loadReferencedObject = (ref, entryModule, pluginID, errorCallback) => __awaiter(void 0, void 0, void 0, function* () {
    const [moduleName, exportName] = parseEncodedCodeRefValue(ref.$codeRef);
    let requestedModule;
    if (!moduleName) {
        console.error(`Malformed code reference '${ref.$codeRef}' of plugin ${pluginID}`);
        errorCallback();
        return null;
    }
    try {
        const moduleFactory = yield entryModule.get(moduleName);
        requestedModule = moduleFactory();
    }
    catch (error) {
        console.error(`Failed to load module '${moduleName}' of plugin ${pluginID}`, error);
        errorCallback();
        return null;
    }
    if (!requestedModule[exportName]) {
        console.error(`Missing module export '${moduleName}.${exportName}' of plugin ${pluginID}`);
        errorCallback();
        return null;
    }
    return requestedModule[exportName];
});
/**
 * Returns new `extensions` array, resolving `EncodedCodeRef` values into `CodeRef` functions.
 *
 * _Does not execute `CodeRef` functions to load the referenced objects._
 */
export const resolveEncodedCodeRefs = (extensions, entryModule, pluginID, errorCallback) => _.cloneDeep(extensions).map((e) => {
    const refs = filterEncodedCodeRefProperties(e.properties);
    Object.entries(refs).forEach(([propName, ref]) => {
        const executableCodeRef = () => __awaiter(void 0, void 0, void 0, function* () { return loadReferencedObject(ref, entryModule, pluginID, errorCallback); });
        e.properties[propName] = applyCodeRefSymbol(executableCodeRef);
    });
    return e;
});
/**
 * Returns the properties of extension `E` with `CodeRef` functions replaced with referenced objects.
 */
export const resolveCodeRefProperties = (extension) => __awaiter(void 0, void 0, void 0, function* () {
    const refs = filterExecutableCodeRefProperties(extension.properties);
    const resolvedValues = Object.assign({}, extension.properties);
    yield Promise.all(Object.entries(refs).map(([propName, ref]) => __awaiter(void 0, void 0, void 0, function* () {
        resolvedValues[propName] = yield ref();
    })));
    return resolvedValues;
});
/**
 * Returns an extension with its `CodeRef` properties replaced with referenced objects.
 */
export const resolveExtension = (extension) => __awaiter(void 0, void 0, void 0, function* () {
    const resolvedProperties = yield resolveCodeRefProperties(extension);
    return mergeExtensionProperties(extension, resolvedProperties);
});
//# sourceMappingURL=coderef-resolver.js.map
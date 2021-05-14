import { Provider } from 'react';
import { Extension, ExtensionDeclaration, CodeRef } from '../types';
/** Adds new React context provider to Console application root. */
export declare type ContextProvider<T = any> = ExtensionDeclaration<'console.context-provider', {
    /** Context Provider component. */
    provider: CodeRef<Provider<T>>;
    /** Hook for the Context value. */
    useValueHook: CodeRef<() => T>;
}>;
export declare const isContextProvider: (e: Extension<any>) => e is ExtensionDeclaration<"console.context-provider", {
    /** Context Provider component. */
    provider: CodeRef<Provider<any>>;
    /** Hook for the Context value. */
    useValueHook: CodeRef<() => any>;
}>;

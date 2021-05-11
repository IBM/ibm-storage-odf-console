/// <reference types="react" />
import { RouteComponentProps } from 'react-router';
import { Extension } from '@console/plugin-sdk/src/typings/base';
import { ExtensionDeclaration, CodeRef } from '../types';
export declare type StorageProvider = ExtensionDeclaration<'console.storage-provider', {
    name: string;
    Component: CodeRef<React.ComponentType<Partial<RouteComponentProps>>>;
}>;
export declare const isStorageProvider: (e: Extension<any>) => e is ExtensionDeclaration<"console.storage-provider", {
    name: string;
    Component: CodeRef<import("react").ComponentType<Partial<RouteComponentProps<{}, import("react-router").StaticContext, any>>>>;
}>;

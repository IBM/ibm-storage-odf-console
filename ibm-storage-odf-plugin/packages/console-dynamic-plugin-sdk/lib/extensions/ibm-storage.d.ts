import * as React from 'react';
import { Extension, ExtensionDeclaration, CodeRef } from '../types';
export declare type CreateIBMStorage = ExtensionDeclaration<'console.odf/createIBMStorage', {
    /** Used to set/unset arbitrary feature flags. */
    handler: CodeRef<(SetFooFeatureFlag: CreateIBMStorageProgs) => React.ReactNode>;
}>;
export declare const isCreateIBMStorage: (e: Extension<any>) => e is ExtensionDeclaration<"console.odf/createIBMStorage", {
    /** Used to set/unset arbitrary feature flags. */
    handler: CodeRef<(SetFooFeatureFlag: CreateIBMStorageProgs) => React.ReactNode>;
}>;
export declare type CreateIBMStorageProgs = {
    ns?: string;
    plural?: string;
    name?: string;
};

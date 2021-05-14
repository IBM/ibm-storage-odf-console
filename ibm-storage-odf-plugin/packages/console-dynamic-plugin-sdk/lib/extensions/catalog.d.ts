import * as React from 'react';
import { ExtensionHook } from '../api/common-types';
import { Extension, ExtensionDeclaration, CodeRef } from '../types';
export declare type CatalogItemType = ExtensionDeclaration<'console.catalog/item-type', {
    /** Type for the catalog item. */
    type: string;
    /** Title for the catalog item. */
    title: string;
    /** Description for the type specific catalog. */
    catalogDescription?: string;
    /** Description for the catalog item type. */
    typeDescription?: string;
    /** Custom filters specific to the catalog item.  */
    filters?: CatalogItemAttribute[];
    /** Custom groupings specific to the catalog item. */
    groupings?: CatalogItemAttribute[];
}>;
export declare type CatalogItemProvider = ExtensionDeclaration<'console.catalog/item-provider', {
    /** The unique identifier for the catalog this provider contributes to. */
    catalogId: string | string[];
    /** Type ID for the catalog item type. */
    type: string;
    /** Fetch items and normalize it for the catalog. Value is a react effect hook. */
    provider: CodeRef<ExtensionHook<CatalogItem[], CatalogExtensionHookOptions>>;
    /** Priority for this provider. Defaults to 0. Higher priority providers may override catalog
        items provided by other providers. */
    priority?: number;
}>;
export declare type CatalogItemFilter = ExtensionDeclaration<'console.catalog/item-filter', {
    /** The unique identifier for the catalog this provider contributes to. */
    catalogId: string | string[];
    /** Type ID for the catalog item type. */
    type: string;
    /** Filters items of a specific type. Value is a function that takes CatalogItem[] and returns a subset based on the filter criteria. */
    filter: CodeRef<(item: CatalogItem) => boolean>;
}>;
export declare type SupportedCatalogExtensions = CatalogItemType | CatalogItemProvider | CatalogItemFilter;
export declare const isCatalogItemType: (e: Extension<any>) => e is ExtensionDeclaration<"console.catalog/item-type", {
    /** Type for the catalog item. */
    type: string;
    /** Title for the catalog item. */
    title: string;
    /** Description for the type specific catalog. */
    catalogDescription?: string;
    /** Description for the catalog item type. */
    typeDescription?: string;
    /** Custom filters specific to the catalog item.  */
    filters?: CatalogItemAttribute[];
    /** Custom groupings specific to the catalog item. */
    groupings?: CatalogItemAttribute[];
}>;
export declare const isCatalogItemProvider: (e: Extension<any>) => e is ExtensionDeclaration<"console.catalog/item-provider", {
    /** The unique identifier for the catalog this provider contributes to. */
    catalogId: string | string[];
    /** Type ID for the catalog item type. */
    type: string;
    /** Fetch items and normalize it for the catalog. Value is a react effect hook. */
    provider: CodeRef<ExtensionHook<CatalogItem<any>[], CatalogExtensionHookOptions>>;
    /** Priority for this provider. Defaults to 0. Higher priority providers may override catalog
        items provided by other providers. */
    priority?: number;
}>;
export declare const isCatalogItemFilter: (e: Extension<any>) => e is ExtensionDeclaration<"console.catalog/item-filter", {
    /** The unique identifier for the catalog this provider contributes to. */
    catalogId: string | string[];
    /** Type ID for the catalog item type. */
    type: string;
    /** Filters items of a specific type. Value is a function that takes CatalogItem[] and returns a subset based on the filter criteria. */
    filter: CodeRef<(item: CatalogItem<any>) => boolean>;
}>;
export declare type CatalogExtensionHookOptions = {
    namespace: string;
};
export declare type CatalogItem<T extends any = any> = {
    uid: string;
    type: string;
    name: string;
    /** Optional title to render a custom title using ReactNode.
     * Rendered in catalog tile and side panel
     *  */
    title?: React.ReactNode;
    provider?: string;
    description?: string | React.ReactNode;
    tags?: string[];
    creationTimestamp?: string;
    supportUrl?: string;
    documentationUrl?: string;
    attributes?: {
        [key: string]: string;
    };
    cta?: {
        label: string;
        href?: string;
        callback?: () => void;
    };
    icon?: {
        url?: string;
        class?: string;
    };
    details?: {
        properties?: CatalogItemDetailsProperty[];
        descriptions?: CatalogItemDetailsDescription[];
    };
    badges?: CatalogItemBadge[];
    data?: T;
};
export declare type CatalogItemDetailsProperty = {
    label: string;
    value: string | React.ReactNode;
};
export declare type CatalogItemDetailsDescription = {
    label?: string;
    value: string | React.ReactNode;
};
export declare type CatalogItemAttribute = {
    label: string;
    attribute: string;
};
export declare type CatalogItemBadge = {
    text: string;
    color?: 'blue' | 'cyan' | 'green' | 'orange' | 'purple' | 'red' | 'grey';
    icon?: React.ReactNode;
    variant?: 'outline' | 'filled';
};

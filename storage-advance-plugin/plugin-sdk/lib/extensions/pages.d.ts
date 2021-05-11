/// <reference types="react" />
import { RouteComponentProps } from 'react-router';
import { ExtensionK8sModel } from '../api/common-types';
import { Extension, ExtensionDeclaration, CodeRef } from '../types';
declare type ResourcePageProperties = {
    /** The model for which this resource page links to. */
    model: ExtensionK8sModel;
    component: CodeRef<React.ComponentType<{
        match: RouteComponentProps['match'];
        /** The namespace for which this resource page links to. */
        namespace: string;
        /** The model for which this resource page links to. */
        model: ExtensionK8sModel;
    }>>;
};
declare type RoutePageProperties = {
    /** The perspective to which this page belongs to. If not specified, contributes to all perspectives. */
    perspective?: string;
    /** The component to be rendered when the route matches. */
    component: CodeRef<React.ComponentType<RouteComponentProps>>;
    /** Valid URL path or array of paths that `path-to-regexp@^1.7.0` understands. */
    path: string | string[];
    /** When true, will only match if the path matches the `location.pathname` exactly. */
    exact?: boolean;
};
/** Adds new page to Console router. */
export declare type RoutePage = ExtensionDeclaration<'console.page/route', RoutePageProperties>;
/** Adds new resource list page to Console router. */
export declare type ResourceListPage = ExtensionDeclaration<'console.page/resource/list', ResourcePageProperties & {}>;
/** Adds new resource details page to Console router. */
export declare type ResourceDetailsPage = ExtensionDeclaration<'console.page/resource/details', ResourcePageProperties & {}>;
/** Adds new resource tab page to Console router. */
export declare type ResourceTabPage = ExtensionDeclaration<'console.page/resource/tab', Omit<ResourcePageProperties, 'component'> & {
    /** The component to be rendered when the route matches. */
    component: CodeRef<React.ComponentType<RouteComponentProps>>;
    /** The name of the tab. */
    name: string;
    /** The optional href for the tab link. If not provided, the first `path` is used. */
    href?: string;
    /** When true, will only match if the path matches the `location.pathname` exactly. */
    exact?: boolean;
}>;
/** Adds new standalone page (rendered outside the common page layout) to Console router. */
export declare type StandaloneRoutePage = ExtensionDeclaration<'console.page/route/standalone', Omit<RoutePageProperties, 'perspective'>>;
export declare const isRoutePage: (e: Extension<any>) => e is ExtensionDeclaration<"console.page/route", RoutePageProperties>;
export declare const isStandaloneRoutePage: (e: Extension<any>) => e is ExtensionDeclaration<"console.page/route/standalone", Pick<RoutePageProperties, "component" | "path" | "exact">>;
export declare const isResourceListPage: (e: Extension<any>) => e is ExtensionDeclaration<"console.page/resource/list", ResourcePageProperties>;
export declare const isResourceDetailsPage: (e: Extension<any>) => e is ExtensionDeclaration<"console.page/resource/details", ResourcePageProperties>;
export declare const isResourceTabPage: (e: Extension<any>) => e is ExtensionDeclaration<"console.page/resource/tab", Pick<ResourcePageProperties, "model"> & {
    /** The component to be rendered when the route matches. */
    component: CodeRef<import("react").ComponentType<RouteComponentProps<{}, import("react-router").StaticContext, any>>>;
    /** The name of the tab. */
    name: string;
    /** The optional href for the tab link. If not provided, the first `path` is used. */
    href?: string;
    /** When true, will only match if the path matches the `location.pathname` exactly. */
    exact?: boolean;
}>;
export {};

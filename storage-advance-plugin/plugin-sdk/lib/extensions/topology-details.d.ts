import * as React from 'react';
import { Extension } from '@console/plugin-sdk/src/typings/base';
import { GraphElement } from '@patternfly/react-topology';
import { CodeRef, ExtensionDeclaration } from '../types';
/** DetailsTab contributes a tab for the topology details panel. */
export declare type DetailsTab = ExtensionDeclaration<'topology.details/tab', {
    /** A unique identifier for this details tab. */
    id: string;
    /** The tab label to display in the UI. */
    label: string;
    /** Insert this item before the item referenced here.
     * For arrays, the first one found in order is used.
     * */
    insertBefore?: string | string[];
    /** Insert this item after the item referenced here.
     * For arrays, the first one found in order is used.
     * insertBefore takes precedence.
     * */
    insertAfter?: string | string[];
}>;
/** DetailsTabSection contributes a section for a specific tab in topology details panel. */
export declare type DetailsTabSection = ExtensionDeclaration<'topology.details/tab-section', {
    /** A unique identifier for this details tab section. */
    id: string;
    /** The parent tab ID that this section should contribute to. */
    tab: string;
    /** Returns a section for the graph element or undefined if not provided.
     * SDK component: <Section title={<optional>}>... padded area </Section>
     * */
    section: CodeRef<(element: GraphElement) => React.Component | undefined>;
    /** Insert this item before the item referenced here.
     * For arrays, the first one found in order is used.
     * */
    insertBefore?: string | string[];
    /** Insert this item after the item referenced here.
     * For arrays, the first one found in order is used.
     * insertBefore takes precedence.
     * */
    insertAfter?: string | string[];
}>;
/** DetailsResourceLink contributes a link for specific topology context or graph element. */
export declare type DetailsResourceLink = ExtensionDeclaration<'topology.details/resource-link', {
    /** A higher priority factory will get the first chance to create the link. */
    priority?: number;
    /** Return the resource link if provided, otherwise undefined.
     * Use ResourceIcon and ResourceLink for styles.
     * */
    link: CodeRef<(element: GraphElement) => React.Component | undefined>;
}>;
/** DetailsResourceAlert contributes an alert for specific topology context or graph element. */
export declare type DetailsResourceAlert = ExtensionDeclaration<'topology.details/resource-alert', {
    /** The ID of this alert. Used to save state if the alert should be shown after dismissed. */
    id: string;
    /** The title of the alert */
    title: string;
    /** Hook to return the contents of the Alert. */
    contentProvider: CodeRef<(element: GraphElement) => DetailsResourceAlertContent>;
    /** Whether to show a dismiss button. false by default */
    dismissible?: boolean;
}>;
export declare type SupportedTopologyDetailsExtensions = DetailsTab | DetailsTabSection | DetailsResourceLink | DetailsResourceAlert;
export declare const isDetailsTab: (e: Extension<any>) => e is ExtensionDeclaration<"topology.details/tab", {
    /** A unique identifier for this details tab. */
    id: string;
    /** The tab label to display in the UI. */
    label: string;
    /** Insert this item before the item referenced here.
     * For arrays, the first one found in order is used.
     * */
    insertBefore?: string | string[];
    /** Insert this item after the item referenced here.
     * For arrays, the first one found in order is used.
     * insertBefore takes precedence.
     * */
    insertAfter?: string | string[];
}>;
export declare const isDetailsTabSection: (e: Extension<any>) => e is ExtensionDeclaration<"topology.details/tab-section", {
    /** A unique identifier for this details tab section. */
    id: string;
    /** The parent tab ID that this section should contribute to. */
    tab: string;
    /** Returns a section for the graph element or undefined if not provided.
     * SDK component: <Section title={<optional>}>... padded area </Section>
     * */
    section: CodeRef<(element: GraphElement<import("@patternfly/react-topology").ElementModel, any>) => React.Component<{}, {}, any>>;
    /** Insert this item before the item referenced here.
     * For arrays, the first one found in order is used.
     * */
    insertBefore?: string | string[];
    /** Insert this item after the item referenced here.
     * For arrays, the first one found in order is used.
     * insertBefore takes precedence.
     * */
    insertAfter?: string | string[];
}>;
export declare const isDetailsResourceLink: (e: Extension<any>) => e is ExtensionDeclaration<"topology.details/resource-link", {
    /** A higher priority factory will get the first chance to create the link. */
    priority?: number;
    /** Return the resource link if provided, otherwise undefined.
     * Use ResourceIcon and ResourceLink for styles.
     * */
    link: CodeRef<(element: GraphElement<import("@patternfly/react-topology").ElementModel, any>) => React.Component<{}, {}, any>>;
}>;
export declare const isDetailsResourceAlert: (e: Extension<any>) => e is ExtensionDeclaration<"topology.details/resource-alert", {
    /** The ID of this alert. Used to save state if the alert should be shown after dismissed. */
    id: string;
    /** The title of the alert */
    title: string;
    /** Hook to return the contents of the Alert. */
    contentProvider: CodeRef<(element: GraphElement<import("@patternfly/react-topology").ElementModel, any>) => DetailsResourceAlertContent>;
    /** Whether to show a dismiss button. false by default */
    dismissible?: boolean;
}>;
export declare type DetailsResourceAlertContent = {
    content: React.Component | undefined;
    variant?: 'success' | 'danger' | 'warning' | 'info' | 'default';
    actionLinks?: React.ReactNode;
};

/// <reference types="react" />
import { Extension, ExtensionDeclaration, CodeRef } from '../types';
import { K8sResourceCommon } from './console-types';
export declare type PVCCreateProp = ExtensionDeclaration<'console.pvc/create-prop', {
    /** Label for the create prop action. */
    label: string;
    /** Path for the create prop action. */
    path: string;
}>;
export declare type PVCAlert = ExtensionDeclaration<'console.pvc/alert', {
    /** The alert component. */
    alert: CodeRef<React.ComponentType<{
        pvc: K8sResourceCommon;
    }>>;
}>;
export declare type PVCStatus = ExtensionDeclaration<'console.pvc/status', {
    /** Priority for the status component. Bigger value means higher priority. */
    priority: number;
    /** The status component. */
    status: CodeRef<React.ComponentType<{
        pvc: K8sResourceCommon;
    }>>;
    /** Predicate that tells whether to render the status component or not. */
    predicate: CodeRef<(pvc: K8sResourceCommon) => boolean>;
}>;
export declare type PVCDelete = ExtensionDeclaration<'console.pvc/delete', {
    /** Predicate that tells whether to use the extension or not. */
    predicate: CodeRef<(pvc: K8sResourceCommon) => boolean>;
    /** Method for the PVC delete operation. */
    onPVCKill: CodeRef<(pvc: K8sResourceCommon) => Promise<void>>;
    /** Alert component to show additional information. */
    alert: CodeRef<React.ComponentType<{
        pvc: K8sResourceCommon;
    }>>;
}>;
export declare const isPVCCreateProp: (e: Extension<any>) => e is ExtensionDeclaration<"console.pvc/create-prop", {
    /** Label for the create prop action. */
    label: string;
    /** Path for the create prop action. */
    path: string;
}>;
export declare const isPVCAlert: (e: Extension<any>) => e is ExtensionDeclaration<"console.pvc/alert", {
    /** The alert component. */
    alert: CodeRef<import("react").ComponentType<{
        pvc: K8sResourceCommon;
    }>>;
}>;
export declare const isPVCStatus: (e: Extension<any>) => e is ExtensionDeclaration<"console.pvc/status", {
    /** Priority for the status component. Bigger value means higher priority. */
    priority: number;
    /** The status component. */
    status: CodeRef<import("react").ComponentType<{
        pvc: K8sResourceCommon;
    }>>;
    /** Predicate that tells whether to render the status component or not. */
    predicate: CodeRef<(pvc: K8sResourceCommon) => boolean>;
}>;
export declare const isPVCDelete: (e: Extension<any>) => e is ExtensionDeclaration<"console.pvc/delete", {
    /** Predicate that tells whether to use the extension or not. */
    predicate: CodeRef<(pvc: K8sResourceCommon) => boolean>;
    /** Method for the PVC delete operation. */
    onPVCKill: CodeRef<(pvc: K8sResourceCommon) => Promise<void>>;
    /** Alert component to show additional information. */
    alert: CodeRef<import("react").ComponentType<{
        pvc: K8sResourceCommon;
    }>>;
}>;

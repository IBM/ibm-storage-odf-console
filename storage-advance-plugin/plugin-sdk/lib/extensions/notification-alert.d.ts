import { Extension } from '@console/plugin-sdk/src/typings/base';
import { ExtensionDeclaration, CodeRef } from '../types';
export declare type AlertAction = ExtensionDeclaration<'console.alert-action', {
    alert: string;
    text: string;
    action: CodeRef<(alert: any) => void>;
}>;
export declare const isAlertAction: (e: Extension<any>) => e is ExtensionDeclaration<"console.alert-action", {
    alert: string;
    text: string;
    action: CodeRef<(alert: any) => void>;
}>;

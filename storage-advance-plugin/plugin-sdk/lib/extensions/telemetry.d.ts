import { Extension, ExtensionDeclaration, CodeRef } from '../types';
export declare type TelemetryListener = ExtensionDeclaration<'console.telemetry/listener', {
    /** Listen for telemetry events */
    listener: CodeRef<TelemetryEventListener>;
}>;
export declare type TelemetryEventListener = <P = any>(eventType: string, properties?: P) => void;
export declare const isTelemetryListener: (e: Extension<any>) => e is ExtensionDeclaration<"console.telemetry/listener", {
    /** Listen for telemetry events */
    listener: CodeRef<TelemetryEventListener>;
}>;

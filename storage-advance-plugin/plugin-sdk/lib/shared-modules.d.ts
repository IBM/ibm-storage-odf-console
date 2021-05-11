import { RemoteEntryModule } from './types';
/**
 * Vendor modules shared between Console application and its dynamic plugins.
 */
export declare const sharedVendorModules: string[];
/**
 * At runtime, Console will override (i.e. enforce Console-bundled implementation of) shared
 * modules for each dynamic plugin, before loading any of the modules exposed by that plugin.
 *
 * This way, a single version of React etc. is used by the Console application.
 */
export declare const overrideSharedModules: (entryModule: RemoteEntryModule) => void;

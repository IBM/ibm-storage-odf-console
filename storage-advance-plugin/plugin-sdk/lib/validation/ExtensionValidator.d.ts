import * as webpack from 'webpack';
import { ValidationResult } from './ValidationResult';
import { ConsolePluginMetadata } from '../schema/plugin-package';
import { SupportedExtension } from '../schema/console-extensions';
declare type ExtensionCodeRefData = {
    index: number;
    propToCodeRefValue: {
        [propName: string]: string;
    };
};
declare type ExposedPluginModules = ConsolePluginMetadata['exposedModules'];
export declare const collectCodeRefData: (extensions: SupportedExtension[]) => ExtensionCodeRefData[];
export declare const findWebpackModules: (compilation: webpack.Compilation, exposedModules: {
    [moduleName: string]: string;
}) => {
    [moduleName: string]: webpack.Module;
};
export declare class ExtensionValidator {
    readonly result: ValidationResult;
    constructor(description: string);
    validate(compilation: webpack.Compilation, extensions: SupportedExtension[], exposedModules: ExposedPluginModules, dataVar?: string): ValidationResult;
}
export {};

import * as webpack from 'webpack';
import { ConsolePackageJSON } from '../schema/plugin-package';
import { ConsoleExtensionsJSON } from '../schema/console-extensions';
export declare const validateExtensionsFileSchema: (ext: ConsoleExtensionsJSON, description?: string) => import("../validation/ValidationResult").ValidationResult;
export declare class ConsoleAssetPlugin {
    private readonly pkg;
    private readonly manifest;
    constructor(pkg: ConsolePackageJSON);
    apply(compiler: webpack.Compiler): void;
}

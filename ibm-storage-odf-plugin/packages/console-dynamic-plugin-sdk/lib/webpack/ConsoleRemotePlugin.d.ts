import * as webpack from 'webpack';
import { ConsolePackageJSON } from '../schema/plugin-package';
export declare const validatePackageFileSchema: (pkg: ConsolePackageJSON, description?: string) => import("../validation/ValidationResult").ValidationResult;
export declare class ConsoleRemotePlugin {
    private readonly pkg;
    constructor();
    apply(compiler: webpack.Compiler): void;
}

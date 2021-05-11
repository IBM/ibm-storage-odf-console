import * as _ from 'lodash';
import { ValidationResult } from './ValidationResult';
import { filterEncodedCodeRefProperties, parseEncodedCodeRefValue, } from '../coderefs/coderef-resolver';
export const collectCodeRefData = (extensions) => extensions.reduce((acc, e, index) => {
    const refs = filterEncodedCodeRefProperties(e.properties);
    if (!_.isEmpty(refs)) {
        acc.push({ index, propToCodeRefValue: _.mapValues(refs, (obj) => obj.$codeRef) });
    }
    return acc;
}, []);
export const findWebpackModules = (compilation, exposedModules) => {
    const webpackModules = Array.from(compilation.modules);
    return Object.keys(exposedModules).reduce((acc, moduleName) => {
        acc[moduleName] = webpackModules.find((m) => {
            const rawRequest = _.get(m, 'rawRequest') || _.get(m, 'rootModule.rawRequest');
            return exposedModules[moduleName] === rawRequest;
        });
        return acc;
    }, {});
};
export class ExtensionValidator {
    constructor(description) {
        this.result = new ValidationResult(description);
    }
    validate(compilation, extensions, exposedModules, dataVar = 'extensions') {
        const codeRefs = collectCodeRefData(extensions);
        const webpackModules = findWebpackModules(compilation, exposedModules);
        // Each exposed module must have at least one code reference
        Object.keys(exposedModules).forEach((moduleName) => {
            const moduleReferenced = codeRefs.some((data) => Object.values(data.propToCodeRefValue).some((value) => {
                const [parsedModuleName] = parseEncodedCodeRefValue(value);
                return parsedModuleName && moduleName === parsedModuleName;
            }));
            if (!moduleReferenced) {
                this.result.addError(`Exposed module '${moduleName}' is not referenced by any extension`);
            }
        });
        // Each code reference must point to a valid webpack module export
        codeRefs.forEach((data) => {
            Object.entries(data.propToCodeRefValue).forEach(([propName, codeRefValue]) => {
                const [moduleName, exportName] = parseEncodedCodeRefValue(codeRefValue);
                const errorTrace = `in ${dataVar}[${data.index}] property '${propName}'`;
                if (!moduleName || !exportName) {
                    this.result.addError(`Invalid code reference '${codeRefValue}' ${errorTrace}`);
                    return;
                }
                const foundModule = webpackModules[moduleName];
                if (!foundModule) {
                    this.result.addError(`Invalid module '${moduleName}' ${errorTrace}`);
                    return;
                }
                const moduleExports = compilation.moduleGraph.getProvidedExports(foundModule);
                const exportValid = Array.isArray(moduleExports) && moduleExports.includes(exportName);
                if (!exportValid) {
                    this.result.addError(`Invalid module export '${exportName}' ${errorTrace}`);
                }
            });
        });
        return this.result;
    }
}
//# sourceMappingURL=ExtensionValidator.js.map
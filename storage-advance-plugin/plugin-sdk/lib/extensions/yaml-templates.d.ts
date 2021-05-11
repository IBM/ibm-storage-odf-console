import { ExtensionK8sModel } from '../api/common-types';
import { Extension, ExtensionDeclaration } from '../types';
export declare type YAMLTemplate = ExtensionDeclaration<'console.yaml-template', {
    /** Model associated with the template. */
    model: ExtensionK8sModel;
    /** The YAML template. */
    template: string;
    /** The name of the template. Use the name `default` to mark this as the default template. */
    name: string | 'default';
}>;
export declare const isYAMLTemplate: (e: Extension<any>) => e is ExtensionDeclaration<"console.yaml-template", {
    /** Model associated with the template. */
    model: ExtensionK8sModel;
    /** The YAML template. */
    template: string;
    /** The name of the template. Use the name `default` to mark this as the default template. */
    name: string;
}>;

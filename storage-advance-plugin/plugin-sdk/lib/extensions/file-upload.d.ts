import { Extension, ExtensionDeclaration, CodeRef } from '../types';
export declare type FileUpload = ExtensionDeclaration<'console.file-upload', {
    /** Supported file extensions. */
    fileExtensions: string[];
    /** Function which handles the file drop action. */
    handler: CodeRef<FileUploadHandler>;
}>;
export declare const isFileUpload: (e: Extension<any>) => e is ExtensionDeclaration<"console.file-upload", {
    /** Supported file extensions. */
    fileExtensions: string[];
    /** Function which handles the file drop action. */
    handler: CodeRef<FileUploadHandler>;
}>;
export declare type FileUploadHandler = (file: File, namespace: string) => void;

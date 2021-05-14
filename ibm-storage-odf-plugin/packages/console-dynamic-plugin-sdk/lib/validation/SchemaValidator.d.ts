import * as Ajv from 'ajv';
import { ValidationResult } from './ValidationResult';
import { ValidationAssertions } from './ValidationAssertions';
export declare class SchemaValidator {
    private readonly ajv;
    readonly result: ValidationResult;
    readonly assert: ValidationAssertions;
    constructor(description: string, ajv?: Ajv.Ajv);
    validate(schema: object, data: any, dataVar?: string): ValidationResult;
}

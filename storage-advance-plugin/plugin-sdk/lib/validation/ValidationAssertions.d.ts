import { ValidationResult } from './ValidationResult';
export declare class ValidationAssertions {
    private readonly result;
    constructor(result: ValidationResult);
    validDNSSubdomainName(obj: any, objPath: string): void;
    validSemverString(obj: any, objPath: string): void;
    validSemverRangeString(obj: any, objPath: string): void;
}

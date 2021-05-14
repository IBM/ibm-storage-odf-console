export declare class ValidationResult {
    private readonly description;
    private readonly errors;
    constructor(description: string);
    assertThat(condition: boolean, message: string): void;
    addError(message: string): void;
    hasErrors(): boolean;
    getErrors(): string[];
    formatErrors(): string;
    report(throwOnErrors?: boolean): void;
}

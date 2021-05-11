import chalk from 'chalk';
export class ValidationResult {
    constructor(description) {
        this.description = description;
        this.errors = [];
    }
    assertThat(condition, message) {
        if (!condition) {
            this.addError(message);
        }
    }
    addError(message) {
        this.errors.push(message);
    }
    hasErrors() {
        return this.errors.length > 0;
    }
    getErrors() {
        return [...this.errors];
    }
    formatErrors() {
        const prefix = `${chalk.bold(this.description)} (${this.errors.length} errors)\n`;
        const errorLines = this.errors.map((e) => `    ${chalk.red(e)}`);
        return prefix + errorLines.join('\n');
    }
    report(throwOnErrors = true) {
        if (this.hasErrors()) {
            // eslint-disable-next-line no-console
            console.error(this.formatErrors());
            if (throwOnErrors) {
                throw new Error('Validation failed');
            }
        }
    }
}
//# sourceMappingURL=ValidationResult.js.map
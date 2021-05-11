import * as Ajv from 'ajv';
import { ValidationResult } from './ValidationResult';
import { ValidationAssertions } from './ValidationAssertions';
export class SchemaValidator {
    constructor(description, ajv = new Ajv({ allErrors: true })) {
        this.ajv = ajv;
        this.result = new ValidationResult(description);
        this.assert = new ValidationAssertions(this.result);
    }
    validate(schema, data, dataVar = 'obj') {
        if (!this.ajv.validate(schema, data)) {
            this.ajv.errors.forEach((error) => {
                // This format is consistent with ajv.errorsText() implementation
                this.result.addError(`${dataVar}${error.dataPath} ${error.message}`);
            });
        }
        return this.result;
    }
}
//# sourceMappingURL=SchemaValidator.js.map
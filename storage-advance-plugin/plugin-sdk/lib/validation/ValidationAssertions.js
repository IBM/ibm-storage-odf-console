import * as semver from 'semver';
export class ValidationAssertions {
    constructor(result) {
        this.result = result;
    }
    // https://kubernetes.io/docs/concepts/overview/working-with-objects/names/#dns-subdomain-names
    validDNSSubdomainName(obj, objPath) {
        if (typeof obj === 'string') {
            this.result.assertThat(obj.length <= 253, `${objPath} must contain no more than 253 characters`);
            this.result.assertThat(/^[a-z0-9-.]*$/.test(obj), `${objPath} must contain only lowercase alphanumeric characters, '-' or '.'`);
            this.result.assertThat(/^[a-z0-9]+/.test(obj) && /[a-z0-9]+$/.test(obj), `${objPath} must start and end with an alphanumeric character`);
        }
    }
    validSemverString(obj, objPath) {
        if (typeof obj === 'string') {
            this.result.assertThat(!!semver.valid(obj), `${objPath} must be semver compliant`);
        }
    }
    validSemverRangeString(obj, objPath) {
        if (typeof obj === 'string') {
            this.result.assertThat(!!semver.validRange(obj), `${objPath} semver range is not valid`);
        }
    }
}
//# sourceMappingURL=ValidationAssertions.js.map
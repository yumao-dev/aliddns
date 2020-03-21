import AJV from "ajv";
import { readFileSync } from "fs";
import { join } from "path";

const schemaData = readFileSync(join(__dirname, 'settings.schema.json'), 'utf-8');
const schema = JSON.parse(schemaData);

const ajv = new AJV({ useDefaults: true }).compile(schema);

export class Validate {
    public async validate(param: object) {
        let result = ajv(param);
        if (ajv.errors && ajv.errors.length > 0) {
            throw new Error(ajv.errors[0].message);
        }
        return result;
    }

    public async formatDomain(domain: string) {
        let i = domain.indexOf('.');
        return {
            domain: domain.substring(i + 1),
            RR: domain.substr(0, i)
        }
    }
}


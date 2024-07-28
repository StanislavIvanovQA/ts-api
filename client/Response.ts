import {StatusCode} from './StatusCode';
import {expect, test} from '@playwright/test';
import Ajv, {JSONSchemaType} from 'ajv';

type ResponseProps<T> = {
    statusCode: number,
    body: T,
    headers: Record<string, string>
}

export class Response<T extends object | string> {
    statusCode: StatusCode;
    body: T;
    headers: Record<string, string>;
    private schema: JSONSchemaType<T> | undefined;
    private ajv = new Ajv();

    constructor({statusCode, body, headers}: ResponseProps<T>) {
        this.statusCode = new StatusCode(statusCode);
        this.body = body;
        this.headers = headers;
    }

    async shouldHave<K extends keyof T>({property, value}: { property: K, value: any }) {
        if (typeof this.body === 'string') {
            throw new Error('This Response body is string, not a json object');
        }

        const stringifiedProperty = String(property);
        return test.step(`Property '${stringifiedProperty}' value to be: ${
            typeof value === 'object'
                ? `
                   ${JSON.stringify(value, null, 2)}`
                : value
        }`, async () => {
            expect((this.body as Record<string, unknown>)[stringifiedProperty]).toEqual(value);
        });
    }

    async shouldBe(expectedObjectShape: T) {
        await test.step(`Checking that body equals: 
        ${JSON.stringify(expectedObjectShape, null, 2)}`, async () => {
            expect(this.body).toEqual(expect.objectContaining(expectedObjectShape as Record<string, any>));
        });
    }

    async shouldContain(expectedSubString: string) {
        await test.step(`Checking that response body contains substring: ${expectedSubString}`, async () => {
            expect(this.body).toContain(expectedSubString);
        });
    }

    async shouldHaveValidSchema() {
        await test.step('Checking response body for valid schema', async () => {
            if (!this.schema) {
                throw new Error('Schema is not defined for this Response instance');
            }
            const validate = this.ajv.compile(this.schema);
            validate(this.body);
            if (validate.errors) {
                await test.step(`Schema validation found errors:
                    ${JSON.stringify(validate.errors, null, 2)}
                `, () => {
                    expect(validate.errors?.length).toEqual(0);
                });
            }
        });
    }

    setSchema<T>(schema: JSONSchemaType<T>) {
        this.schema = schema;
    }
}

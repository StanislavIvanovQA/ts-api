import {expect, test} from '@playwright/test';

const Codes = {
    'OK': 200,
    'Internal Server Error': 500
} as const;

export class StatusCode {
    constructor(private status: number) {
    }

    async shouldBe(code: number | keyof typeof Codes) {
        const expectedStatusCode = typeof code === 'number'
            ? code
            : Codes[code];
        await test.step(`Checking that response status code is ${expectedStatusCode}`, () => {
            expect(this.status).toEqual(expectedStatusCode);
        });
    }
}

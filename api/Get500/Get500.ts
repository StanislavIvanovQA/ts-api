import {ApiRoute} from '../ApiRoute';
import {test} from '@playwright/test';

export class Get500 extends ApiRoute {
    async get() {
        return test.step(`Sending request to get 500 route`, async () => {
            return this.apiClient.sendRequest('GET', this.url);
        });
    }
}

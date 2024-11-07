import {ApiRoute} from '../ApiRoute';
import {HttpMethod} from '../../client/HttpMethod';
import {test} from '@playwright/test';

export class CheckType extends ApiRoute {
    async check({method}: {method: HttpMethod}) {
        return test.step(`Sending request to ${this.url} with method ${method.toUpperCase()}`, async () => {
            return this.apiClient.sendRequest(method, this.url);
        })
    }
}

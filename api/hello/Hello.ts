import {ApiRoute} from '../ApiRoute';
import {test} from '@playwright/test';

export class Hello extends ApiRoute {
    async post(params?: { name?: string }) {
        return test.step(`Sending hello request${params?.name ? ` with 'name' param: ${params.name}` : ''}`,
            async () => {
                return this.apiClient.sendRequest<{answer: string}>('GET', this.url, {params});
            });
    }
}

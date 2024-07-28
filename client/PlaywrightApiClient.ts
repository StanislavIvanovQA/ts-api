import {APIRequestContext, APIResponse, request, test} from '@playwright/test';
import {Response} from './Response';
import {ApiClient, RequestOptions} from './ApiClient';
import {HttpMethod} from './HttpMethod';

export class PlaywrightApiClient implements ApiClient {
    private _apiContext: APIRequestContext | undefined;
    private async apiContext(): Promise<APIRequestContext> {
        if(!this._apiContext) {
            this._apiContext = await request.newContext();
        }
        return this._apiContext;
    };
    private extraHeaders: { [key: string]: string; } | undefined;

    async sendRequest<T extends object | string>(
        method: HttpMethod,
        url: string,
        options?: RequestOptions
    ): Promise<Response<T>> {
        return test.step(`Sending ${method} request to url '${url}', ${
            options?.body
                ? ` with body: 
                ${JSON.stringify(options.body, null, 2)}`
                : 'without body.'}
        `, async () => {
            const response = await (await this.apiContext())[method.toLowerCase() as unknown as 'get'](url, {
                data: options?.body,
                params: options?.params,
                headers: this.extraHeaders
            }) as APIResponse;
            let responseBody: Record<string, unknown> | string;

            try {
                responseBody = await response.json();
            } catch (e) {
                responseBody = await response.text();
            }

            return new Response({
                statusCode: response.status(),
                body: responseBody as T,
                headers: response.headers()
            });
        });
    }

    setExtraHeaders(headers: {[key: string]: string}) {
        this.extraHeaders = headers;
    }
}

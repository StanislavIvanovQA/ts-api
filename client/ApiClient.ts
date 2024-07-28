import {Response} from './Response';
import {HttpMethod} from './HttpMethod';

export type RequestOptions = {
    body?: Record<string, unknown> | string,
    params?: Record<string, string>
}

export type ApiClient = {
    sendRequest<T extends Record<string, unknown> | string>(
        method: HttpMethod,
        url: string,
        options?: RequestOptions
    ): Promise<Response<T>>

    setExtraHeaders(headers: {[key: string]: string}): void
}

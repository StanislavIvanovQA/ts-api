import {User} from './user/User';
import {PlaywrightApiClient} from '../client/PlaywrightApiClient';
import {ApiClient} from '../client/ApiClient';
import {Hello} from './hello/Hello';
import {Get500} from './Get500/Get500';
import {CheckType} from './CheckType/CheckType';
import {test} from '@playwright/test';

export class Api {
    private apiClient: ApiClient = new PlaywrightApiClient();

    public user = new User(this.apiClient, 'user');
    public hello = new Hello(this.apiClient, 'hello');
    public get_500 = new Get500(this.apiClient, 'get_500');
    public check_type = new CheckType(this.apiClient, 'check_type');

    async authenticate(...params: Parameters<typeof this.user.login>) {
        await test.step(`Authenticating with creds: ${params[0]}, ${params[1]}`, async () => {
            const response = await this.user.login(...params);
            await response.statusCode.shouldBe('OK');

            this.apiClient.setExtraHeaders({
                cookie: response.headers['set-cookie'],
                'x-csrf-token': response.headers['x-csrf-token']
            });
        });
    }
}

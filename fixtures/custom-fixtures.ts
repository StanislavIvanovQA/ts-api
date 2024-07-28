import {Api} from '../api/Api';
import {test as base} from '@playwright/test';
import {AuthenticatedApi} from './AuthenticatedApi';

type CustomFixtures = {
    api: Api,
    authApi: AuthenticatedApi
}

export const test = base.extend<CustomFixtures>({
    api: async ({}, use) => {
        await use(new Api());
    },
    authApi: async ({}, use) => {
        const api = new AuthenticatedApi();
        await api.authenticateWithRandomUser();

        await use(api);

        const response = await api.user.delete(api.authUser!.userId);
        await response.shouldBe({success: '!'});
    }
});

export {expect} from '@playwright/test';

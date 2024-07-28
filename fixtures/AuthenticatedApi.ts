import {Api} from '../api/Api';
import {UserParams} from '../api/user/UserParams';
import {test} from '@playwright/test';
import {createRandomUserParams} from '../utils/random';

export class AuthenticatedApi extends Api {
    authUser: UserParams & { userId: string } | undefined;

    async authenticateWithRandomUser() {
        await test.step(`Authenticating with random user`, async () => {
            const randomUserParams = createRandomUserParams();
            const response = await this.user.create(randomUserParams);
            await response.statusCode.shouldBe('OK');
            const userId = response.body.id;
            this.authUser = {
                ...randomUserParams,
                userId
            };
            await super.authenticate(this.authUser.email, this.authUser.password);
        });
    }
}

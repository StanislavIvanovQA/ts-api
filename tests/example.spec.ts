import {test, expect} from '@playwright/test';
import {UserParams} from '../api/user/UserParams';
import {createRandomUserParams} from '../utils/random';

test.describe('example suite', () => {
    const EXPECTED_METHODS = ['get', 'post', 'delete', 'put', 'patch'] as const;

    test('Hello test', async ({request}) => {
        const response = await request.get('hello?name=Stas');
        const body = await response.json() as { answer: string };

        await expect(response).toBeOK();
        expect(body.answer).toEqual('Hello, Stas');
    });

    test('Status 500 test', async ({request}) => {
        const status500response = await request.get('get_500');

        expect(status500response.status()).toEqual(500);
    });

    EXPECTED_METHODS.forEach((methodName) => {
        test(`Method test: ${methodName}`, async ({request}) => {
            const response = await request[methodName]('check_type');

            expect(await response.text()).toContain(`Request type: ${methodName.toUpperCase()}`);
        });
    });
});

type UserRequest = {
    data: UserParams
}

test.describe('auth tests', () => {
    let userId: number;
    let authCookie: string;
    let csrfToken: string;
    let userData: UserParams;

    test.beforeAll(async ({request}) => {
        const userParams: UserParams = createRandomUserParams();

        const body: UserRequest = {
            data: userParams
        };
        const response = await request.post('user', body);

        await expect(response).toBeOK();
        userId = (await response.json()).id;
        userData = userParams;
    });

    test.afterAll(async ({request}) => {
        const deleteUserResponse = await request.delete(`user/${userId}`, {
            headers: {
                'cookie': authCookie,
                'x-csrf-token': csrfToken
            }
        });
        const deleteUserResponseBody = await deleteUserResponse.json();

        expect(deleteUserResponseBody).toEqual(expect.objectContaining({success: '!'}));
    });

    test.beforeEach(async ({context}) => {
        const loginBody = {
            data: {
                email: userData.email,
                password: userData.password
            }
        };

        const loginResponse = await context.request.post('user/login', loginBody);
        await expect(loginResponse).toBeOK();

        const cookie = loginResponse.headers()['set-cookie'];
        const csrf = loginResponse.headers()['x-csrf-token'];
        await context.setExtraHTTPHeaders({'x-csrf-token': csrf});

        authCookie = cookie;
        csrfToken = csrf;
    });

    test('auth user check id', async ({context}) => {
        const response = await context.request.get('user/auth');
        const responseBody = await response.json() as { user_id: number };

        expect(responseBody.user_id).toEqual(+userId);
    });

    test('user info by id', async ({context}) => {
        const loggedInResponse = await context.request.get(`user/${userId}`);
        const loggedInResponseBody = await loggedInResponse.json();

        expect(loggedInResponseBody).toEqual(expect.objectContaining({
            id: userId.toString(),
            username: userData.username,
            email: userData.email,
            firstName: userData.firstName,
            lastName: userData.lastName
        }));
    });
});

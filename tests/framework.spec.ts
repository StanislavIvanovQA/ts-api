import {test} from '@playwright/test';
import {Api} from '../api/Api';
import {UserParams} from '../api/user/UserParams';
import {faker} from '@faker-js/faker';

test.describe('Simple Api Tests', () => {
    const EXPECTED_METHODS = ['get', 'post', 'delete', 'put', 'patch'] as const;

    test('Hello Test', async () => {
        const response = await new Api().hello.post({name: 'Stas'});

        await response.statusCode.shouldBe('OK');
        await response.shouldBe({answer: 'Hello, Stas'});
        await response.shouldHave({property: 'answer', value: 'Hello, Stas'});
    });

    test('Get 500 test', async () => {
        const response = await new Api().get_500.get();

        await response.statusCode.shouldBe('Internal Server Error');
    });

    EXPECTED_METHODS.forEach(methodName => {
        test(`Checking ${methodName}`, async () => {
            const response = await new Api().check_type.check({method: methodName});

            await response.statusCode.shouldBe('OK');
            await response.shouldContain(`Request type: ${methodName.toUpperCase()}`);
        });
    });
});

test.describe('Auth Api Tests', () => {
    let api: Api;
    let userId: string;
    let expectedUser: UserParams;

    test.beforeAll(async () => {
        api = new Api();

        const user: UserParams = {
            username: faker.internet.userName(),
            firstName: faker.person.firstName(),
            lastName: faker.person.lastName(),
            email: faker.internet.email(),
            password: faker.internet.password()
        };

        expectedUser = user;

        const userCreateResponse = await api.user.create(user);
        await userCreateResponse.statusCode.shouldBe('OK');
        userId = userCreateResponse.body.id;

        await api.authenticate(expectedUser.email, expectedUser.password);
    });

    test.afterAll(async () => {
        const response = await api.user.delete(userId);

        await response.shouldBe({success: '!'});
    });

    test('Check user id', async () => {
        const response = await api.user.getAuth();

        await response.statusCode.shouldBe('OK');
        await response.shouldBe({user_id: Number(userId)});
    });

    test('Check user info by id', async () => {
        const response = await api.user.getUserInfo(userId);

        await response.shouldHaveValidSchema();
        await response.shouldHave({property: 'firstName', value: expectedUser.firstName});
        await response.shouldBe({
            id: userId.toString(),
            username: expectedUser.username,
            email: expectedUser.email,
            firstName: expectedUser.firstName,
            lastName: expectedUser.lastName
        });
    });
});

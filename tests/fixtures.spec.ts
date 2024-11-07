import {test} from '../fixtures/custom-fixtures';

test.describe('Simple Api Tests', () => {
    const EXPECTED_METHODS = ['get', 'post', 'delete', 'put', 'patch'] as const;

    test('Hello Test', async ({api}) => {
        const response = await api.hello.post({name: 'Stas'});

        await response.statusCode.shouldBe('OK');
        await response.shouldBe({answer: 'Hello, Stas'});
        await response.shouldHave({property: 'answer', value: 'Hello, Stas'});
    });

    test('Get 500 test', async ({api}) => {
        const response = await api.get_500.get();

        await response.statusCode.shouldBe('Internal Server Error');
    });

    EXPECTED_METHODS.forEach(methodName => {
        test(`Checking ${methodName}`, async ({api}) => {
            const response = await api.check_type.check({method: methodName});

            await response.statusCode.shouldBe('OK');
            await response.shouldContain(`Request type: ${methodName.toUpperCase()}`);
        });
    });
});

test.describe('Example tests with fixtures, auth', () => {
    test('Check user id', async ({authApi}) => {
        const response = await authApi.user.getAuth();

        await response.statusCode.shouldBe('OK');
        await response.shouldBe({user_id: Number(authApi.authUser?.userId)});
    });

    test('Check user info by id', async ({authApi}) => {
        const response = await authApi.user.getUserInfo(authApi.authUser!.userId);

        await response.shouldHaveValidSchema();
        await response.shouldHave({property: 'firstName', value: authApi.authUser!.firstName});
        await response.shouldBe({
            id: authApi.authUser!.userId.toString(),
            username: authApi.authUser!.username,
            email: authApi.authUser!.email,
            firstName: authApi.authUser!.firstName,
            lastName: authApi.authUser!.lastName
        });
    });
});

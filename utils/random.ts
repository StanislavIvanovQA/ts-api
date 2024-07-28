import {UserParams} from '../api/user/UserParams';
import {faker} from '@faker-js/faker';

export const createRandomUserParams = (): UserParams => {
    return {
        username: faker.internet.userName(),
        firstName: faker.person.firstName(),
        lastName: faker.person.lastName(),
        email: faker.internet.email(),
        password: faker.internet.password()
    };
};

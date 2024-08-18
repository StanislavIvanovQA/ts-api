import {test} from '@playwright/test';
import {ApiRoute} from '../ApiRoute';
import {UserParams} from './UserParams';
import {CreateUserResponse} from './CreateUserResponse';
import {GetUserAuthResponse} from './GetUserAuthResponse';
import {UserInfo, UserInfoSchema} from './UserInfo';

export class User extends ApiRoute {
    async login(email: string, password: string) {
        return test.step(`Logging in with creds:
        email: ${email}
        password: ${password}`, async () => {
            const body = {email, password};

            return this.apiClient.sendRequest('post', `${this.url}/login`, {body});
        });
    }

    async create(userParams: UserParams) {
        return test.step(`Creating new user with params:
            username: ${userParams.username}
            firstName: ${userParams.firstName}
            lastName: ${userParams.lastName}
            email: ${userParams.email}
            password: ${userParams.email}
        `, async () => {
            return this.apiClient.sendRequest<CreateUserResponse>('post', this.url, {body: userParams});
        });
    }

    async delete(id: string | number) {
        const userId = typeof id === 'number' ? id.toString() : id;
        return test.step(`Deleting user with id ${id}`, async () => {
            return this.apiClient.sendRequest<{success: string}>('delete', this.url, {params: {id: userId}})
        });
    }

    async getAuth() {
        return test.step(`Fetching user id`, async () => {
            return this.apiClient.sendRequest<GetUserAuthResponse>('get', `${this.url}/auth`);
        });
    }

    async getUserInfo(id: number | string) {
        const userId = typeof id === 'string' ? Number(id) : id;
        return test.step(`Fetching user info by id: ${id}`, async () => {
            const response = await this.apiClient.sendRequest<UserInfo>('get', `${this.url}/${userId}`);
            response.setSchema(UserInfoSchema);
            return response;
        })
    }
}

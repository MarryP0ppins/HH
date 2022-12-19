import { postApiRequest } from 'api';

export enum SEX {
    MALE = 'MALE',
    FEMALE = 'FEMALE',
}

export interface AuthorizationResponse {
    id: number;
    username: string;
    email: string;
    is_worker: boolean;
    is_staff: boolean;
    is_superuser: boolean;
    created_at: string;
    birth_date: string;
    sex: SEX;
}

export interface AuthorizationParams {
    username: string;
    password: string;
}

export const authorization = async (params: AuthorizationParams): Promise<AuthorizationResponse> => {
    return await postApiRequest(`/login/`, params);
};

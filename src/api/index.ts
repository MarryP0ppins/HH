import axios, { AxiosError } from 'axios';

export const api = axios.create({
    baseURL: 'http://127.0.0.1:8000/',
    withCredentials: true
});

export const getApiRequest = <ResponseType, BodyType>(link: string, body?: BodyType): Promise<ResponseType> =>
    api
        .get<ResponseType>(link, body)
        .then((res) => res.data)
        .catch((err: AxiosError<Record<string, string>>) => {
            throw JSON.stringify(err.response?.data);
        });

export const patchApiRequest = <ResponseType, BodyType>(link: string, body?: BodyType): Promise<ResponseType> =>
    api
        .patch<ResponseType>(link, body)
        .then((res) => res.data)
        .catch((err: AxiosError<Record<string, string>>) => {
            throw JSON.stringify(err.response?.data);
        });

export const postApiRequest = <ResponseType, BodyType>(link: string, body?: BodyType): Promise<ResponseType> =>
    api
        .post<ResponseType>(link, body)
        .then((res) => res.data)
        .catch((err: AxiosError<Record<string, string>>) => {
            throw JSON.stringify(err.response?.data);
        });

export const deleteApiRequest = <ResponseType, BodyType>(link: string, params?: BodyType): Promise<ResponseType> =>
    api
        .delete<ResponseType>(link, params)
        .then((res) => res.data)
        .catch((err: AxiosError<Record<string, string>>) => {
            throw JSON.stringify(err.response?.data);
        });

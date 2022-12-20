import { createAsyncThunk } from '@reduxjs/toolkit';
import { authorization, AuthorizationParams, registration, RegistrationParams, unAuthorize } from 'api/services/user';

export const authorizationAction = createAsyncThunk('user/login', (params: AuthorizationParams) => {
    return authorization(params);
});

export const registrationAction = createAsyncThunk('user/registration', (params: RegistrationParams) => {
    return registration(params);
});

export const unAuthorizeAction = createAsyncThunk('user/logout', () => {
    return unAuthorize();
});

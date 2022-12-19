import { createAsyncThunk } from '@reduxjs/toolkit';
import { authorization, AuthorizationParams } from 'api/services/user';

export const authorizationAction = createAsyncThunk('user/login', (params: AuthorizationParams) => {
    return authorization(params);
});

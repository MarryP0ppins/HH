import { ActionCreatorWithoutPayload, createSlice, SliceCaseReducers } from '@reduxjs/toolkit';
import { AuthorizationResponse } from 'api/services/user';
import { authorizationAction } from 'store/actions/user';
import { FetchStatus } from 'types/api';

export interface UserState {
    getLoginStatus: FetchStatus;
    getLogoutStatus: FetchStatus;
    user: AuthorizationResponse | null;
    isAuthorized: boolean;
    error: unknown;
}

const initialState: UserState = {
    getLoginStatus: FetchStatus.INITIAL,
    getLogoutStatus: FetchStatus.INITIAL,
    user: null,
    isAuthorized: false,
    error: null,
};

const userSlice = createSlice<UserState, SliceCaseReducers<UserState>>({
    name: 'user',
    initialState,
    reducers: {
        reset: () => initialState,
    },
    extraReducers: (builder) => {
        builder
            .addCase(authorizationAction.pending, (state) => {
                state.getLoginStatus = FetchStatus.FETCHING;
                state.error = null;
            })
            .addCase(authorizationAction.fulfilled, (state, { payload }) => {
                state.getLoginStatus = FetchStatus.FETCHED;
                state.user = payload;
                state.isAuthorized = true;
                state.error = null;
            })
            .addCase(authorizationAction.rejected, (state, { error }) => {
                state.getLoginStatus = FetchStatus.ERROR;
                state.isAuthorized = false;
                state.error = error;
            });
    },
});

export const resetUserState = userSlice.actions.reset as ActionCreatorWithoutPayload<string>;
export const userReducer = userSlice.reducer;

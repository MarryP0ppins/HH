import { ActionCreatorWithoutPayload, createSlice, SliceCaseReducers } from '@reduxjs/toolkit';
import { AuthorizationResponse, UsersResponse } from 'api/services/user';
import { authorizationAction, getUsersAction, registrationAction, unAuthorizeAction } from 'store/actions/user';
import { FetchStatus } from 'types/api';

export interface UserState {
    loginStatus: FetchStatus;
    registrationStatus: FetchStatus;
    logoutStatus: FetchStatus;
    getUsersStatus: FetchStatus;
    users: UsersResponse[];
    user: AuthorizationResponse | null;
    isAuthorized: boolean;
    error: unknown;
}

const initialState: UserState = {
    loginStatus: FetchStatus.INITIAL,
    registrationStatus: FetchStatus.INITIAL,
    logoutStatus: FetchStatus.INITIAL,
    getUsersStatus: FetchStatus.INITIAL,
    users: [],
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
                state.loginStatus = FetchStatus.FETCHING;
                state.error = null;
            })
            .addCase(authorizationAction.fulfilled, (state, { payload }) => {
                state.loginStatus = FetchStatus.FETCHED;
                state.user = payload;
                state.isAuthorized = true;
                state.error = null;
            })
            .addCase(authorizationAction.rejected, (state, { error }) => {
                state.loginStatus = FetchStatus.ERROR;
                state.isAuthorized = false;
                state.error = error;
            });
        builder
            .addCase(registrationAction.pending, (state) => {
                state.registrationStatus = FetchStatus.FETCHING;
                state.error = null;
            })
            .addCase(registrationAction.fulfilled, (state) => {
                state.registrationStatus = FetchStatus.FETCHED;
                state.error = null;
            })
            .addCase(registrationAction.rejected, (state, { error }) => {
                state.registrationStatus = FetchStatus.ERROR;
                state.error = error;
            });
        builder
            .addCase(unAuthorizeAction.pending, (state) => {
                state.logoutStatus = FetchStatus.FETCHING;
                state.error = null;
            })
            .addCase(unAuthorizeAction.fulfilled, (state) => {
                state.logoutStatus = FetchStatus.FETCHED;
                state.isAuthorized = false;
                state.user = null;
                state.error = null;
            })
            .addCase(unAuthorizeAction.rejected, (state, { error }) => {
                state.logoutStatus = FetchStatus.ERROR;
                state.error = error;
            });
        builder
            .addCase(getUsersAction.pending, (state) => {
                state.getUsersStatus = FetchStatus.FETCHING;
                state.error = null;
            })
            .addCase(getUsersAction.fulfilled, (state, { payload }) => {
                state.logoutStatus = FetchStatus.FETCHED;
                state.users = payload;
                state.error = null;
            })
            .addCase(getUsersAction.rejected, (state, { error }) => {
                state.getUsersStatus = FetchStatus.ERROR;
                state.error = error;
            });
    },
});

export const resetUserState = userSlice.actions.reset as ActionCreatorWithoutPayload<string>;
export const userReducer = userSlice.reducer;

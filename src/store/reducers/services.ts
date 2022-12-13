import { ActionCreatorWithoutPayload, createSlice, SliceCaseReducers } from '@reduxjs/toolkit';
import { ServiceResponse, ServicesPriceRange } from 'api/services/services';
import { getServiceByIdAction, getServicesAction, getServicesPriceRangeAction } from 'store/actions/services';
import { FetchStatus } from 'types/api';

export interface ServiceState {
    getServicesStatus: FetchStatus;
    getServiceByIdStatus: FetchStatus;
    getServicesPriceRangeStatus: FetchStatus;
    services: ServiceResponse[];
    servicesPriceRange: ServicesPriceRange | null;
    error: unknown;
}

const initialState: ServiceState = {
    getServicesStatus: FetchStatus.INITIAL,
    getServiceByIdStatus: FetchStatus.INITIAL,
    getServicesPriceRangeStatus: FetchStatus.INITIAL,
    services: [],
    servicesPriceRange: null,
    error: null,
};

const servicesSlice = createSlice<ServiceState, SliceCaseReducers<ServiceState>>({
    name: 'services',
    initialState,
    reducers: {
        reset: () => initialState,
    },
    extraReducers: (builder) => {
        builder
            .addCase(getServicesAction.pending, (state) => {
                state.getServicesStatus = FetchStatus.FETCHING;
                state.error = null;
            })
            .addCase(getServicesAction.fulfilled, (state, { payload }) => {
                state.getServicesStatus = FetchStatus.FETCHED;
                state.services = payload;
                state.error = null;
            })
            .addCase(getServicesAction.rejected, (state, { error }) => {
                state.getServicesStatus = FetchStatus.ERROR;
                state.error = error;
            });
        builder
            .addCase(getServiceByIdAction.pending, (state) => {
                state.getServiceByIdStatus = FetchStatus.FETCHING;
                state.error = null;
            })
            .addCase(getServiceByIdAction.fulfilled, (state, { payload }) => {
                console.log(payload);
                state.getServiceByIdStatus = FetchStatus.FETCHED;
                state.services = [payload];
                state.error = null;
            })
            .addCase(getServiceByIdAction.rejected, (state, { error }) => {
                state.getServiceByIdStatus = FetchStatus.ERROR;
                state.error = error;
            });
        builder
            .addCase(getServicesPriceRangeAction.pending, (state) => {
                state.getServicesPriceRangeStatus = FetchStatus.FETCHING;
                state.error = null;
            })
            .addCase(getServicesPriceRangeAction.fulfilled, (state, { payload }) => {
                state.getServicesPriceRangeStatus = FetchStatus.FETCHED;
                state.servicesPriceRange = payload;
                state.error = null;
            })
            .addCase(getServicesPriceRangeAction.rejected, (state, { error }) => {
                state.getServicesPriceRangeStatus = FetchStatus.ERROR;
                state.error = error;
            });
    },
});

export const resetServicesState = servicesSlice.actions.reset as ActionCreatorWithoutPayload<string>;
export const servicesReducer = servicesSlice.reducer;

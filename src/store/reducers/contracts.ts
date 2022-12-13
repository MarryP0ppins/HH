import { ActionCreatorWithoutPayload, createSlice, SliceCaseReducers } from '@reduxjs/toolkit';
import { ContractResponse } from 'api/services/contracts';
import {
    createExecutionContractAction,
    deleteContractAction,
    getContractsAction,
    patchContractAction,
} from 'store/actions/contracts';
import { FetchStatus } from 'types/api';

export interface ContractState {
    createExecutionContractStatus: FetchStatus;
    getContractsStatus: FetchStatus;
    updateContractStatus: FetchStatus;
    deleteContractStatus: FetchStatus;
    contracts: ContractResponse[];
    error: unknown;
}

const initialState: ContractState = {
    createExecutionContractStatus: FetchStatus.INITIAL,
    getContractsStatus: FetchStatus.INITIAL,
    updateContractStatus: FetchStatus.INITIAL,
    deleteContractStatus: FetchStatus.INITIAL,
    contracts: [],
    error: null,
};

const contractsSlice = createSlice<ContractState, SliceCaseReducers<ContractState>>({
    name: 'contracts',
    initialState,
    reducers: {
        reset: () => initialState,
    },
    extraReducers: (builder) => {
        builder
            .addCase(createExecutionContractAction.pending, (state) => {
                state.createExecutionContractStatus = FetchStatus.FETCHING;
                state.error = null;
            })
            .addCase(createExecutionContractAction.fulfilled, (state, { payload }) => {
                state.createExecutionContractStatus = FetchStatus.FETCHED;
                state.contracts = (state.contracts || []).concat(payload);
                state.error = null;
            })
            .addCase(createExecutionContractAction.rejected, (state, { error }) => {
                state.createExecutionContractStatus = FetchStatus.ERROR;
                state.error = error;
            });
        builder
            .addCase(getContractsAction.pending, (state) => {
                state.getContractsStatus = FetchStatus.FETCHING;
                state.error = null;
            })
            .addCase(getContractsAction.fulfilled, (state, { payload }) => {
                state.getContractsStatus = FetchStatus.FETCHED;
                state.contracts = payload;
                state.error = null;
            })
            .addCase(getContractsAction.rejected, (state, { error }) => {
                state.getContractsStatus = FetchStatus.ERROR;
                state.error = error;
            });
        builder
            .addCase(patchContractAction.pending, (state) => {
                state.updateContractStatus = FetchStatus.FETCHING;
                state.error = null;
            })
            .addCase(patchContractAction.fulfilled, (state, { payload }) => {
                state.updateContractStatus = FetchStatus.FETCHED;
                state.contracts = state.contracts.filter((contract) => contract.id !== payload.id);
                state.error = null;
            })
            .addCase(patchContractAction.rejected, (state, { error }) => {
                state.updateContractStatus = FetchStatus.ERROR;
                state.error = error;
            });
        builder
            .addCase(deleteContractAction.pending, (state) => {
                state.deleteContractStatus = FetchStatus.FETCHING;
                state.error = null;
            })
            .addCase(deleteContractAction.fulfilled, (state, { payload }) => {
                state.deleteContractStatus = FetchStatus.FETCHED;
                state.contracts = state.contracts.filter((contract) => contract.id !== payload);
                state.error = null;
            })
            .addCase(deleteContractAction.rejected, (state, { error }) => {
                state.deleteContractStatus = FetchStatus.ERROR;
                state.error = error;
            });
    },
});

export const resetContractsState = contractsSlice.actions.reset  as ActionCreatorWithoutPayload<string>;
export const contractsReducer = contractsSlice.reducer;

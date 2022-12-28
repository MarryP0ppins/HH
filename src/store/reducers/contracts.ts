import { ActionCreatorWithoutPayload, createSlice, SliceCaseReducers } from '@reduxjs/toolkit';
import { ContractResponse, ContractStatus, ContractStatusResponse } from 'api/services/contracts';
import {
    createExecutionContractAction,
    deleteContractAction,
    getContractsAction,
    getContractStatusesAction,
    getRequestContractsAction,
    getWorkerActualContractsAction,
    patchContractAction,
} from 'store/actions/contracts';
import { FetchStatus } from 'types/api';

export interface ContractState {
    createExecutionContractStatus: FetchStatus;
    getContractsStatus: FetchStatus;
    updateContractStatus: FetchStatus;
    deleteContractStatus: FetchStatus;
    getContractStatusesStatus: FetchStatus;
    getRequestContractsStatus: FetchStatus;
    getWorkerContracts: FetchStatus;
    contractStatuses: ContractStatusResponse[];
    contracts: ContractResponse[];
    workerContracts: ContractResponse[];
    error: unknown;
}

const initialState: ContractState = {
    createExecutionContractStatus: FetchStatus.INITIAL,
    getContractsStatus: FetchStatus.INITIAL,
    updateContractStatus: FetchStatus.INITIAL,
    deleteContractStatus: FetchStatus.INITIAL,
    getContractStatusesStatus: FetchStatus.INITIAL,
    getRequestContractsStatus: FetchStatus.INITIAL,
    getWorkerContracts: FetchStatus.INITIAL,
    contractStatuses: [],
    workerContracts: [],
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
                state.contracts = payload.filter((contract) => contract.status !== ContractStatus.REQUEST);
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
                state.contracts =
                    state.contracts?.map((contract) => (contract.id !== payload.id ? contract : payload)) ?? [];
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
                state.contracts = state.contracts?.filter((contract) => contract.id !== payload.id) ?? [];
                state.error = null;
            })
            .addCase(deleteContractAction.rejected, (state, { error }) => {
                state.deleteContractStatus = FetchStatus.ERROR;
                state.error = error;
            });
        builder
            .addCase(getContractStatusesAction.pending, (state) => {
                state.getContractStatusesStatus = FetchStatus.FETCHING;
                state.error = null;
            })
            .addCase(getContractStatusesAction.fulfilled, (state, { payload }) => {
                state.getContractStatusesStatus = FetchStatus.FETCHED;
                state.contractStatuses = payload;
                state.error = null;
            })
            .addCase(getContractStatusesAction.rejected, (state, { error }) => {
                state.getContractStatusesStatus = FetchStatus.ERROR;
                state.error = error;
            });
        builder
            .addCase(getRequestContractsAction.pending, (state) => {
                state.getRequestContractsStatus = FetchStatus.FETCHING;
                state.error = null;
            })
            .addCase(getRequestContractsAction.fulfilled, (state, { payload }) => {
                state.getRequestContractsStatus = FetchStatus.FETCHED;
                state.contracts = (state.contracts ?? []).concat(payload);
                state.error = null;
            })
            .addCase(getRequestContractsAction.rejected, (state, { error }) => {
                state.getRequestContractsStatus = FetchStatus.ERROR;
                state.error = error;
            });
        builder
            .addCase(getWorkerActualContractsAction.pending, (state) => {
                state.getWorkerContracts = FetchStatus.FETCHING;
                state.error = null;
            })
            .addCase(getWorkerActualContractsAction.fulfilled, (state, { payload }) => {
                state.getWorkerContracts = FetchStatus.FETCHED;
                state.workerContracts = payload;
                state.error = null;
            })
            .addCase(getWorkerActualContractsAction.rejected, (state, { error }) => {
                state.getWorkerContracts = FetchStatus.ERROR;
                state.error = error;
            });
    },
});

export const resetContractsState = contractsSlice.actions.reset as ActionCreatorWithoutPayload<string>;
export const contractsReducer = contractsSlice.reducer;

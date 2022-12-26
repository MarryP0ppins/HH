import { createAsyncThunk } from '@reduxjs/toolkit';
import {
    ContractParams,
    createExecutionContract,
    deleteContract,
    getContracts,
    getContractStatuses,
    patchContract,
    PatchContractParams,
    PostContractParams,
} from 'api/services/contracts';

export const createExecutionContractAction = createAsyncThunk('contracts/executing', (params: PostContractParams) => {
    return createExecutionContract(params);
});

export const getContractsAction = createAsyncThunk('contracts/contracts', (params: ContractParams) => {
    return getContracts(params);
});

export const patchContractAction = createAsyncThunk('contracts/update', (params: PatchContractParams) => {
    return patchContract(params);
});

export const deleteContractAction = createAsyncThunk('contracts/delete', (id_ticket: number) => {
    void deleteContract(id_ticket);
    return id_ticket;
});

export const getContractStatusesAction = createAsyncThunk('contracts/contract_statuses', () => {
    return getContractStatuses();
});

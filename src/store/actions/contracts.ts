import { createAsyncThunk } from '@reduxjs/toolkit';
import {
    ContractParams,
    ContractStatus,
    createExecutionContract,
    deleteContract,
    getContracts,
    getContractStatuses,
    patchContract,
    PatchContractParams,
    PostContractParams,
} from 'api/services/contracts';
import { getServices } from 'api/services/services';

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
    return deleteContract(id_ticket);
});

export const getContractStatusesAction = createAsyncThunk('contracts/contract_statuses', () => {
    return getContractStatuses();
});

export const getRequestContractsAction = createAsyncThunk('contracts/requestContracts', () => {
    return getContracts({ status: ContractStatus.REQUEST });
});

export const getWorkerActualContractsAction = createAsyncThunk(
    'contracts/workerContracts',
    async (worker_id: number) => {
        const value = await getServices({ user: worker_id, all: true });
        const temp = String(value?.map((service) => service.id));

        const result = await getContracts({
            services: temp?.length ? temp : undefined,
        });
        return result;
    },
);

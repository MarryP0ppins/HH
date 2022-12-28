import { deleteApiRequest, getApiRequest, patchApiRequest, postApiRequest } from 'api';

export enum ContractStatus {
    EXECUTION = 'EXECUTION',
    SIGN = 'SIGN',
    RESIGNING = 'RESIGNING',
    REQUEST = 'REQUEST',
}

export interface ContractResponse {
    id: number;
    client: number;
    service: number;
    duration: number;
    date_of_execution: string;
    date_of_signing: string;
    status: ContractStatus;
}

export interface PostContractParams {
    client: number;
    service: number;
    date_of_execution?: string;
    date_of_signing?: string;
    status: ContractStatus;
    duration: number;
}

export interface PatchContractParams {
    id: number;
    date_of_execution?: string;
    date_of_signing?: string;
    status: ContractStatus;
}

export interface ContractParams {
    client?: number;
    status?: ContractStatus;
    services?: string;
}

export interface ContractStatusResponse {
    value: string;
    label: string;
}

export const createExecutionContract = async (params: PostContractParams): Promise<ContractResponse> => {
    return await postApiRequest(`/contracts/`, params);
};

export const getContracts = async (params: ContractParams): Promise<ContractResponse[]> => {
    return await getApiRequest(`/contracts/`, {
        params: {
            status: params?.status,
            client_id: params?.client,
            services: params?.services,
        },
    });
};

export const patchContract = async (params: PatchContractParams): Promise<ContractResponse> => {
    const { id, ...other_params } = params;
    return await patchApiRequest(`/contracts/${id}/`, other_params);
};

export const deleteContract = async (contract_id: number): Promise<ContractResponse> => {
    return await deleteApiRequest(`/contracts/${contract_id}/`);
};

export const getContractStatuses = async (): Promise<ContractStatusResponse[]> => {
    return await getApiRequest(`/contracts/contract_statuses/`);
};

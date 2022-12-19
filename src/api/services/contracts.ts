import { deleteApiRequest, getApiRequest, patchApiRequest, postApiRequest } from 'api';

export enum ContractStatus {
    EXECUTION = 'execution',
    SIGN = 'sign',
    RESIGNING = 'resigning',
}

export interface ContractResponse {
    id: number;
    id_client: number;
    id_service: number;
    duration: number;
    date_of_execution: string;
    date_of_signing: string;
    status: ContractStatus;
}

export interface PostContractParams {
    id_client: number;
    id_service: number;
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
    id_client: number;
    status: ContractStatus;
}

export const createExecutionContract = async (params: PostContractParams): Promise<ContractResponse> => {
    return await postApiRequest(`/contracts/`, params);
};

export const getContracts = async (params: ContractParams): Promise<ContractResponse[]> => {
    return await getApiRequest(`/contracts/`, {
        params: {
            status: params?.status,
            client_id: params?.id_client,
        },
    });
};

export const patchContract = async (params: PatchContractParams): Promise<ContractResponse> => {
    const { id, ...other_params } = params;
    return await patchApiRequest(`/contracts/${id}/`, other_params);
};

export const deleteContract = async (contract_id: number): Promise<ContractResponse> => {
    return await deleteApiRequest(`/v/${contract_id}/`);
};

import { getApiRequest } from 'api';

export interface ServiceResponse {
    id: number;
    id_user: number;
    title: string;
    description: string;
    price: number;
    rating: number;
    city: number;
}

export interface ServicesParams {
    all?: boolean;
    services_ids?: number[];
    title?: string;
    price_max?: number;
    price_min?: number;
    rating?: number;
    city?: string;
}

export interface ServicesPriceRange {
    price_min: number;
    price_max: number;
}

export const getServices = async (params?: ServicesParams): Promise<ServiceResponse[]> => {
    return await getApiRequest(`/services/`, {
        params: {
            all: params?.all,
            title: params?.title,
            price_max: params?.price_max,
            price_min: params?.price_min,
            rating: params?.rating,
            city: params?.city,
        },
    });
};

export const getServiceById = async (service_id: number): Promise<ServiceResponse> => {
    return await getApiRequest(`/services/${service_id}/`);
};

export const getServicesPriceRange = async (): Promise<ServicesPriceRange> => {
    return await getApiRequest('/services/price_range/');
};

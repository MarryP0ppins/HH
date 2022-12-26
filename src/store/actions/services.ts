import { createAsyncThunk } from '@reduxjs/toolkit';
import {
    createService,
    getServiceById,
    getServices,
    getServicesPriceRange,
    patchServiceById,
    ServiceCreate,
    ServicePatch,
    ServicesParams,
} from 'api/services/services';

export const getServicesAction = createAsyncThunk('service/service', (params?: ServicesParams) => {
    return getServices(params);
});

export const getServiceByIdAction = createAsyncThunk('service/serviceById', (service_id: number) => {
    return getServiceById(service_id);
});

export const getServicesPriceRangeAction = createAsyncThunk('service/price-range', () => {
    return getServicesPriceRange();
});

export const editServiceByIdAction = createAsyncThunk('service/edit', (params: ServicePatch) => {
    return patchServiceById(params);
});

export const createServiceAction = createAsyncThunk('service/create', (params: ServiceCreate) => {
    return createService(params);
});

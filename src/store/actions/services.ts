import { createAsyncThunk } from '@reduxjs/toolkit';
import { getServiceById, getServices, getServicesPriceRange, ServicesParams } from 'api/services/services';

export const getServicesAction = createAsyncThunk('service/service', (params?: ServicesParams) => {
    return getServices(params);
});

export const getServiceByIdAction = createAsyncThunk('service/serviceById', (service_id: number) => {
    return getServiceById(service_id);
});

export const getServicesPriceRangeAction = createAsyncThunk('service/price-range', () => {
    return getServicesPriceRange();
});

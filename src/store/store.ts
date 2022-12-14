import { TypedUseSelectorHook, useSelector } from 'react-redux';
import { combineReducers, configureStore } from '@reduxjs/toolkit';
import { authReducer as auth } from 'store/reducers/auth';
import { contractsReducer as contracts } from 'store/reducers/contracts';
import { loaderReducer as loader } from 'store/reducers/loader';
import { servicesReducer as services } from 'store/reducers/services';

const reducer = combineReducers({
    contracts,
    loader,
    services,
    auth,
});

export const store = configureStore({
    reducer,
});

export type State = ReturnType<typeof store.getState>;

// Use throughout your app instead of plain `useSelector`
export const useAppSelector: TypedUseSelectorHook<State> = useSelector;

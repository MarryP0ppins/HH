import { TypedUseSelectorHook, useSelector } from 'react-redux';
import { combineReducers, configureStore } from '@reduxjs/toolkit';
import { contractsReducer as contracts } from 'store/reducers/contracts';
import { loaderReducer as loader } from 'store/reducers/loader';
import { servicesReducer as services } from 'store/reducers/services';
import { userReducer as user } from 'store/reducers/user';

const reducer = combineReducers({
    contracts,
    loader,
    services,
    user,
});

export const store = configureStore({
    reducer,
});

export type State = ReturnType<typeof store.getState>;

// Use throughout your app instead of plain `useSelector`
export const useAppSelector: TypedUseSelectorHook<State> = useSelector;

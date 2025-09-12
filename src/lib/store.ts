import { configureStore } from '@reduxjs/toolkit';

import { itemsApi } from './features/items/itemsApi';
import { locationApi } from './features/location/locationApi';
import { searchSlice } from './features/search/searchSlice';
import { userApi } from './features/user/userApi';

export const makeStore = () => {
  return configureStore({
    reducer: {
      search: searchSlice.reducer,
      [itemsApi.reducerPath]: itemsApi.reducer,
      [locationApi.reducerPath]: locationApi.reducer,
      [userApi.reducerPath]: userApi.reducer,
    },
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware().concat(
        itemsApi.middleware,
        locationApi.middleware,
        userApi.middleware
      ),
  });
};

// Infer the type of makeStore
export type AppStore = ReturnType<typeof makeStore>;
// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<AppStore['getState']>;
export type AppDispatch = AppStore['dispatch'];

import { configureStore } from '@reduxjs/toolkit';

import { itemsApi } from './features/items/itemsApi';
import { searchSlice } from './features/search/searchSlice';

export const makeStore = () => {
  return configureStore({
    reducer: {
      search: searchSlice.reducer,
      [itemsApi.reducerPath]: itemsApi.reducer,
    },
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware().concat(itemsApi.middleware),
  });
};

// Infer the type of makeStore
export type AppStore = ReturnType<typeof makeStore>;
// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<AppStore['getState']>;
export type AppDispatch = AppStore['dispatch'];

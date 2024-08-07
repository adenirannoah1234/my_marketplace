// src/store.ts
import { configureStore } from '@reduxjs/toolkit';
import { apiSlice } from './features/apiSlice';
import authReducer from './features/auth/authSlice'; 
import productReducer from './features/products/productsSlice';

export const store = configureStore({
  reducer: {
    [apiSlice.reducerPath]: apiSlice.reducer,
    auth: authReducer,
    products: productReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(apiSlice.middleware),
});

// Export types
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export type AppStore = typeof store; // Adding AppStore type

// src/store.ts
import { configureStore } from '@reduxjs/toolkit';
import { authApiSlice } from './features/auth/authApiSlice';
import authReducer from './features/auth/authSlice'; 
import productReducer from './features/products/product.reducer';
import categoryReducer from './features/category/category.reducer';
import { productsApiSlice } from './features/products/productsApiSlice';
import { categoryApiSlice } from './features/category/categorySlice';

export const store = configureStore({
  reducer: {
    [authApiSlice.reducerPath]: authApiSlice.reducer,
    [productsApiSlice.reducerPath]: productsApiSlice.reducer,
    [categoryApiSlice.reducerPath]: categoryApiSlice.reducer,
    auth: authReducer,
    products: productReducer,
    categories: categoryReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(authApiSlice.middleware, productsApiSlice.middleware, categoryApiSlice.middleware),
});

// Export types
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export type AppStore = typeof store; // Adding AppStore type

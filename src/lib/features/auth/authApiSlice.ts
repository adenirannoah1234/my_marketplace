// src/features/auth/authApiSlice.ts
import { apiSlice } from "../apiSlice";

// Define the User type if not already defined
interface User {
  // Define user properties here
  id: string;
  email: string;
  // ... other properties
}

export const authApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    login: builder.mutation<User, { email: string; password: string }>({
      query: (credentials) => ({
        url: '/auth/signin',
        method: 'POST',
        body: credentials,
      }),
    }),
    signup: builder.mutation<{ user: User; token: string } | { data: { user: User; token: string } }, FormData>({
        query: (formData) => ({
          url: '/auth/signup',
          method: 'POST',
          body: formData,
          formData: true,
        }),
    }),
    logout: builder.mutation<void, void>({
      query: () => ({
        url: '/auth/logout',
        method: 'POST',
      }),
    }),
  }),
});

export const {
  useLoginMutation,
  useSignupMutation,
  useLogoutMutation,
} = authApiSlice;
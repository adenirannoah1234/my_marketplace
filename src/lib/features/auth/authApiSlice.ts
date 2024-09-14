import { apiSlice } from "../apiSlice";

interface User {
  id: string;
  email: string;
  name: string;
}

export type AuthResponse = {
  user: User;
  token: string;
};

const jsonHeaders = {
  'Content-Type': 'application/json',
};

export const authApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    login: builder.mutation<AuthResponse, { email: string; password: string }>({
      query: (credentials) => ({
        url: '/api/auth/callback/credentials',
        method: 'POST',
        body: credentials,
        headers: jsonHeaders,
      }),
    }),
    signup: builder.mutation<AuthResponse, FormData>({
      query: (formData) => ({
        url: '/api/auth/signup',
        method: 'POST',
        body: formData,
      }),
    }),
    logout: builder.mutation<void, void>({
      query: () => ({
        url: '/api/auth/signout',
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

export default authApiSlice;
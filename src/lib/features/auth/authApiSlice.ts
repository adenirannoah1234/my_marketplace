import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import {
  createUserWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  UserCredential,
} from "firebase/auth";
import { auth } from "../../../config/fireBaseConfig";

interface User {
  id: string;
  email: string;
  name: string;
}

interface LoginCredentials {
  email: string;
  password: string;
}

export type AuthResponse = {
  user: User;
  token: string;
};

const handleAuthResponse = async (userCredential: UserCredential): Promise<AuthResponse> => {
  const user = userCredential.user;
  return {
    user: {
      id: user.uid,
      email: user.email!,
      name: user.displayName || user.email!.split('@')[0]
    },
    token: await user.getIdToken()
  };
};

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api';

export const authApiSlice = createApi({
  reducerPath: 'authApi',
  baseQuery: fetchBaseQuery({ baseUrl: BASE_URL }),
  endpoints: (builder) => ({
    login: builder.mutation<AuthResponse, LoginCredentials>({
      query: (credentials) => ({
        url: '/auth/callback/credentials',
        method: 'POST',
        body: credentials,
      }),
    }),
    googleSignup: builder.mutation<AuthResponse, void>({
      async queryFn() {
        try {
          const provider = new GoogleAuthProvider();
          const userCredential = await signInWithPopup(auth, provider);
          return { data: await handleAuthResponse(userCredential) };
        } catch (error: any) {
          return { error: { status: error.code, data: error.message } };
        }
      },
    }),
    signup: builder.mutation<AuthResponse, { email: string; password: string; name: string }>({
      async queryFn({ email, password, name }) {
        try {
          const userCredential = await createUserWithEmailAndPassword(auth, email, password);
         
          return { data: await handleAuthResponse(userCredential) };
        } catch (error: any) {
          return { error: { status: error.code, data: error.message } };
        }
      },
    }),
  }),
});

export const {
  useLoginMutation,
  useGoogleSignupMutation,
  useSignupMutation,
} = authApiSlice;
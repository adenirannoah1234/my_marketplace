// src/providers.tsx
'use client';
// import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ChakraProvider, extendTheme } from '@chakra-ui/react';
import StoreProvider from './storeProvider';
import { SessionProvider } from 'next-auth/react';

export function Providers({ children }: { children: React.ReactNode }) {
  //   const queryClient = new QueryClient();

  return (
    <StoreProvider>
      {/* <QueryClientProvider client={queryClient}> */}
      <ChakraProvider>
        <SessionProvider>{children}</SessionProvider>
      </ChakraProvider>
      {/* </QueryClientProvider> */}
    </StoreProvider>
  );
}

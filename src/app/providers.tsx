'use client';

import { ChakraProvider } from '@chakra-ui/react';
import StoreProvider from './storeProvider';
import { SessionProvider } from 'next-auth/react';

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      <StoreProvider>
        <ChakraProvider>{children}</ChakraProvider>
      </StoreProvider>
    </SessionProvider>
  );
}

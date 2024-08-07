'use client';
import { HStack, Box } from '@chakra-ui/react';
import Image from 'next/image';

function LayoutContainer({ children }: { children: React.ReactNode }) {
  return (
    <HStack>
      <Box
        display={{ base: 'none', lg: 'block' }}
        pos="relative"
        minH={'100vh'}
        h="100vh"
        width="50vw"
      >
        {/* <Image src="/auth-img.png" fill alt="" /> */}
      </Box>
      <Box w={{ base: '100%', lg: '50%' }} maxH={'100vh'} overflowY={'scroll'}>
        {children}
      </Box>
    </HStack>
  );
}

export default LayoutContainer;

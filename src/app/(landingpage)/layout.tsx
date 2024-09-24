'use client';

import { Nunito } from 'next/font/google';

import { Flex, Box, VStack } from '@chakra-ui/react';

const inter = Nunito({ subsets: ['latin'] });

import { useSession } from 'next-auth/react';
import { usePathname, useRouter } from 'next/navigation';
import { ThreeDots } from 'react-loader-spinner';
import Header from './component/Navbar';

export default function LandingPageLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { data: session, status } = useSession();

  const router = useRouter();

  const pathname = usePathname();

  if (status === 'loading') {
    return (
      <Flex
        justifyContent="center"
        alignItems="center"
        height="100vh"
        width="100vw"
        backgroundColor="#f5f5f5"
      >
        <ThreeDots
          height="80"
          width="80"
          radius="9"
          color="#EB4022"
          ariaLabel="three-dots-loading"
          visible={true}
        />
      </Flex>
    );
  }

  if (status === 'unauthenticated') {
    return router.push('/login');
  }

  return (
    <main className={inter.className}>
      <VStack spacing={0} align="stretch">
        <Header />
        <Box mt={20} px={6}>
          {children}
        </Box>
      </VStack>
    </main>
  );
}

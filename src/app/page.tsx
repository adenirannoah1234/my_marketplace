'use client';

import { Flex, HStack, Text, Button } from '@chakra-ui/react';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { ThreeDots } from 'react-loader-spinner';
import { signOut, useSession } from 'next-auth/react';

export default function Home() {
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
  const { data: session, status } = useSession();

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login');
    } else if (status === 'authenticated') {
      setIsLoading(false);
    }
  }, [status, router]);

  if (isLoading) {
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
          wrapperStyle={{}}
          wrapperClass=""
          visible={true}
        />
      </Flex>
    );
  }

  return (
    <HStack>
      <Text>Welcome to BazaarX!</Text>
      <Text>Welcome to BazaarX!</Text>
      <Text>Welcome To BazaarX!</Text>
      <Text>Welcome To BazaarX!</Text>
      <Text>Welcome To BazaarX!</Text>
      <Text>Welcome To BazaarX!</Text>
      <Text>Welcome To BazaarX</Text>
      <Button onClick={() => signOut()}>Sign Out</Button>
    </HStack>
  );
}

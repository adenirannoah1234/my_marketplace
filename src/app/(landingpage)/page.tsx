'use client';

import { Flex, HStack, Text, Button, VStack } from '@chakra-ui/react';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { ThreeDots } from 'react-loader-spinner';
import { signOut, useSession } from 'next-auth/react';
import Header from './component/Navbar';

export default function Home() {
  return (
    <VStack>
      <Button onClick={() => signOut()}>Sign Out</Button>
    </VStack>
  );
}

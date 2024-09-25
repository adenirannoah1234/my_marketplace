'use client';

import React from 'react';
import { signOut } from 'next-auth/react';
import { Button } from '@chakra-ui/react';

const page = () => {
  return <Button onClick={() => signOut()}>Sign Out</Button>;
};

export default page;

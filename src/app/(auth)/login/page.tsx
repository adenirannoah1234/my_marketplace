'use client';

import React, { useState } from 'react';
import {
  FormControl,
  FormLabel,
  Input,
  Button,
  VStack,
  Box,
  Flex,
  Checkbox,
  Heading,
  useToast,
  Text,
} from '@chakra-ui/react';
import Link from 'next/link';
import { useLoginMutation } from '@/lib/features/auth/authApiSlice';
import { useDispatch } from 'react-redux';
import { setCredentials } from '@/lib/features/auth/authSlice';
import { useRouter } from 'next/navigation';

const LoginPage = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const router = useRouter();
  const dispatch = useDispatch();
  const toast = useToast();
  const [login, { isLoading }] = useLoginMutation();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.email || !formData.password) {
      toast({
        title: 'Please fill in all fields.',
        description: 'All fields are required.',
        status: 'error',
        duration: 5000,
        isClosable: true,
        position: 'top',
      });
      return;
    }

    try {
      const response = await login(formData).unwrap();
      console.log('Login response:', response); // For debugging

      if (response && typeof response === 'object' && 'token' in response) {
        const { token, user } = response;
        dispatch(setCredentials({ user, token }));
        toast({
          title: 'Login Successful',
          description: 'Welcome back!',
          status: 'success',
          duration: 3000,
          isClosable: true,
          position: 'top',
        });
        router.push('/');
      } else {
        throw new Error('Invalid response structure from API');
      }
    } catch (err: any) {
      console.error('Login Error:', err);
      let errorMessage = 'Failed to log in.';

      if (err.status === 'FETCH_ERROR') {
        errorMessage =
          'Network error. Please check your connection and try again.';
      } else if (err.status === 401) {
        errorMessage = 'Invalid email or password.';
      } else if (err.data?.message) {
        errorMessage = err.data.message;
      } else if (err instanceof Error) {
        errorMessage = err.message;
      }

      toast({
        title: 'Login Failed',
        description: errorMessage,
        status: 'error',
        duration: 5000,
        isClosable: true,
        position: 'top',
      });
    }
  };

  return (
    <VStack h={'100%'} justify={'center'} bg="#FFFFFF" minH="100vh">
      <Box w={['100%', '27.25rem']} p={'2rem'} h="33rem" bg="white">
        <VStack gap={'1.5rem'} justify={'center'} h="100%">
          <Heading as="h2" size="lg" textAlign="center" fontSize="20px">
            Sign in
          </Heading>
          <VStack as={'form'} w="100%" gap="1rem" onSubmit={handleSubmit}>
            <FormControl id="email" w="100%">
              <FormLabel w="100%" fontSize="14px" color="#121111">
                Email Address
              </FormLabel>
              <Input
                type="email"
                placeholder="Enter your Email Address"
                _focus={{ borderColor: '#EB4022' }}
                border={'1px solid #AFAFAF'}
                focusBorderColor="transparent"
                name="email"
                value={formData.email}
                onChange={handleChange}
                py="1.5rem"
                px="1rem"
                w="100%"
                sx={{
                  '::placeholder': {
                    fontSize: '14px',
                    color: '#a89f98',
                  },
                }}
              />
            </FormControl>

            <FormControl id="password">
              <FormLabel fontSize="14px" color="#121111">
                Password
              </FormLabel>
              <Input
                type="password"
                placeholder="Enter your password"
                _focus={{ borderColor: '#EB4022' }}
                border={'1px solid #AFAFAF'}
                focusBorderColor="transparent"
                name="password"
                value={formData.password}
                onChange={handleChange}
                py="1.5rem"
                px="1rem"
                w="100%"
                sx={{
                  '::placeholder': {
                    fontSize: '14px',
                    color: '#a89f98',
                  },
                }}
              />
            </FormControl>

            <Flex
              justify="space-between"
              alignItems="center"
              mt={3}
              w="100%"
              fontSize="12px"
              color="#544f4c"
            >
              <Checkbox colorScheme="orange" defaultChecked size="sm">
                Remember Me
              </Checkbox>
              <Link
                href="/forgot-password"
                style={{ textDecoration: 'underline', color: '#EB4022' }}
              >
                Forgotten Password
              </Link>
            </Flex>

            <Button
              bg="#EB4022"
              color="white"
              _hover={{ bg: '#EB4022' }}
              type="submit"
              mt={3}
              w="100%"
              py="1.5rem"
              isLoading={isLoading}
            >
              Sign in
            </Button>
          </VStack>
          <Text textAlign="center" w="100%" fontSize="12px">
            Don&apos;t have an account?{' '}
            <Link
              href="/signup"
              style={{ textDecoration: 'underline', color: '#EB4022' }}
            >
              Signup
            </Link>
          </Text>
        </VStack>
      </Box>
    </VStack>
  );
};

export default LoginPage;

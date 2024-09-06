'use client';

import React, { useState } from 'react';
import {
  FormControl,
  FormLabel,
  Input,
  Stack,
  VStack,
  Text,
  Button,
  Box,
  Icon,
  useToast,
  Heading,
} from '@chakra-ui/react';
import { useSignupMutation } from '@/lib/features/auth/authApiSlice';
import { useDispatch } from 'react-redux';
import { setCredentials } from '@/lib/features/auth/authSlice';
import Link from 'next/link';
import { FiEdit, FiUser } from 'react-icons/fi';
import Head from 'next/head';
import { useRouter } from 'next/navigation';
interface signUpData {
  name: string;
  email: string;
  password: string;
  address: string;
  phoneNumber: string;
  picture: File | null;
  isLoadingText: string;
}
const SignupPage = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    address: '',
    phoneNumber: '',
    picture: null as File | null,
  });
  const [signup, { isLoading, isError, error }] = useSignupMutation();
  const dispatch = useDispatch();
  const toast = useToast();
  const router = useRouter();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, files } = e.target;
    if (name === 'picture' && files && files[0]) {
      setFormData({
        ...formData,
        [name]: files[0],
      });
    } else {
      setFormData({
        ...formData,
        [name]: value,
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (
      !formData.name ||
      !formData.email ||
      !formData.password ||
      !formData.address ||
      !formData.phoneNumber
    ) {
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
    const { name, email, password, address, phoneNumber, picture } = formData;

    const formDataToSend = new FormData();
    formDataToSend.append('name', name);
    formDataToSend.append('email', email);
    formDataToSend.append('password', password);
    if (address) formDataToSend.append('address', address);
    if (phoneNumber) formDataToSend.append('phoneNumber', phoneNumber);
    if (picture) formDataToSend.append('picture', picture);

    try {
      const result = await signup(formDataToSend).unwrap();
      console.log('API Response:', result); // Debugging log

      // Check if the result has the expected structure
      if (result && typeof result === 'object') {
        let user, token;

        // Check if user and token are in the root of the result
        if ('user' in result && 'token' in result) {
          user = result.user;
          token = result.token;
        }
        // Check if they're nested in a 'data' property
        else if ('data' in result && typeof result.data === 'object') {
          if ('user' in result.data && 'token' in result.data) {
            user = result.data.user;
            token = result.data.token;
          }
        }

        if (user && token) {
          dispatch(setCredentials({ user, token }));

          toast({
            title: 'Sign up successful.',
            description: 'Welcome to BazaarX!',
            status: 'success',
            duration: 5000,
            isClosable: true,
            position: 'top',
          });
          router.push('/');
        } else {
          throw new Error('Invalid response structure from API');
        }
      } else {
        throw new Error('Invalid response from API');
      }
    } catch (err) {
      console.error('Signup Error:', err); // Debugging log
      let errorMessage = 'Failed to create user.';
      if (err instanceof Error) {
        errorMessage = err.message;
      } else if (typeof err === 'object' && err !== null && 'data' in err) {
        errorMessage = (err as any).data?.message || errorMessage;
      }
      toast({
        title: 'An error occurred.',
        description: errorMessage,
        status: 'error',
        duration: 5000,
        isClosable: true,
        position: 'top',
      });
    }
  };
  return (
    <VStack>
      <Heading as="h2" size="lg" textAlign="center" fontSize="20px">
        Sign up
      </Heading>
      <Stack
        as="form"
        onSubmit={handleSubmit}
        // mt={10}
        // border="3px solid #e2e8f0"
        // borderColor="red.500"
        borderRadius={10}
        p={10}
        spacing={2}
        h={['100%', '100%', '100%', '100%', '100%']}
      >
        <Box position="relative" w="100%">
          <Input
            type="file"
            name="picture"
            onChange={handleChange}
            accept="image/*"
            py="1rem"
            px="1rem"
            w="100%"
            opacity={0}
            zIndex={1}
            cursor="pointer"
          />
          <Box
            position="absolute"
            top="50%"
            left="50%"
            transform="translate(-50%, -50%)"
            bg="white"
            borderRadius="full"
            p={4}
          >
            <Icon as={FiEdit} color="#6e30b0" />
          </Box>
          <Box
            position="absolute"
            top="0"
            left="0"
            w="100%"
            h="100%"
            bg="gray.100"
            borderRadius={10}
            display="flex"
            alignItems="center"
            justifyContent="center"
            fontSize="4xl"
            color="#a89f98"
          >
            <Icon as={FiUser} />
          </Box>
        </Box>
        <FormControl>
          <FormLabel w="100%" fontSize="14px" color="#121111">
            Name
          </FormLabel>
          <Input
            type="text"
            placeholder="Enter your name"
            _focus={{ borderColor: 'green.500' }}
            border="1px solid lightgrey"
            focusBorderColor="transparent"
            name="name"
            value={formData.name}
            onChange={handleChange}
            py="1.5rem"
            px="1rem"
            w="100%"
            sx={{ '::placeholder': { fontSize: '14px', color: '#a89f98' } }}
          />
        </FormControl>
        <FormControl>
          <FormLabel w="100%" fontSize="14px">
            Email
          </FormLabel>
          <Input
            type="email"
            placeholder="Enter your email"
            _focus={{ borderColor: 'green.500' }}
            border="1px solid lightgrey"
            focusBorderColor="transparent"
            name="email"
            value={formData.email}
            onChange={handleChange}
            py="1.5rem"
            px="1rem"
            w="100%"
            sx={{ '::placeholder': { fontSize: '14px', color: '#a89f98' } }}
          />
        </FormControl>
        <FormControl>
          <FormLabel w="100%" fontSize="14px">
            Password
          </FormLabel>
          <Input
            type="password"
            placeholder="Enter your password"
            _focus={{ borderColor: 'green.500' }}
            border="1px solid lightgrey"
            focusBorderColor="transparent"
            name="password"
            value={formData.password}
            onChange={handleChange}
            py="1.5rem"
            px="1rem"
            w="100%"
            sx={{ '::placeholder': { fontSize: '14px', color: '#a89f98' } }}
          />
        </FormControl>
        <FormControl>
          <FormLabel w="100%" fontSize="14px">
            Address
          </FormLabel>
          <Input
            type="text"
            placeholder="Enter your address"
            _focus={{ borderColor: 'green.500' }}
            border="1px solid lightgrey"
            focusBorderColor="transparent"
            name="address"
            value={formData.address}
            onChange={handleChange}
            py="1.5rem"
            px="1rem"
            w="100%"
            sx={{ '::placeholder': { fontSize: '14px', color: '#a89f98' } }}
          />
        </FormControl>
        <FormControl>
          <FormLabel w="100%" fontSize="14px">
            Phone Number
          </FormLabel>
          <Input
            type="text"
            placeholder="Enter your phone number"
            _focus={{ borderColor: 'green.500' }}
            border="1px solid lightgrey"
            focusBorderColor="transparent"
            name="phoneNumber"
            value={formData.phoneNumber}
            onChange={handleChange}
            py="1.5rem"
            px="1rem"
            w="100%"
            sx={{ '::placeholder': { fontSize: '14px', color: '#a89f98' } }}
          />
        </FormControl>

        <Button
          type="submit"
          isLoading={isLoading}
          _hover={{
            bg: '#EB4022',
            color: 'white',
          }}
          color={'white'}
          bg="#EB4022"
          isDisabled={isLoading}
        >
          Sign Up
        </Button>
        <Text textAlign="center" w="100%" fontSize="12px" color="#544f4c">
          Already have an account?{' '}
          <Link
            onClick={() => router.push('/')}
            href={''}
            style={{ textDecoration: 'underline', color: '#EB4022' }}
          >
            Sign in here
          </Link>
        </Text>
      </Stack>
    </VStack>
  );
};

export default SignupPage;

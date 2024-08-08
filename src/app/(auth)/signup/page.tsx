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
  useToast,
} from '@chakra-ui/react';
import { useSignupMutation } from '@/lib/features/auth/authApiSlice';
import { useDispatch } from 'react-redux';
import { setCredentials } from '@/lib/features/auth/authSlice';

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
            title: 'User created successfully.',
            description: `Welcome, ${user || ''}!`,
            status: 'success',
            duration: 5000,
            isClosable: true,
            position: 'top',
          });
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
      <Stack as="form" onSubmit={handleSubmit}>
        <FormControl>
          <FormLabel w="100%" fontSize="14px">
            Name
          </FormLabel>
          <Input
            type="text"
            placeholder="Enter your name"
            _focus={{ borderColor: '#6e30b0' }}
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
            _focus={{ borderColor: '#6e30b0' }}
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
            _focus={{ borderColor: '#6e30b0' }}
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
            _focus={{ borderColor: '#6e30b0' }}
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
            _focus={{ borderColor: '#6e30b0' }}
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
        <FormControl>
          <FormLabel w="100%" fontSize="14px">
            Profile Picture
          </FormLabel>
          <Input
            type="file"
            name="picture"
            onChange={handleChange}
            accept="image/*"
            py="1rem"
            px="1rem"
            w="100%"
          />
        </FormControl>
        <Button type="submit" isLoading={isLoading} colorScheme="purple">
          Sign Up
        </Button>
        {isError && <Text color="red.500">{(error as any).data?.message}</Text>}
      </Stack>
    </VStack>
  );
};

export default SignupPage;

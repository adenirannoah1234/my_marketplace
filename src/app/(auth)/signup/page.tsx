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
import { useRouter } from 'next/navigation';

interface SignUpData {
  name: string;
  email: string;
  password: string;
  address: string;
  phoneNumber: string;
}

const FormInput = ({
  label,
  type,
  name,
  value,
  onChange,
  placeholder,
}: {
  label: string;
  type: string;
  name: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder: string;
}) => (
  <FormControl>
    <FormLabel w="100%" fontSize="14px">
      {label}
    </FormLabel>
    <Input
      type={type}
      placeholder={placeholder}
      _focus={{ borderColor: 'green.500' }}
      border="1px solid lightgrey"
      focusBorderColor="transparent"
      name={name}
      value={value}
      onChange={onChange}
      py="1.5rem"
      px="1rem"
      w="100%"
      sx={{ '::placeholder': { fontSize: '14px', color: '#a89f98' } }}
    />
  </FormControl>
);

const SignupPage = () => {
  const [formData, setFormData] = useState<SignUpData>({
    name: '',
    email: '',
    password: '',
    address: '',
    phoneNumber: '',
  });
  const [signup, { isLoading }] = useSignupMutation();
  const dispatch = useDispatch();
  const toast = useToast();
  const router = useRouter();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (Object.values(formData).some((field) => !field)) {
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

    const formDataToSend = new FormData();
    Object.entries(formData).forEach(([key, value]) => {
      formDataToSend.append(key, value);
    });

    try {
      const result = await signup(formDataToSend).unwrap();
      dispatch(setCredentials(result));

      toast({
        title: 'Sign up successful.',
        description: 'Welcome to BazaarX!',
        status: 'success',
        duration: 5000,
        isClosable: true,
        position: 'top',
      });
      router.push('/');
    } catch (err) {
      console.error('Signup Error:', err);
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
        <FormInput
          label="Name"
          type="text"
          name="name"
          value={formData.name}
          onChange={handleChange}
          placeholder="Enter your name"
        />
        <FormInput
          label="Email"
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          placeholder="Enter your email"
        />
        <FormInput
          label="Password"
          type="password"
          name="password"
          value={formData.password}
          onChange={handleChange}
          placeholder="Enter your password"
        />
        <FormInput
          label="Address"
          type="text"
          name="address"
          value={formData.address}
          onChange={handleChange}
          placeholder="Enter your address"
        />
        <FormInput
          label="Phone Number"
          type="text"
          name="phoneNumber"
          value={formData.phoneNumber}
          onChange={handleChange}
          placeholder="Enter your phone number"
        />
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
            href="/"
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

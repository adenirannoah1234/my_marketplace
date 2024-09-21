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
  Heading,
  Box,
} from '@chakra-ui/react';
import {
  useSignupMutation,
  useGoogleSignupMutation,
} from '@/lib/features/auth/authApiSlice';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

interface SignUpData {
  name: string;
  email: string;
  password: string;
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
      _focus={{ borderColor: '#EB4022' }}
      border={'1px solid #AFAFAF'}
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
  });
  const [signup, { isLoading }] = useSignupMutation();
  const [googleSignup, { isLoading: isGoogleLoading }] =
    useGoogleSignupMutation();
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

    try {
      await signup(formData).unwrap();
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
      handleError(err);
    }
  };

  const handleGoogleSignup = async () => {
    try {
      await googleSignup().unwrap();
      toast({
        title: 'Google Sign up successful.',
        description: 'Welcome to BazaarX!',
        status: 'success',
        duration: 5000,
        isClosable: true,
        position: 'top',
      });
      router.push('/');
    } catch (err) {
      handleError(err);
    }
  };

  const handleError = (err: any) => {
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
  };

  return (
    <VStack h={'100%'} justify={'center'} bg="#FFFFFF" minH="100vh">
      <Box w={['100%', '27.25rem']} p={'2rem'} h="33rem" bg="white">
        <VStack gap={'1.5rem'} justify={'center'} h="100%">
          <Heading as="h2" size="lg" textAlign="center" fontSize="20px">
            Sign up
          </Heading>

          <Stack
            as="form"
            onSubmit={handleSubmit}
            gap={'1rem'}
            borderRadius={10}
            w={['100%', '100%', '100%', '100%', '100%']}
            spacing={2}
            h={['100%', '100%', '100%', '100%', '100%']}
          >
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
            <Button
              onClick={handleGoogleSignup}
              isLoading={isGoogleLoading}
              _hover={{
                bg: '#4285F4',
                color: 'white',
              }}
              color={'white'}
              bg="#4285F4"
              isDisabled={isGoogleLoading}
            >
              Sign Up with Google
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
      </Box>
    </VStack>
  );
};

export default SignupPage;

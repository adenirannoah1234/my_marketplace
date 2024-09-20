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
import { useRouter } from 'next/navigation';
import { signIn, useSession } from 'next-auth/react';

type CustomInputProps = Pick<
  React.ComponentProps<typeof Input>,
  'id' | 'type' | 'placeholder' | 'name' | 'value' | 'onChange'
>;

const CustomInput = ({
  id,
  type,
  placeholder,
  name,
  value,
  onChange,
}: CustomInputProps) => (
  <FormControl id={id} w="100%">
    <FormLabel w="100%" fontSize="14px" color="#121111">
      {placeholder}
    </FormLabel>
    <Input
      type={type}
      placeholder={`Enter your ${placeholder}`}
      _focus={{ borderColor: '#EB4022' }}
      border={'1px solid #AFAFAF'}
      focusBorderColor="transparent"
      name={name}
      value={value}
      onChange={onChange}
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
);

type FormData = {
  email: string;
  password: string;
};

const LoginPage = () => {
  const [formData, setFormData] = useState<FormData>({
    email: '',
    password: '',
  });
  const router = useRouter();
  const toast = useToast();
  const { status } = useSession();
  const [isLoading, setIsLoading] = useState(false);

  if (status === 'authenticated') {
    router.push('/');
    return null;
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const result = await signIn('credentials', {
        redirect: false,
        email: formData.email,
        password: formData.password,
      });

      if (result?.error) {
        toast({
          title: 'Login Failed',
          description: result.error,
          status: 'error',
          duration: 5000,
          isClosable: true,
          position: 'top',
        });
      } else {
        router.push('/');
        toast({
          title: 'Login Successful',
          description: 'Welcome back!',
          status: 'success',
          duration: 3000,
          isClosable: true,
          position: 'top',
        });
      }
    } catch (error) {
      console.error('Login error:', error);
      toast({
        title: 'Login Failed',
        description: 'An unexpected error occurred. Please try again.',
        status: 'error',
        duration: 5000,
        isClosable: true,
        position: 'top',
      });
    } finally {
      setIsLoading(false);
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
            <CustomInput
              id="email"
              type="email"
              placeholder="Email Address"
              name="email"
              value={formData.email}
              onChange={handleChange}
            />
            <CustomInput
              id="password"
              type="password"
              placeholder="Password"
              name="password"
              value={formData.password}
              onChange={handleChange}
            />
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

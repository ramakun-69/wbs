import { useAuthContext } from '@/context/useAuthContext';
import httpClient from '@/helpers/httpClient';
import { yupResolver } from '@hookform/resolvers/yup';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate, useSearchParams } from 'react-router-dom';
import * as yup from 'yup';
const useSignIn = () => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const {
    saveSession
  } = useAuthContext();
  const [searchParams] = useSearchParams();
  const loginFormSchema = yup.object({
    email: yup.string().email('Please enter a valid email').required('Please enter your email'),
    password: yup.string().required('Please enter your password')
  });
  const {
    control,
    handleSubmit
  } = useForm({
    resolver: yupResolver(loginFormSchema),
    defaultValues: {
      email: 'user@demo.com',
      password: '123456'
    }
  });
  const redirectUser = () => {
    const redirectLink = searchParams.get('redirectTo');
    if (redirectLink) navigate(redirectLink);else navigate('/');
  };
  const login = handleSubmit(async values => {
    try {
      const res = await httpClient.post('/login', values);
      if (res.data.token) {
        saveSession({
          ...(res.data ?? {}),
          token: res.data.token
        });
        redirectUser();
      }
    } catch (e) {
      if (e.response?.data?.error) {}
    } finally {
      setLoading(false);
    }
  });
  return {
    loading,
    login,
    control
  };
};
export default useSignIn;
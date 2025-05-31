// src/api/auth.ts
import axios from 'axios';
import { BASE_URL } from '../config/api';

const API_URL = `${BASE_URL}/api/v1`;

export const registerUser = async (data: {
    email: string;
    name: string;
    is_active: boolean;
    password: string;
}) => {
    const response = await axios.post(`${API_URL}/auth/register`, data);
    return response.data;
};

export const loginUser = async (username: string, password: string) => {
  const params = new URLSearchParams();
  params.append('username', username);
  params.append('password', password);

  const response = await axios.post(`${API_URL}/auth/login/access-token`, params, {
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
  });

  const { access_token } = response.data;

  localStorage.setItem('access_token', access_token);

  return response.data;
};
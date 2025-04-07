import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:5000/api'
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const login = async (email: string, password: string) => {
  const response = await api.post('/auth/login', { email, password });
  return response.data;
};

export const createUser = async (userData: {
  email: string;
  password: string;
  role: 'admin' | 'teacher' | 'student';
  fullName: string;
}) => {
  const response = await api.post('/users', userData);
  return response.data;
};

export const getNotices = async () => {
  const response = await api.get('/notices');
  return response.data;
};

export const createNotice = async (noticeData: {
  title: string;
  content: string;
}) => {
  const response = await api.post('/notices', noticeData);
  return response.data;
};

export const deleteNotice = async (id: string) => {
  const response = await api.delete(`/notices/${id}`);
  return response.data;
};

export type User = {
  id: string;
  email: string;
  role: 'admin' | 'teacher' | 'student';
  fullName: string;
};

export type Notice = {
  _id: string;
  title: string;
  content: string;
  createdBy: {
    _id: string;
    fullName: string;
    role: string;
  };
  createdAt: string;
  updatedAt: string;
};
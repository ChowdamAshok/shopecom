import axiosInstance from './axios';

export const authApi = {
  register: (data) => axiosInstance.post('/api/auth/register', data),
  login: (data) => axiosInstance.post('/api/auth/login', data),
  refresh: (refreshToken) => axiosInstance.post('/api/auth/refresh', null, {
    headers: { 'Refresh-Token': refreshToken },
  }),
};
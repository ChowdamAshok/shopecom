import axiosInstance from './axios';

export const profileApi = {
  getProfile: () => axiosInstance.get('/api/users/profile'),
  updateProfile: (data) => axiosInstance.put('/api/users/profile', data),
  changePassword: (data) => axiosInstance.put('/api/users/password', data),
  getAddresses: () => axiosInstance.get('/api/users/addresses'),
  addAddress: (data) => axiosInstance.post('/api/users/addresses', data),
  updateAddress: (id, data) => axiosInstance.put(`/api/users/addresses/${id}`, data),
  deleteAddress: (id) => axiosInstance.delete(`/api/users/addresses/${id}`),
};
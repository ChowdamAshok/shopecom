import axiosInstance from './axios';

export const productApi = {
  getAll: (page = 0, size = 10, sortBy = 'createdAt', sortDir = 'desc') =>
    axiosInstance.get(`/api/products?page=${page}&size=${size}&sortBy=${sortBy}&sortDir=${sortDir}`),
  getById: (id) => axiosInstance.get(`/api/products/${id}`),
  getByCategory: (categoryId, page = 0, size = 10) =>
    axiosInstance.get(`/api/products/category/${categoryId}?page=${page}&size=${size}`),
  search: (keyword, page = 0, size = 10) =>
    axiosInstance.get(`/api/products/search?keyword=${keyword}&page=${page}&size=${size}`),
  create: (data) => axiosInstance.post('/api/products', data),
  update: (id, data) => axiosInstance.put(`/api/products/${id}`, data),
  delete: (id) => axiosInstance.delete(`/api/products/${id}`),
};
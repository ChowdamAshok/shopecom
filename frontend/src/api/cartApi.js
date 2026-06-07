import axiosInstance from './axios';

export const cartApi = {
  getCart: () => axiosInstance.get('/api/cart'),
  addToCart: (data) => axiosInstance.post('/api/cart', data),
  updateItem: (cartItemId, quantity) =>
    axiosInstance.put(`/api/cart/${cartItemId}?quantity=${quantity}`),
  removeItem: (cartItemId) => axiosInstance.delete(`/api/cart/${cartItemId}`),
  clearCart: () => axiosInstance.delete('/api/cart'),
};
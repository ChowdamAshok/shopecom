import axiosInstance from './axios';

export const orderApi = {
  placeOrder: (data) => axiosInstance.post('/api/orders', data),
  getMyOrders: (page = 0, size = 10) =>
    axiosInstance.get(`/api/orders?page=${page}&size=${size}`),
  getOrderById: (id) => axiosInstance.get(`/api/orders/${id}`),
  cancelOrder: (id) => axiosInstance.post(`/api/orders/${id}/cancel`),
};
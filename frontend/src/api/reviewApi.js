import axiosInstance from './axios';

export const reviewApi = {
  addReview: (data) => axiosInstance.post('/api/reviews', data),
  updateReview: (reviewId, data) => axiosInstance.put(`/api/reviews/${reviewId}`, data),
  getProductReviews: (productId) => axiosInstance.get(`/api/reviews/product/${productId}`),
  deleteReview: (reviewId) => axiosInstance.delete(`/api/reviews/${reviewId}`),
};
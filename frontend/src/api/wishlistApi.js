import axiosInstance from './axios';

export const wishlistApi = {
  getWishlist: () => axiosInstance.get('/api/wishlist'),
  addToWishlist: (productId) => axiosInstance.post(`/api/wishlist/${productId}`),
  removeFromWishlist: (productId) => axiosInstance.delete(`/api/wishlist/${productId}`),
  checkWishlist: (productId) => axiosInstance.get(`/api/wishlist/check/${productId}`),
};
package com.ecom.backend.service;

import com.ecom.backend.dto.request.CartRequest;
import com.ecom.backend.dto.response.CartResponse;

public interface CartService {
    CartResponse addToCart(Long userId, CartRequest request);
    CartResponse getCart(Long userId);
    CartResponse updateCartItem(Long userId, Long cartItemId, Integer quantity);
    void removeFromCart(Long userId, Long cartItemId);
    void clearCart(Long userId);
}
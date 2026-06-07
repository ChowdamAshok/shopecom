package com.ecom.backend.service;

import com.ecom.backend.dto.response.WishlistResponse;
import java.util.List;

public interface WishlistService {
    WishlistResponse addToWishlist(Long userId, Long productId);
    List<WishlistResponse> getWishlist(Long userId);
    void removeFromWishlist(Long userId, Long productId);
    boolean isInWishlist(Long userId, Long productId);
}
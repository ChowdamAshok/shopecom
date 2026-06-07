package com.ecom.backend.service.impl;

import com.ecom.backend.dto.response.WishlistResponse;
import com.ecom.backend.entity.Product;
import com.ecom.backend.entity.User;
import com.ecom.backend.entity.Wishlist;
import com.ecom.backend.exception.BadRequestException;
import com.ecom.backend.exception.ResourceNotFoundException;
import com.ecom.backend.repository.ProductRepository;
import com.ecom.backend.repository.UserRepository;
import com.ecom.backend.repository.WishlistRepository;
import com.ecom.backend.service.WishlistService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class WishlistServiceImpl implements WishlistService {

    private final WishlistRepository wishlistRepository;
    private final ProductRepository productRepository;
    private final UserRepository userRepository;

    @Override
    public WishlistResponse addToWishlist(Long userId, Long productId) {
        if (wishlistRepository.existsByUserIdAndProductId(userId, productId)) {
            throw new BadRequestException("Product already in wishlist");
        }

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new ResourceNotFoundException("Product not found"));

        Wishlist wishlist = Wishlist.builder()
                .user(user)
                .product(product)
                .build();

        return mapToResponse(wishlistRepository.save(wishlist));
    }

    @Override
    public List<WishlistResponse> getWishlist(Long userId) {
        return wishlistRepository.findAllByUserId(userId)
                .stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional
    public void removeFromWishlist(Long userId, Long productId) {
        if (!wishlistRepository.existsByUserIdAndProductId(userId, productId)) {
            throw new ResourceNotFoundException("Product not in wishlist");
        }
        wishlistRepository.deleteByUserIdAndProductId(userId, productId);
    }

    @Override
    public boolean isInWishlist(Long userId, Long productId) {
        return wishlistRepository.existsByUserIdAndProductId(userId, productId);
    }

    private WishlistResponse mapToResponse(Wishlist wishlist) {
        return WishlistResponse.builder()
                .id(wishlist.getId())
                .productId(wishlist.getProduct().getId())
                .productName(wishlist.getProduct().getName())
                .productImage(wishlist.getProduct().getImageUrl())
                .productPrice(wishlist.getProduct().getPrice())
                .categoryName(wishlist.getProduct().getCategory().getName())
                .createdAt(wishlist.getCreatedAt())
                .build();
    }
}
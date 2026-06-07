package com.ecom.backend.service.impl;

import com.ecom.backend.dto.request.CartRequest;
import com.ecom.backend.dto.response.CartItemResponse;
import com.ecom.backend.dto.response.CartResponse;
import com.ecom.backend.entity.CartItem;
import com.ecom.backend.entity.Product;
import com.ecom.backend.entity.User;
import com.ecom.backend.exception.BadRequestException;
import com.ecom.backend.exception.ResourceNotFoundException;
import com.ecom.backend.repository.CartItemRepository;
import com.ecom.backend.repository.ProductRepository;
import com.ecom.backend.repository.UserRepository;
import com.ecom.backend.service.CartService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class CartServiceImpl implements CartService {

    private final CartItemRepository cartItemRepository;
    private final ProductRepository productRepository;
    private final UserRepository userRepository;

    @Override
    @Transactional
    public CartResponse addToCart(Long userId, CartRequest request) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        Product product = productRepository.findById(request.getProductId())
                .orElseThrow(() -> new ResourceNotFoundException("Product not found"));

        if (product.getStock() < request.getQuantity()) {
            throw new BadRequestException("Insufficient stock available");
        }

        Optional<CartItem> existingItem = cartItemRepository
                .findByUserIdAndProductId(userId, request.getProductId());

        if (existingItem.isPresent()) {
            CartItem cartItem = existingItem.get();
            cartItem.setQuantity(cartItem.getQuantity() + request.getQuantity());
            cartItemRepository.save(cartItem);
        } else {
            CartItem cartItem = CartItem.builder()
                    .user(user)
                    .product(product)
                    .quantity(request.getQuantity())
                    .build();
            cartItemRepository.save(cartItem);
        }

        return getCart(userId);
    }

    @Override
    public CartResponse getCart(Long userId) {
        List<CartItem> cartItems = cartItemRepository.findAllByUserId(userId);
        List<CartItemResponse> itemResponses = cartItems.stream()
                .map(this::mapToItemResponse)
                .collect(Collectors.toList());

        BigDecimal totalAmount = itemResponses.stream()
                .map(CartItemResponse::getSubtotal)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        return CartResponse.builder()
                .items(itemResponses)
                .totalItems(itemResponses.size())
                .totalAmount(totalAmount)
                .build();
    }

    @Override
    @Transactional
    public CartResponse updateCartItem(Long userId, Long cartItemId, Integer quantity) {
        CartItem cartItem = cartItemRepository.findById(cartItemId)
                .orElseThrow(() -> new ResourceNotFoundException("Cart item not found"));

        if (!cartItem.getUser().getId().equals(userId)) {
            throw new BadRequestException("Unauthorized to update this cart item");
        }

        if (cartItem.getProduct().getStock() < quantity) {
            throw new BadRequestException("Insufficient stock available");
        }

        cartItem.setQuantity(quantity);
        cartItemRepository.save(cartItem);
        return getCart(userId);
    }

    @Override
    @Transactional
    public void removeFromCart(Long userId, Long cartItemId) {
        CartItem cartItem = cartItemRepository.findById(cartItemId)
                .orElseThrow(() -> new ResourceNotFoundException("Cart item not found"));

        if (!cartItem.getUser().getId().equals(userId)) {
            throw new BadRequestException("Unauthorized to remove this cart item");
        }

        cartItemRepository.delete(cartItem);
    }

    @Override
    @Transactional
    public void clearCart(Long userId) {
        cartItemRepository.deleteAllByUserId(userId);
    }

    private CartItemResponse mapToItemResponse(CartItem cartItem) {
        BigDecimal subtotal = cartItem.getProduct().getPrice()
                .multiply(BigDecimal.valueOf(cartItem.getQuantity()));

        return CartItemResponse.builder()
                .id(cartItem.getId())
                .productId(cartItem.getProduct().getId())
                .productName(cartItem.getProduct().getName())
                .productImage(cartItem.getProduct().getImageUrl())
                .productPrice(cartItem.getProduct().getPrice())
                .quantity(cartItem.getQuantity())
                .subtotal(subtotal)
                .build();
    }
}
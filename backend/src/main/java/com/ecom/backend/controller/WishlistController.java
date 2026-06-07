package com.ecom.backend.controller;

import com.ecom.backend.dto.response.ApiResponse;
import com.ecom.backend.dto.response.WishlistResponse;
import com.ecom.backend.entity.User;
import com.ecom.backend.repository.UserRepository;
import com.ecom.backend.service.WishlistService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/wishlist")
@RequiredArgsConstructor
public class WishlistController {

    private final WishlistService wishlistService;
    private final UserRepository userRepository;

    @GetMapping
    public ResponseEntity<ApiResponse<List<WishlistResponse>>> getWishlist(
            @AuthenticationPrincipal UserDetails userDetails) {
        User user = getUser(userDetails);
        return ResponseEntity.ok(ApiResponse.success("Wishlist fetched",
                wishlistService.getWishlist(user.getId())));
    }

    @PostMapping("/{productId}")
    public ResponseEntity<ApiResponse<WishlistResponse>> addToWishlist(
            @AuthenticationPrincipal UserDetails userDetails,
            @PathVariable Long productId) {
        User user = getUser(userDetails);
        return ResponseEntity.ok(ApiResponse.success("Added to wishlist",
                wishlistService.addToWishlist(user.getId(), productId)));
    }

    @DeleteMapping("/{productId}")
    public ResponseEntity<ApiResponse<Void>> removeFromWishlist(
            @AuthenticationPrincipal UserDetails userDetails,
            @PathVariable Long productId) {
        User user = getUser(userDetails);
        wishlistService.removeFromWishlist(user.getId(), productId);
        return ResponseEntity.ok(ApiResponse.success("Removed from wishlist"));
    }

    @GetMapping("/check/{productId}")
    public ResponseEntity<ApiResponse<Boolean>> checkWishlist(
            @AuthenticationPrincipal UserDetails userDetails,
            @PathVariable Long productId) {
        User user = getUser(userDetails);
        boolean result = wishlistService.isInWishlist(user.getId(), productId);
        return ResponseEntity.ok(ApiResponse.success("Checked", result));
    }

    private User getUser(UserDetails userDetails) {
        return userRepository.findByEmail(userDetails.getUsername())
                .orElseThrow(() -> new RuntimeException("User not found"));
    }
}
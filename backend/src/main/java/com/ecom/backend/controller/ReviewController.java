package com.ecom.backend.controller;

import com.ecom.backend.dto.request.ReviewRequest;
import com.ecom.backend.dto.response.ApiResponse;
import com.ecom.backend.dto.response.ProductRatingResponse;
import com.ecom.backend.dto.response.ReviewResponse;
import com.ecom.backend.entity.User;
import com.ecom.backend.repository.UserRepository;
import com.ecom.backend.service.ReviewService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/reviews")
@RequiredArgsConstructor
public class ReviewController {

    private final ReviewService reviewService;
    private final UserRepository userRepository;

    @PostMapping
    public ResponseEntity<ApiResponse<ReviewResponse>> addReview(
            @AuthenticationPrincipal UserDetails userDetails,
            @Valid @RequestBody ReviewRequest request) {
        User user = getUser(userDetails);
        ReviewResponse response = reviewService.addReview(user.getId(), request);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success("Review added successfully", response));
    }

    @PutMapping("/{reviewId}")
    public ResponseEntity<ApiResponse<ReviewResponse>> updateReview(
            @AuthenticationPrincipal UserDetails userDetails,
            @PathVariable Long reviewId,
            @Valid @RequestBody ReviewRequest request) {
        User user = getUser(userDetails);
        ReviewResponse response = reviewService.updateReview(user.getId(), reviewId, request);
        return ResponseEntity.ok(ApiResponse.success("Review updated successfully", response));
    }

    @GetMapping("/product/{productId}")
    public ResponseEntity<ApiResponse<ProductRatingResponse>> getProductReviews(
            @PathVariable Long productId) {
        ProductRatingResponse response = reviewService.getProductReviews(productId);
        return ResponseEntity.ok(ApiResponse.success("Reviews fetched successfully", response));
    }

    @DeleteMapping("/{reviewId}")
    public ResponseEntity<ApiResponse<Void>> deleteReview(
            @AuthenticationPrincipal UserDetails userDetails,
            @PathVariable Long reviewId) {
        User user = getUser(userDetails);
        reviewService.deleteReview(user.getId(), reviewId);
        return ResponseEntity.ok(ApiResponse.success("Review deleted successfully"));
    }

    private User getUser(UserDetails userDetails) {
        return userRepository.findByEmail(userDetails.getUsername())
                .orElseThrow(() -> new RuntimeException("User not found"));
    }
}
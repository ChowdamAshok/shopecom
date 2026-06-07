package com.ecom.backend.service;

import com.ecom.backend.dto.request.ReviewRequest;
import com.ecom.backend.dto.response.ProductRatingResponse;
import com.ecom.backend.dto.response.ReviewResponse;

public interface ReviewService {
    ReviewResponse addReview(Long userId, ReviewRequest request);
    ReviewResponse updateReview(Long userId, Long reviewId, ReviewRequest request);
    ProductRatingResponse getProductReviews(Long productId);
    void deleteReview(Long userId, Long reviewId);
}
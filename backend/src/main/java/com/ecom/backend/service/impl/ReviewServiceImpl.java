package com.ecom.backend.service.impl;

import com.ecom.backend.dto.request.ReviewRequest;
import com.ecom.backend.dto.response.ProductRatingResponse;
import com.ecom.backend.dto.response.ReviewResponse;
import com.ecom.backend.entity.Product;
import com.ecom.backend.entity.Review;
import com.ecom.backend.entity.User;
import com.ecom.backend.exception.BadRequestException;
import com.ecom.backend.exception.ResourceNotFoundException;
import com.ecom.backend.repository.ProductRepository;
import com.ecom.backend.repository.ReviewRepository;
import com.ecom.backend.repository.UserRepository;
import com.ecom.backend.service.ReviewService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ReviewServiceImpl implements ReviewService {

    private final ReviewRepository reviewRepository;
    private final ProductRepository productRepository;
    private final UserRepository userRepository;

    @Override
    public ReviewResponse addReview(Long userId, ReviewRequest request) {
        if (reviewRepository.existsByUserIdAndProductId(userId, request.getProductId())) {
            throw new BadRequestException("You have already reviewed this product");
        }

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        Product product = productRepository.findById(request.getProductId())
                .orElseThrow(() -> new ResourceNotFoundException("Product not found"));

        Review review = Review.builder()
                .user(user)
                .product(product)
                .rating(request.getRating())
                .comment(request.getComment())
                .active(true)
                .build();

        return mapToResponse(reviewRepository.save(review));
    }

    @Override
    public ReviewResponse updateReview(Long userId, Long reviewId, ReviewRequest request) {
        Review review = reviewRepository.findById(reviewId)
                .orElseThrow(() -> new ResourceNotFoundException("Review not found"));

        if (!review.getUser().getId().equals(userId)) {
            throw new BadRequestException("Unauthorized to update this review");
        }

        review.setRating(request.getRating());
        review.setComment(request.getComment());

        return mapToResponse(reviewRepository.save(review));
    }

    @Override
    public ProductRatingResponse getProductReviews(Long productId) {
        List<Review> reviews = reviewRepository.findAllByProductIdAndActiveTrue(productId);
        Double averageRating = reviewRepository.findAverageRatingByProductId(productId);
        Long totalReviews = reviewRepository.countByProductId(productId);

        List<ReviewResponse> reviewResponses = reviews.stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());

        return ProductRatingResponse.builder()
                .averageRating(averageRating != null ? Math.round(averageRating * 10.0) / 10.0 : 0.0)
                .totalReviews(totalReviews)
                .reviews(reviewResponses)
                .build();
    }

    @Override
    public void deleteReview(Long userId, Long reviewId) {
        Review review = reviewRepository.findById(reviewId)
                .orElseThrow(() -> new ResourceNotFoundException("Review not found"));

        if (!review.getUser().getId().equals(userId)) {
            throw new BadRequestException("Unauthorized to delete this review");
        }

        review.setActive(false);
        reviewRepository.save(review);
    }

    private ReviewResponse mapToResponse(Review review) {
        return ReviewResponse.builder()
                .id(review.getId())
                .rating(review.getRating())
                .comment(review.getComment())
                .userName(review.getUser().getName())
                .userId(review.getUser().getId())
                .productId(review.getProduct().getId())
                .createdAt(review.getCreatedAt())
                .build();
    }
}
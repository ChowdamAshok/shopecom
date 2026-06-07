package com.ecom.backend.dto.response;

import lombok.*;
import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ProductRatingResponse {
    private Double averageRating;
    private Long totalReviews;
    private List<ReviewResponse> reviews;
}
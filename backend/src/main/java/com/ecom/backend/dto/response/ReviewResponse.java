package com.ecom.backend.dto.response;

import lombok.*;
import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ReviewResponse {
    private Long id;
    private Integer rating;
    private String comment;
    private String userName;
    private Long userId;
    private Long productId;
    private LocalDateTime createdAt;
}
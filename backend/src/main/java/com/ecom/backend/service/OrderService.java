package com.ecom.backend.service;

import com.ecom.backend.dto.request.OrderRequest;
import com.ecom.backend.dto.response.OrderResponse;
import com.ecom.backend.dto.response.PageResponse;
import com.ecom.backend.enums.OrderStatus;

public interface OrderService {
    OrderResponse placeOrder(Long userId, OrderRequest request);
    OrderResponse getOrderById(Long orderId, Long userId);
    OrderResponse getOrderByNumber(String orderNumber);
    PageResponse<OrderResponse> getUserOrders(Long userId, int page, int size);
    OrderResponse updateOrderStatus(Long orderId, OrderStatus status);
    void cancelOrder(Long orderId, Long userId);
}
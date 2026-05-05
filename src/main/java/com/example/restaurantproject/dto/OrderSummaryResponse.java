package com.example.restaurantproject.dto;

import java.math.BigDecimal;
import java.time.Instant;
import java.util.List;

public record OrderSummaryResponse(
        Long orderId,
        Long userId,
        String customerName,
        String status,
        BigDecimal totalAmount,
        List<OrderItemResponse> items,
        Instant createdAt
) {
}

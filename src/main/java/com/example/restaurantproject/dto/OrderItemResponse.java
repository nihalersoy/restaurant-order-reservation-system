package com.example.restaurantproject.dto;

import java.math.BigDecimal;

public record OrderItemResponse(
        Long menuItemId,
        String menuItemName,
        int quantity,
        BigDecimal unitPrice,
        BigDecimal subtotal
) {
}

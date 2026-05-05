package com.example.restaurantproject.dto;

import java.math.BigDecimal;

public record MenuResponse(
        Long id,
        String name,
        String description,
        BigDecimal price,
        String category,
        boolean available
) {
}

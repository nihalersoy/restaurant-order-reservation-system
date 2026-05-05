package com.example.restaurantproject.dto;

import java.time.LocalDateTime;

public record TableAvailabilityResponse(
        int tableNumber,
        LocalDateTime reservationStart,
        LocalDateTime reservationEnd,
        boolean available
) {
}

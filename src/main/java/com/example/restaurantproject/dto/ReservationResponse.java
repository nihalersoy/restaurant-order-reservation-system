package com.example.restaurantproject.dto;

import java.time.LocalDateTime;

public record ReservationResponse(
        Long reservationId,
        Long userId,
        String customerName,
        int tableNumber,
        int partySize,
        LocalDateTime reservationStart,
        LocalDateTime reservationEnd,
        String status,
        String specialRequest
) {
}

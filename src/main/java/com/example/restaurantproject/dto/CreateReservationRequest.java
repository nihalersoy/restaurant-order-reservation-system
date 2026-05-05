package com.example.restaurantproject.dto;

import jakarta.validation.constraints.Future;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import java.time.LocalDateTime;

public record CreateReservationRequest(
        @Min(value = 1, message = "Table number must be at least 1")
        int tableNumber,

        @Min(value = 1, message = "Party size must be at least 1")
        @Max(value = 20, message = "Party size must be at most 20")
        int partySize,

        @NotNull(message = "Reservation time is required")
        @Future(message = "Reservation time must be in the future")
        LocalDateTime reservationTime,

        @Min(value = 30, message = "Duration must be at least 30 minutes")
        @Max(value = 240, message = "Duration must be at most 240 minutes")
        Integer durationMinutes,

        @Size(max = 500, message = "Special request must be at most 500 characters")
        String specialRequest
) {
}

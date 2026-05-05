package com.example.restaurantproject.controller;

import com.example.restaurantproject.dto.CreateReservationRequest;
import com.example.restaurantproject.dto.ReservationResponse;
import com.example.restaurantproject.dto.TableAvailabilityResponse;
import com.example.restaurantproject.service.ReservationService;
import jakarta.validation.Valid;
import java.security.Principal;
import java.time.LocalDateTime;
import lombok.RequiredArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/reservations")
@RequiredArgsConstructor
public class ReservationController {

    private final ReservationService reservationService;

    @PostMapping
    public ResponseEntity<ReservationResponse> createReservation(
            Principal principal,
            @Valid @RequestBody CreateReservationRequest request
    ) {
        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(reservationService.createReservation(principal.getName(), request));
    }

    @GetMapping("/availability")
    public ResponseEntity<TableAvailabilityResponse> checkTableAvailability(
            @RequestParam int tableNumber,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime reservationTime,
            @RequestParam(required = false) Integer durationMinutes
    ) {
        return ResponseEntity.ok(reservationService.checkTableAvailability(
                tableNumber,
                reservationTime,
                durationMinutes
        ));
    }
}

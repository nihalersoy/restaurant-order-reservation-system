package com.example.restaurantproject.service;

import com.example.restaurantproject.dto.CreateReservationRequest;
import com.example.restaurantproject.dto.ReservationResponse;
import com.example.restaurantproject.dto.TableAvailabilityResponse;
import com.example.restaurantproject.entity.Reservation;
import com.example.restaurantproject.entity.ReservationStatus;
import com.example.restaurantproject.entity.User;
import com.example.restaurantproject.exception.ConflictException;
import com.example.restaurantproject.exception.ResourceNotFoundException;
import com.example.restaurantproject.repository.ReservationRepository;
import com.example.restaurantproject.repository.UserRepository;
import java.time.LocalDateTime;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Isolation;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class ReservationService {

    private static final int DEFAULT_DURATION_MINUTES = 90;
    private static final List<ReservationStatus> BOOKED_STATUSES = List.of(ReservationStatus.CONFIRMED);

    private final ReservationRepository reservationRepository;
    private final UserRepository userRepository;

    @Transactional(isolation = Isolation.SERIALIZABLE)
    public ReservationResponse createReservation(String userEmail, CreateReservationRequest request) {
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new ResourceNotFoundException("Authenticated user was not found"));

        ReservationWindow reservationWindow = buildReservationWindow(
                request.reservationTime(),
                request.durationMinutes()
        );

        List<Reservation> overlappingReservations = reservationRepository.findOverlappingReservationsForUpdate(
                request.tableNumber(),
                reservationWindow.start(),
                reservationWindow.end(),
                BOOKED_STATUSES
        );

        if (!overlappingReservations.isEmpty()) {
            throw new ConflictException("Table is already booked for the selected time");
        }

        Reservation reservation = Reservation.builder()
                .user(user)
                .tableNumber(request.tableNumber())
                .partySize(request.partySize())
                .reservationStart(reservationWindow.start())
                .reservationEnd(reservationWindow.end())
                .status(ReservationStatus.CONFIRMED)
                .specialRequest(normalizeSpecialRequest(request.specialRequest()))
                .build();

        return toResponse(reservationRepository.save(reservation));
    }

    @Transactional(readOnly = true)
    public TableAvailabilityResponse checkTableAvailability(
            int tableNumber,
            LocalDateTime reservationTime,
            Integer durationMinutes
    ) {
        if (tableNumber < 1) {
            throw new IllegalArgumentException("Table number must be at least 1");
        }

        ReservationWindow reservationWindow = buildReservationWindow(reservationTime, durationMinutes);
        boolean booked = reservationRepository.existsOverlappingReservation(
                tableNumber,
                reservationWindow.start(),
                reservationWindow.end(),
                BOOKED_STATUSES
        );

        return new TableAvailabilityResponse(
                tableNumber,
                reservationWindow.start(),
                reservationWindow.end(),
                !booked
        );
    }

    private ReservationWindow buildReservationWindow(LocalDateTime reservationTime, Integer durationMinutes) {
        if (reservationTime == null) {
            throw new IllegalArgumentException("Reservation time is required");
        }

        if (!reservationTime.isAfter(LocalDateTime.now())) {
            throw new IllegalArgumentException("Reservation time must be in the future");
        }

        int normalizedDuration = durationMinutes == null ? DEFAULT_DURATION_MINUTES : durationMinutes;

        if (normalizedDuration < 30 || normalizedDuration > 240) {
            throw new IllegalArgumentException("Duration must be between 30 and 240 minutes");
        }

        return new ReservationWindow(
                reservationTime,
                reservationTime.plusMinutes(normalizedDuration)
        );
    }

    private String normalizeSpecialRequest(String specialRequest) {
        if (specialRequest == null || specialRequest.isBlank()) {
            return null;
        }

        return specialRequest.trim();
    }

    private ReservationResponse toResponse(Reservation reservation) {
        return new ReservationResponse(
                reservation.getId(),
                reservation.getUser().getId(),
                reservation.getUser().getFullName(),
                reservation.getTableNumber(),
                reservation.getPartySize(),
                reservation.getReservationStart(),
                reservation.getReservationEnd(),
                reservation.getStatus().name(),
                reservation.getSpecialRequest()
        );
    }

    private record ReservationWindow(LocalDateTime start, LocalDateTime end) {
    }
}

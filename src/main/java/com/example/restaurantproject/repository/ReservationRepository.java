package com.example.restaurantproject.repository;

import com.example.restaurantproject.entity.Reservation;
import com.example.restaurantproject.entity.ReservationStatus;
import jakarta.persistence.LockModeType;
import java.time.LocalDateTime;
import java.util.Collection;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Lock;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface ReservationRepository extends JpaRepository<Reservation, Long> {

    @Query("""
            select count(reservation) > 0
            from Reservation reservation
            where reservation.tableNumber = :tableNumber
              and reservation.status in :statuses
              and reservation.reservationStart < :reservationEnd
              and reservation.reservationEnd > :reservationStart
            """)
    boolean existsOverlappingReservation(
            @Param("tableNumber") int tableNumber,
            @Param("reservationStart") LocalDateTime reservationStart,
            @Param("reservationEnd") LocalDateTime reservationEnd,
            @Param("statuses") Collection<ReservationStatus> statuses
    );

    @Lock(LockModeType.PESSIMISTIC_WRITE)
    @Query("""
            select reservation
            from Reservation reservation
            where reservation.tableNumber = :tableNumber
              and reservation.status in :statuses
              and reservation.reservationStart < :reservationEnd
              and reservation.reservationEnd > :reservationStart
            """)
    List<Reservation> findOverlappingReservationsForUpdate(
            @Param("tableNumber") int tableNumber,
            @Param("reservationStart") LocalDateTime reservationStart,
            @Param("reservationEnd") LocalDateTime reservationEnd,
            @Param("statuses") Collection<ReservationStatus> statuses
    );
}

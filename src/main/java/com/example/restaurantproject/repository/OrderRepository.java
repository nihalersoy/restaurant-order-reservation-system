package com.example.restaurantproject.repository;

import com.example.restaurantproject.entity.Order;
import org.springframework.data.jpa.repository.JpaRepository;

public interface OrderRepository extends JpaRepository<Order, Long> {
}

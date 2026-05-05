package com.example.restaurantproject.controller;

import com.example.restaurantproject.dto.CreateOrderRequest;
import com.example.restaurantproject.dto.OrderSummaryResponse;
import com.example.restaurantproject.service.OrderService;
import jakarta.validation.Valid;
import java.security.Principal;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/orders")
@RequiredArgsConstructor
public class OrderController {

    private final OrderService orderService;

    @PostMapping
    public ResponseEntity<OrderSummaryResponse> createOrder(
            Principal principal,
            @Valid @RequestBody CreateOrderRequest request
    ) {
        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(orderService.createOrder(principal.getName(), request));
    }
}

package com.example.restaurantproject.controller;

import com.example.restaurantproject.dto.CreateMenuRequest;
import com.example.restaurantproject.dto.MenuResponse;
import com.example.restaurantproject.entity.MenuCategory;
import com.example.restaurantproject.service.MenuService;
import jakarta.validation.Valid;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/menus")
@RequiredArgsConstructor
public class MenuController {

    private final MenuService menuService;

    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<MenuResponse> createMenuItem(@Valid @RequestBody CreateMenuRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(menuService.createMenuItem(request));
    }

    @GetMapping
    public ResponseEntity<List<MenuResponse>> getMenuItems(
            @RequestParam(required = false) MenuCategory category
    ) {
        return ResponseEntity.ok(menuService.getMenuItems(category));
    }
}

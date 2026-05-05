package com.example.restaurantproject.service;

import com.example.restaurantproject.dto.CreateMenuRequest;
import com.example.restaurantproject.dto.MenuResponse;
import com.example.restaurantproject.entity.Menu;
import com.example.restaurantproject.entity.MenuCategory;
import com.example.restaurantproject.repository.MenuRepository;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class MenuService {

    private final MenuRepository menuRepository;

    @Transactional
    public MenuResponse createMenuItem(CreateMenuRequest request) {
        Menu menu = Menu.builder()
                .name(request.name().trim())
                .description(request.description().trim())
                .price(request.price())
                .category(request.category())
                .available(request.available() == null || request.available())
                .build();

        return toResponse(menuRepository.save(menu));
    }

    @Transactional(readOnly = true)
    public List<MenuResponse> getMenuItems(MenuCategory category) {
        List<Menu> menuItems = category == null
                ? menuRepository.findAll()
                : menuRepository.findByCategory(category);

        return menuItems.stream()
                .map(this::toResponse)
                .toList();
    }

    private MenuResponse toResponse(Menu menu) {
        return new MenuResponse(
                menu.getId(),
                menu.getName(),
                menu.getDescription(),
                menu.getPrice(),
                menu.getCategory().name(),
                menu.isAvailable()
        );
    }
}

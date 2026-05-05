package com.example.restaurantproject.service;

import com.example.restaurantproject.dto.CartItemRequest;
import com.example.restaurantproject.dto.CreateOrderRequest;
import com.example.restaurantproject.dto.OrderItemResponse;
import com.example.restaurantproject.dto.OrderSummaryResponse;
import com.example.restaurantproject.entity.Menu;
import com.example.restaurantproject.entity.Order;
import com.example.restaurantproject.entity.OrderItem;
import com.example.restaurantproject.entity.OrderStatus;
import com.example.restaurantproject.entity.User;
import com.example.restaurantproject.exception.ResourceNotFoundException;
import com.example.restaurantproject.repository.MenuRepository;
import com.example.restaurantproject.repository.OrderRepository;
import com.example.restaurantproject.repository.UserRepository;
import java.math.BigDecimal;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.function.Function;
import java.util.stream.Collectors;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class OrderService {

    private final OrderRepository orderRepository;
    private final UserRepository userRepository;
    private final MenuRepository menuRepository;

    @Transactional
    public OrderSummaryResponse createOrder(String userEmail, CreateOrderRequest request) {
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new ResourceNotFoundException("Authenticated user was not found"));

        Map<Long, Integer> cart = buildCart(request.items());
        Map<Long, Menu> menuItems = getMenuItems(cart);

        Order order = Order.builder()
                .user(user)
                .status(OrderStatus.PENDING)
                .totalAmount(BigDecimal.ZERO)
                .build();

        BigDecimal totalAmount = BigDecimal.ZERO;

        for (Map.Entry<Long, Integer> cartEntry : cart.entrySet()) {
            Menu menuItem = menuItems.get(cartEntry.getKey());

            if (!menuItem.isAvailable()) {
                throw new IllegalArgumentException("Menu item is not available: " + menuItem.getName());
            }

            int quantity = cartEntry.getValue();
            BigDecimal subtotal = menuItem.getPrice().multiply(BigDecimal.valueOf(quantity));

            OrderItem orderItem = OrderItem.builder()
                    .menuItem(menuItem)
                    .menuItemName(menuItem.getName())
                    .quantity(quantity)
                    .unitPrice(menuItem.getPrice())
                    .subtotal(subtotal)
                    .build();

            order.addItem(orderItem);
            totalAmount = totalAmount.add(subtotal);
        }

        order.setTotalAmount(totalAmount);
        return toSummary(orderRepository.save(order));
    }

    @Transactional(readOnly = true)
    public List<OrderSummaryResponse> getMyOrders(String userEmail) {
        return orderRepository.findByUserEmailOrderByCreatedAtDesc(userEmail)
                .stream()
                .map(this::toSummary)
                .toList();
    }

    private Map<Long, Integer> buildCart(List<CartItemRequest> items) {
        Map<Long, Integer> cart = new LinkedHashMap<>();

        for (CartItemRequest item : items) {
            cart.merge(item.menuItemId(), item.quantity(), Integer::sum);
        }

        return cart;
    }

    private Map<Long, Menu> getMenuItems(Map<Long, Integer> cart) {
        Map<Long, Menu> menuItems = menuRepository.findAllById(cart.keySet())
                .stream()
                .collect(Collectors.toMap(Menu::getId, Function.identity()));

        List<Long> missingIds = cart.keySet()
                .stream()
                .filter(menuItemId -> !menuItems.containsKey(menuItemId))
                .toList();

        if (!missingIds.isEmpty()) {
            throw new ResourceNotFoundException("Menu items not found: " + missingIds);
        }

        return menuItems;
    }

    private OrderSummaryResponse toSummary(Order order) {
        List<OrderItemResponse> items = order.getItems()
                .stream()
                .map(item -> new OrderItemResponse(
                        item.getMenuItem().getId(),
                        item.getMenuItemName(),
                        item.getQuantity(),
                        item.getUnitPrice(),
                        item.getSubtotal()
                ))
                .toList();

        return new OrderSummaryResponse(
                order.getId(),
                order.getUser().getId(),
                order.getUser().getFullName(),
                order.getStatus().name(),
                order.getTotalAmount(),
                items,
                order.getCreatedAt()
        );
    }
}

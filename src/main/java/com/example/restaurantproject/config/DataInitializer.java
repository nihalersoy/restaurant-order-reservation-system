package com.example.restaurantproject.config;

import com.example.restaurantproject.entity.Menu;
import com.example.restaurantproject.entity.MenuCategory;
import com.example.restaurantproject.repository.MenuRepository;
import java.math.BigDecimal;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class DataInitializer implements CommandLineRunner {

    private final MenuRepository menuRepository;

    @Override
    public void run(String... args) {
        if (menuRepository.count() > 0) {
            return;
        }

        List<Menu> sampleMenuItems = List.of(
                createMenuItem(
                        "Tomato Bruschetta",
                        "Toasted sourdough topped with marinated tomatoes, basil, and olive oil",
                        "6.50",
                        MenuCategory.APPETIZER
                ),
                createMenuItem(
                        "Crispy Calamari",
                        "Lightly fried calamari served with lemon aioli",
                        "8.95",
                        MenuCategory.APPETIZER
                ),
                createMenuItem(
                        "Margherita Pizza",
                        "Classic pizza with tomato sauce, mozzarella, and fresh basil",
                        "12.99",
                        MenuCategory.MAIN_COURSE
                ),
                createMenuItem(
                        "Grilled Chicken Alfredo",
                        "Fettuccine pasta with grilled chicken and creamy parmesan sauce",
                        "15.75",
                        MenuCategory.MAIN_COURSE
                ),
                createMenuItem(
                        "Beef Burger",
                        "Chargrilled beef patty with cheddar, lettuce, tomato, and house sauce",
                        "13.50",
                        MenuCategory.MAIN_COURSE
                ),
                createMenuItem(
                        "Garlic Fries",
                        "Crispy fries tossed with garlic, parsley, and sea salt",
                        "4.95",
                        MenuCategory.SIDE
                ),
                createMenuItem(
                        "Chocolate Lava Cake",
                        "Warm chocolate cake with a molten center and vanilla ice cream",
                        "7.25",
                        MenuCategory.DESSERT
                ),
                createMenuItem(
                        "Fresh Lemonade",
                        "House-made lemonade served chilled",
                        "3.50",
                        MenuCategory.DRINK
                )
        );

        menuRepository.saveAll(sampleMenuItems);
    }

    private Menu createMenuItem(
            String name,
            String description,
            String price,
            MenuCategory category
    ) {
        return Menu.builder()
                .name(name)
                .description(description)
                .price(new BigDecimal(price))
                .category(category)
                .available(true)
                .build();
    }
}

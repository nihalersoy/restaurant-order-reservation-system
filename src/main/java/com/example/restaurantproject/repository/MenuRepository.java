package com.example.restaurantproject.repository;

import com.example.restaurantproject.entity.Menu;
import com.example.restaurantproject.entity.MenuCategory;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;

public interface MenuRepository extends JpaRepository<Menu, Long> {

    List<Menu> findByCategory(MenuCategory category);
}

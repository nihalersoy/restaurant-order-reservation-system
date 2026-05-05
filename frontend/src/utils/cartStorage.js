const CART_KEY = 'restaurant_cart_items';

export function getCartItems() {
  const value = localStorage.getItem(CART_KEY);
  return value ? JSON.parse(value) : [];
}

export function saveCartItems(items) {
  localStorage.setItem(CART_KEY, JSON.stringify(items));
}

export function addCartItem(menuItem) {
  const items = getCartItems();
  const existingItem = items.find((item) => item.menuItemId === menuItem.id);

  if (existingItem) {
    existingItem.quantity += 1;
  } else {
    items.push({
      menuItemId: menuItem.id,
      name: menuItem.name,
      price: menuItem.price,
      quantity: 1,
    });
  }

  saveCartItems(items);
  return items;
}

export function updateCartItemQuantity(menuItemId, quantity) {
  const items = getCartItems()
    .map((item) =>
      item.menuItemId === menuItemId
        ? { ...item, quantity: Math.max(1, Number(quantity)) }
        : item
    )
    .filter((item) => item.quantity > 0);

  saveCartItems(items);
  return items;
}

export function removeCartItem(menuItemId) {
  const items = getCartItems().filter((item) => item.menuItemId !== menuItemId);
  saveCartItems(items);
  return items;
}

export function clearCart() {
  localStorage.removeItem(CART_KEY);
}

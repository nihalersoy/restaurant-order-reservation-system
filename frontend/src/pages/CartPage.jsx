import { PageHeader } from '../components/PageHeader.jsx';
import { useMemo, useState } from 'react';
import { orderApi } from '../services/api.js';
import {
  clearCart,
  getCartItems,
  removeCartItem,
  updateCartItemQuantity,
} from '../utils/cartStorage.js';

export function CartPage() {
  const [cartItems, setCartItems] = useState(getCartItems);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const total = useMemo(
    () =>
      cartItems.reduce(
        (sum, item) => sum + Number(item.price) * Number(item.quantity),
        0
      ),
    [cartItems]
  );

  function handleQuantityChange(menuItemId, quantity) {
    setCartItems(updateCartItemQuantity(menuItemId, quantity));
  }

  function handleRemove(menuItemId) {
    setCartItems(removeCartItem(menuItemId));
  }

  async function handleCreateOrder() {
    setIsLoading(true);
    setError('');
    setSuccess('');

    try {
      const payload = {
        items: cartItems.map((item) => ({
          menuItemId: item.menuItemId,
          quantity: item.quantity,
        })),
      };

      const response = await orderApi.create(payload);
      clearCart();
      setCartItems([]);
      setSuccess(`Order #${response.orderId} created successfully.`);
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <>
      <PageHeader
        title="Cart"
        description="Review selected menu items before creating an order."
      />
      <section className="panel">
        {error ? <p className="message error">{error}</p> : null}
        {success ? <p className="message success">{success}</p> : null}

        {cartItems.length === 0 ? (
          <p>Your cart is empty.</p>
        ) : (
          <>
            <div className="stack">
              {cartItems.map((item) => (
                <div className="cart-row" key={item.menuItemId}>
                  <div>
                    <strong>{item.name}</strong>
                    <p>GBP {Number(item.price).toFixed(2)}</p>
                  </div>
                  <input
                    type="number"
                    min="1"
                    value={item.quantity}
                    onChange={(event) =>
                      handleQuantityChange(item.menuItemId, event.target.value)
                    }
                  />
                  <button type="button" onClick={() => handleRemove(item.menuItemId)}>
                    Remove
                  </button>
                </div>
              ))}
            </div>

            <div className="summary-row">
              <strong>Total</strong>
              <strong>GBP {total.toFixed(2)}</strong>
            </div>

            <button
              className="primary-button"
              type="button"
              disabled={isLoading}
              onClick={handleCreateOrder}
            >
              {isLoading ? 'Creating order...' : 'Create order'}
            </button>
          </>
        )}
      </section>
    </>
  );
}

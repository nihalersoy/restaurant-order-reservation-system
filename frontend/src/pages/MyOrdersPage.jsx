import { PageHeader } from '../components/PageHeader.jsx';
import { useEffect, useState } from 'react';
import { orderApi } from '../services/api.js';

export function MyOrdersPage() {
  const [orders, setOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let isMounted = true;

    async function loadOrders() {
      setIsLoading(true);
      setError('');

      try {
        const response = await orderApi.getMyOrders();
        if (isMounted) {
          setOrders(response);
        }
      } catch (requestError) {
        if (isMounted) {
          setError(requestError.message);
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    }

    loadOrders();

    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <>
      <PageHeader
        title="My Orders"
        description="View your order history."
      />
      <section className="panel">
        {isLoading ? <p>Loading orders...</p> : null}
        {error ? <p className="message error">{error}</p> : null}
        {!isLoading && !error && orders.length === 0 ? <p>No orders found.</p> : null}
        <div className="stack">
          {orders.map((order) => (
            <article className="compact-card" key={order.orderId}>
              <strong>Order #{order.orderId}</strong>
              <span>{order.status}</span>
              <span>£{Number(order.totalAmount).toFixed(2)}</span>
            </article>
          ))}
        </div>
      </section>
    </>
  );
}

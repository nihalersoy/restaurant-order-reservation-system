import { PageHeader } from '../components/PageHeader.jsx';
import { useEffect, useState } from 'react';
import { reservationApi } from '../services/api.js';

export function MyReservationsPage() {
  const [reservations, setReservations] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let isMounted = true;

    async function loadReservations() {
      setIsLoading(true);
      setError('');

      try {
        const response = await reservationApi.getMyReservations();
        if (isMounted) {
          setReservations(response);
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

    loadReservations();

    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <>
      <PageHeader
        title="My Reservations"
        description="View upcoming and past reservations."
      />
      <section className="panel">
        {isLoading ? <p>Loading reservations...</p> : null}
        {error ? <p className="message error">{error}</p> : null}
        {!isLoading && !error && reservations.length === 0 ? (
          <p>No reservations found.</p>
        ) : null}
        <div className="stack">
          {reservations.map((reservation) => (
            <article className="compact-card" key={reservation.reservationId}>
              <strong>Reservation #{reservation.reservationId}</strong>
              <span>Table {reservation.tableNumber}</span>
              <span>{new Date(reservation.reservationStart).toLocaleString()}</span>
              <span>{reservation.status}</span>
            </article>
          ))}
        </div>
      </section>
    </>
  );
}

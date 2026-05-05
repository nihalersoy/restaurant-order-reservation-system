import { PageHeader } from '../components/PageHeader.jsx';

export function MyReservationsPage() {
  return (
    <>
      <PageHeader
        title="My Reservations"
        description="View upcoming and past reservations once the backend exposes this endpoint."
      />
      <section className="panel">
        <p>The backend does not currently provide a my-reservations endpoint.</p>
      </section>
    </>
  );
}

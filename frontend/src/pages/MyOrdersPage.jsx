import { PageHeader } from '../components/PageHeader.jsx';

export function MyOrdersPage() {
  return (
    <>
      <PageHeader
        title="My Orders"
        description="View your order history once the backend exposes this endpoint."
      />
      <section className="panel">
        <p>The backend does not currently provide a my-orders endpoint.</p>
      </section>
    </>
  );
}

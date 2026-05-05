import { PageHeader } from '../components/PageHeader.jsx';

export function MenuPage() {
  return (
    <>
      <PageHeader
        title="Menu"
        description="Browse restaurant dishes and add items to your cart."
      />
      <section className="panel">
        <p>Menu list will load from the backend in the next step.</p>
      </section>
    </>
  );
}

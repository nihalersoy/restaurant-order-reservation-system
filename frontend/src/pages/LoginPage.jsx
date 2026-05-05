import { PageHeader } from '../components/PageHeader.jsx';

export function LoginPage() {
  return (
    <>
      <PageHeader
        title="Login"
        description="Use your account to access orders, reservations, and protected actions."
      />
      <section className="panel">
        <p>Login form and JWT storage will be connected in the next step.</p>
      </section>
    </>
  );
}

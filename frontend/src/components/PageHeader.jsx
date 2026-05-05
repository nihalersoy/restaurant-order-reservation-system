export function PageHeader({ title, description }) {
  return (
    <section className="page-header">
      <h1>{title}</h1>
      {description ? <p>{description}</p> : null}
    </section>
  );
}

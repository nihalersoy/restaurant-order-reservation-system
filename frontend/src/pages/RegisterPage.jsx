import { PageHeader } from '../components/PageHeader.jsx';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { authApi } from '../services/api.js';
import { setAuthSession } from '../utils/authStorage.js';

export function RegisterPage() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    fullName: '',
    email: '',
    password: '',
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  function handleChange(event) {
    setForm((currentForm) => ({
      ...currentForm,
      [event.target.name]: event.target.value,
    }));
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const response = await authApi.register(form);
      setAuthSession(response);
      navigate('/menu');
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <>
      <PageHeader
        title="Create Account"
        description="Register as a customer to place orders and make reservations."
      />
      <section className="panel">
        <form className="form-grid" onSubmit={handleSubmit}>
          <label>
            Full name
            <input
              name="fullName"
              value={form.fullName}
              onChange={handleChange}
              placeholder="Nihal Ersoy"
            />
          </label>

          <label>
            Email
            <input
              name="email"
              type="email"
              value={form.email}
              onChange={handleChange}
              placeholder="nihal@example.com"
            />
          </label>

          <label>
            Password
            <input
              name="password"
              type="password"
              value={form.password}
              onChange={handleChange}
              placeholder="At least 8 characters"
            />
          </label>

          {error ? <p className="message error">{error}</p> : null}

          <button className="primary-button" type="submit" disabled={isLoading}>
            {isLoading ? 'Creating account...' : 'Register'}
          </button>
        </form>
      </section>
    </>
  );
}

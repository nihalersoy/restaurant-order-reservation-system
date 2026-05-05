import { PageHeader } from '../components/PageHeader.jsx';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { authApi } from '../services/api.js';
import { setAuthSession } from '../utils/authStorage.js';

export function LoginPage() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
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
      const response = await authApi.login(form);
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
        title="Login"
        description="Use your account to access orders, reservations, and protected actions."
      />
      <section className="panel">
        <form className="form-grid" onSubmit={handleSubmit}>
          <label>
            Email
            <input
              name="email"
              type="email"
              value={form.email}
              onChange={handleChange}
              placeholder="customer@example.com"
            />
          </label>

          <label>
            Password
            <input
              name="password"
              type="password"
              value={form.password}
              onChange={handleChange}
              placeholder="password123"
            />
          </label>

          {error ? <p className="message error">{error}</p> : null}

          <button className="primary-button" type="submit" disabled={isLoading}>
            {isLoading ? 'Logging in...' : 'Login'}
          </button>
        </form>
      </section>
    </>
  );
}

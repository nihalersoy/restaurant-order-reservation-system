import { PageHeader } from '../components/PageHeader.jsx';
import { useState } from 'react';
import { reservationApi } from '../services/api.js';

export function ReservationPage() {
  const [form, setForm] = useState({
    tableNumber: '5',
    partySize: '2',
    reservationTime: '',
    durationMinutes: '90',
    specialRequest: '',
  });
  const [availability, setAvailability] = useState(null);
  const [isChecking, setIsChecking] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  function handleChange(event) {
    setForm((currentForm) => ({
      ...currentForm,
      [event.target.name]: event.target.value,
    }));
  }

  async function handleCheckAvailability(event) {
    event.preventDefault();
    setIsChecking(true);
    setError('');
    setSuccess('');

    try {
      const response = await reservationApi.checkAvailability({
        tableNumber: form.tableNumber,
        reservationTime: form.reservationTime,
        durationMinutes: form.durationMinutes || 90,
      });
      setAvailability(response);
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setIsChecking(false);
    }
  }

  async function handleCreateReservation() {
    setIsCreating(true);
    setError('');
    setSuccess('');

    try {
      const response = await reservationApi.create({
        tableNumber: Number(form.tableNumber),
        partySize: Number(form.partySize),
        reservationTime: form.reservationTime,
        durationMinutes: Number(form.durationMinutes || 90),
        specialRequest: form.specialRequest,
      });
      setSuccess(`Reservation #${response.reservationId} created successfully.`);
      setAvailability(null);
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setIsCreating(false);
    }
  }

  return (
    <>
      <PageHeader
        title="Reserve a Table"
        description="Check availability and create a table reservation."
      />
      <section className="panel">
        <form className="form-grid" onSubmit={handleCheckAvailability}>
          <label>
            Table number
            <input
              name="tableNumber"
              type="number"
              min="1"
              value={form.tableNumber}
              onChange={handleChange}
            />
          </label>

          <label>
            Party size
            <input
              name="partySize"
              type="number"
              min="1"
              value={form.partySize}
              onChange={handleChange}
            />
          </label>

          <label>
            Reservation time
            <input
              name="reservationTime"
              type="datetime-local"
              value={form.reservationTime}
              onChange={handleChange}
            />
          </label>

          <label>
            Duration minutes
            <input
              name="durationMinutes"
              type="number"
              min="30"
              max="240"
              value={form.durationMinutes}
              onChange={handleChange}
            />
          </label>

          <label>
            Special request
            <textarea
              name="specialRequest"
              value={form.specialRequest}
              onChange={handleChange}
              rows="3"
            />
          </label>

          {error ? <p className="message error">{error}</p> : null}
          {success ? <p className="message success">{success}</p> : null}

          <button className="primary-button" type="submit" disabled={isChecking}>
            {isChecking ? 'Checking...' : 'Check availability'}
          </button>
        </form>

        {availability ? (
          <div className="availability-box">
            <p>
              Table {availability.tableNumber} is{' '}
              <strong>{availability.available ? 'available' : 'not available'}</strong>.
            </p>
            <button
              className="primary-button"
              type="button"
              disabled={!availability.available || isCreating}
              onClick={handleCreateReservation}
            >
              {isCreating ? 'Creating reservation...' : 'Create reservation'}
            </button>
          </div>
        ) : null}
      </section>
    </>
  );
}

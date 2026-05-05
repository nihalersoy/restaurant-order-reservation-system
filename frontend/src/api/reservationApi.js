import { apiRequest } from './apiClient.js';

export function createReservation(payload) {
  return apiRequest('/api/reservations', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
}

export function checkTableAvailability({ tableNumber, reservationTime, durationMinutes }) {
  const params = new URLSearchParams({
    tableNumber,
    reservationTime,
  });

  if (durationMinutes) {
    params.set('durationMinutes', durationMinutes);
  }

  return apiRequest(`/api/reservations/availability?${params.toString()}`);
}

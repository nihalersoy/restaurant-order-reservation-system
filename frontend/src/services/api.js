import { getToken } from '../utils/authStorage.js';

const API_BASE_URL = 'http://localhost:8080';

async function request(path, options = {}) {
  const headers = new Headers(options.headers || {});
  const token = getToken();

  if (options.body && !headers.has('Content-Type')) {
    headers.set('Content-Type', 'application/json');
  }

  if (token) {
    headers.set('Authorization', `Bearer ${token}`);
  }

  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...options,
    headers,
  });

  const contentType = response.headers.get('content-type') || '';
  const data = contentType.includes('application/json')
    ? await response.json()
    : null;

  if (!response.ok) {
    const message =
      data?.messages?.join(', ') ||
      data?.message ||
      data?.error ||
      `Request failed with status ${response.status}`;

    const error = new Error(message);
    error.status = response.status;
    error.details = data;
    throw error;
  }

  return data;
}

export const authApi = {
  register(payload) {
    return request('/api/auth/register', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  },

  login(payload) {
    return request('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  },
};

export const menuApi = {
  getAll() {
    return request('/api/menus');
  },

  getByCategory(category) {
    const query = category ? `?category=${encodeURIComponent(category)}` : '';
    return request(`/api/menus${query}`);
  },
};

export const orderApi = {
  create(payload) {
    return request('/api/orders', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  },

  getMyOrders() {
    return request('/api/orders/my');
  },
};

export const reservationApi = {
  checkAvailability({ tableNumber, reservationTime, durationMinutes = 90 }) {
    const params = new URLSearchParams({
      tableNumber,
      reservationTime,
      durationMinutes,
    });

    return request(`/api/reservations/availability?${params.toString()}`);
  },

  create(payload) {
    return request('/api/reservations', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  },

  getMyReservations() {
    return request('/api/reservations/my');
  },
};

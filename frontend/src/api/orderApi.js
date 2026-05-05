import { apiRequest } from './apiClient.js';

export function createOrder(payload) {
  return apiRequest('/api/orders', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
}

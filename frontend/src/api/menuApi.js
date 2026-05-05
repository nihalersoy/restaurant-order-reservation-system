import { apiRequest } from './apiClient.js';

export function getMenuItems(category) {
  const query = category ? `?category=${encodeURIComponent(category)}` : '';
  return apiRequest(`/api/menus${query}`);
}

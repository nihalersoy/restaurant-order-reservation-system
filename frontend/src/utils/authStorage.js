const TOKEN_KEY = 'restaurant_auth_token';
const USER_KEY = 'restaurant_auth_user';

export function getToken() {
  return localStorage.getItem(TOKEN_KEY);
}

export function setAuthSession(authResponse) {
  localStorage.setItem(TOKEN_KEY, authResponse.token);
  localStorage.setItem(
    USER_KEY,
    JSON.stringify({
      userId: authResponse.userId,
      fullName: authResponse.fullName,
      email: authResponse.email,
      role: authResponse.role,
    })
  );
}

export function getCurrentUser() {
  const user = localStorage.getItem(USER_KEY);
  return user ? JSON.parse(user) : null;
}

export function removeToken() {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(USER_KEY);
}

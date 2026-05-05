import { NavLink, Outlet } from 'react-router-dom';
import { getToken, removeToken } from '../utils/authStorage.js';

const navigationItems = [
  { to: '/menu', label: 'Menu' },
  { to: '/cart', label: 'Cart' },
  { to: '/reservations/new', label: 'Reserve' },
  { to: '/orders', label: 'My Orders' },
  { to: '/reservations', label: 'My Reservations' },
];

export function AppLayout() {
  const isLoggedIn = Boolean(getToken());

  function handleLogout() {
    removeToken();
    window.location.assign('/login');
  }

  return (
    <div className="app-shell">
      <header className="site-header">
        <NavLink to="/menu" className="brand">
          Richmond Restaurant
        </NavLink>

        <nav className="main-nav" aria-label="Primary navigation">
          {navigationItems.map((item) => (
            <NavLink key={item.to} to={item.to}>
              {item.label}
            </NavLink>
          ))}
        </nav>

        <div className="auth-actions">
          {isLoggedIn ? (
            <button className="link-button" type="button" onClick={handleLogout}>
              Logout
            </button>
          ) : (
            <>
              <NavLink to="/login">Login</NavLink>
              <NavLink className="button-link" to="/register">
                Register
              </NavLink>
            </>
          )}
        </div>
      </header>

      <main className="page-container">
        <Outlet />
      </main>
    </div>
  );
}

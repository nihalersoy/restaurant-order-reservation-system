import { Navigate, Route, Routes } from 'react-router-dom';
import { AppLayout } from '../layouts/AppLayout.jsx';
import { CartPage } from '../pages/CartPage.jsx';
import { LoginPage } from '../pages/LoginPage.jsx';
import { MenuPage } from '../pages/MenuPage.jsx';
import { MyOrdersPage } from '../pages/MyOrdersPage.jsx';
import { MyReservationsPage } from '../pages/MyReservationsPage.jsx';
import { RegisterPage } from '../pages/RegisterPage.jsx';
import { ReservationPage } from '../pages/ReservationPage.jsx';

export function AppRoutes() {
  return (
    <Routes>
      <Route element={<AppLayout />}>
        <Route index element={<Navigate to="/menu" replace />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/menu" element={<MenuPage />} />
        <Route path="/cart" element={<CartPage />} />
        <Route path="/reservations/new" element={<ReservationPage />} />
        <Route path="/orders" element={<MyOrdersPage />} />
        <Route path="/reservations" element={<MyReservationsPage />} />
        <Route path="*" element={<Navigate to="/menu" replace />} />
      </Route>
    </Routes>
  );
}

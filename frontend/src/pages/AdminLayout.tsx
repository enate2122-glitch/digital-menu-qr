import { Routes, Route, Link, useNavigate, useLocation } from 'react-router-dom';
import UsersPage from './UsersPage';
import RestaurantPage from './RestaurantPage';
import CategoriesPage from './CategoriesPage';
import ItemsPage from './ItemsPage';

function getRole(): string {
  return localStorage.getItem('role') ?? '';
}

export default function AdminLayout() {
  const role = getRole();
  const navigate = useNavigate();
  const location = useLocation();

  function handleLogout() {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    navigate('/login');
  }

  const navLinks =
    role === 'super_admin'
      ? [{ to: '/admin/users', label: 'Users' }]
      : [
          { to: '/admin/restaurant', label: 'Restaurant' },
          { to: '/admin/categories', label: 'Categories' },
          { to: '/admin/items', label: 'Menu Items' },
        ];

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      {/* Top nav */}
      <nav style={{
        background: '#1e293b',
        color: '#fff',
        display: 'flex',
        alignItems: 'center',
        padding: '0 24px',
        height: '56px',
        gap: '8px',
        flexShrink: 0,
      }}>
        <span style={{ fontWeight: 700, fontSize: '1rem', marginRight: '16px', color: '#f8fafc' }}>🍽️ Digital Menu</span>

        {navLinks.map(({ to, label }) => {
          const active = location.pathname.startsWith(to);
          return (
            <Link
              key={to}
              to={to}
              style={{
                padding: '6px 14px',
                borderRadius: '8px',
                fontSize: '0.875rem',
                fontWeight: 500,
                color: active ? '#fff' : '#94a3b8',
                background: active ? '#2563eb' : 'transparent',
                transition: 'all 0.15s',
              }}
            >
              {label}
            </Link>
          );
        })}

        <button
          onClick={handleLogout}
          style={{
            marginLeft: 'auto',
            background: 'transparent',
            color: '#94a3b8',
            border: '1px solid #334155',
            padding: '5px 14px',
            borderRadius: '8px',
            fontSize: '0.875rem',
            cursor: 'pointer',
          }}
        >
          Logout
        </button>
      </nav>

      {/* Page content */}
      <div style={{ flex: 1 }}>
        <Routes>
          <Route index element={
            <div className="page-content">
              <p style={{ color: '#6b7280' }}>Welcome — select a section from the nav above.</p>
            </div>
          } />
          {role === 'super_admin' && <Route path="users" element={<UsersPage />} />}
          {role === 'owner' && <Route path="restaurant" element={<RestaurantPage />} />}
          {role === 'owner' && <Route path="categories" element={<CategoriesPage />} />}
          {role === 'owner' && <Route path="items" element={<ItemsPage />} />}
        </Routes>
      </div>
    </div>
  );
}

import { Routes, Route, Link, useNavigate, useLocation } from 'react-router-dom';
import UsersPage from './UsersPage';
import RestaurantPage from './RestaurantPage';
import CategoriesPage from './CategoriesPage';
import ItemsPage from './ItemsPage';

function getRole() { return localStorage.getItem('role') ?? ''; }

export default function AdminLayout() {
  const role = getRole();
  const navigate = useNavigate();
  const { pathname } = useLocation();

  function logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    navigate('/login');
  }

  const navLinks = role === 'super_admin'
    ? [{ to: '/admin/users', label: '👥 Users' }]
    : [
        { to: '/admin/restaurant', label: '🏪 Restaurant' },
        { to: '/admin/categories', label: '🗂️ Categories' },
        { to: '/admin/items', label: '🍽️ Menu Items' },
      ];

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)', display: 'flex', flexDirection: 'column' }}>
      <nav style={n.bar}>
        <div style={n.inner}>
          <Link to="/" style={n.logo}>🍽️ <span style={{ color: 'var(--gold)' }}>Menu</span>QR</Link>
          <div style={n.divider} />
          <div style={n.links}>
            {navLinks.map(({ to, label }) => {
              const active = pathname.startsWith(to);
              return (
                <Link key={to} to={to} style={{ ...n.link, ...(active ? n.active : {}) }}>
                  {label}
                </Link>
              );
            })}
          </div>
          <button onClick={logout} className="btn-ghost" style={{ marginLeft: 'auto', padding: '7px 16px', fontSize: '0.8rem' }}>
            Logout
          </button>
        </div>
      </nav>

      <div style={{ flex: 1 }}>
        <Routes>
          <Route index element={
            <div className="page-content" style={{ textAlign: 'center', paddingTop: '80px' }}>
              <div style={{ fontSize: '3rem', marginBottom: '16px' }}>🍽️</div>
              <h2 style={{ color: 'var(--gold)', fontFamily: 'var(--font-ser)', marginBottom: '8px' }}>Welcome to MenuQR</h2>
              <p style={{ color: 'var(--muted)' }}>Select a section from the navigation above.</p>
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

const n: Record<string, React.CSSProperties> = {
  bar: { background: 'var(--bg2)', borderBottom: '1px solid var(--border)', padding: '0 24px', position: 'sticky', top: 0, zIndex: 100 },
  inner: { maxWidth: '1200px', margin: '0 auto', display: 'flex', alignItems: 'center', height: '60px', gap: '8px' },
  logo: { fontWeight: 800, fontSize: '1.1rem', color: 'var(--text)', flexShrink: 0 },
  divider: { width: '1px', height: '24px', background: 'var(--border)', margin: '0 8px', flexShrink: 0 },
  links: { display: 'flex', gap: '2px' },
  link: { padding: '6px 14px', borderRadius: '8px', fontSize: '0.875rem', color: 'var(--muted)', fontWeight: 500, transition: 'all 0.15s' },
  active: { color: 'var(--gold)', background: 'var(--gold-dim)' },
};

import { Routes, Route, Link, useNavigate, useLocation } from 'react-router-dom';
import { useEffect, useState } from 'react';
import UsersPage from './UsersPage';
import RestaurantPage from './RestaurantPage';
import CategoriesPage from './CategoriesPage';
import ItemsPage from './ItemsPage';
import SubscriptionsPage from './SubscriptionsPage';
import client from '../api/client';

function getRole() { return localStorage.getItem('role') ?? ''; }

export interface PlanLimits {
  maxRestaurants: number;
  maxCategories: number;
  maxItems: number;
  imageUploads: boolean;
  coverImage: boolean;
}

export interface SubInfo {
  plan: string;
  status: string;
}

export default function AdminLayout() {
  const role = getRole();
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const [subInfo, setSubInfo] = useState<SubInfo | null>(null);
  const [limits, setLimits] = useState<PlanLimits | null>(null);

  useEffect(() => {
    if (role !== 'owner') return;
    client.get<{ subscription: SubInfo | null; limits: PlanLimits | null }>('/subscriptions/me/limits')
      .then(res => { setSubInfo(res.data.subscription); setLimits(res.data.limits); })
      .catch(() => {});
  }, [role]);

  function logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    navigate('/login');
  }

  const navLinks = role === 'super_admin'
    ? [
        { to: '/admin/users', label: '👥 Users' },
        { to: '/admin/subscriptions', label: '💳 Subscriptions' },
      ]
    : [
        { to: '/admin/restaurant', label: '🏪 Restaurant' },
        { to: '/admin/categories', label: '🗂️ Categories' },
        { to: '/admin/items', label: '🍽️ Menu Items' },
      ];

  const planLabel: Record<string, string> = {
    professional: 'Professional', growing: 'Growing', enterprise: 'Enterprise',
  };

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
          {role === 'owner' && subInfo && (
            <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--gold)', background: 'var(--gold-dim)', padding: '4px 10px', borderRadius: '20px', marginLeft: '8px', flexShrink: 0 }}>
              {planLabel[subInfo.plan] ?? subInfo.plan}
            </span>
          )}
          <button onClick={logout} className="btn-ghost" style={{ marginLeft: 'auto', padding: '7px 16px', fontSize: '0.8rem' }}>
            Logout
          </button>
        </div>
      </nav>

      {/* No active subscription banner */}
      {role === 'owner' && !limits && subInfo === null && (
        <div style={{ background: '#1a1200', borderBottom: '1px solid #c9a84c44', padding: '10px 24px', textAlign: 'center', fontSize: '0.875rem', color: '#c9a84c' }}>
          You don't have an active subscription. <Link to="/pricing" style={{ color: 'var(--gold)', fontWeight: 700, textDecoration: 'underline' }}>Choose a plan →</Link>
        </div>
      )}

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
          {role === 'super_admin' && <Route path="subscriptions" element={<SubscriptionsPage />} />}
          {role === 'owner' && <Route path="restaurant" element={<RestaurantPage limits={limits} />} />}
          {role === 'owner' && <Route path="categories" element={<CategoriesPage limits={limits} />} />}
          {role === 'owner' && <Route path="items" element={<ItemsPage limits={limits} />} />}
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

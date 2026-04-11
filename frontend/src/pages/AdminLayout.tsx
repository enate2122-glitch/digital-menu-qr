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

const PLAN_COLORS: Record<string, string> = {
  professional: '#2563eb',
  growing: '#16a34a',
  enterprise: '#7c3aed',
};

const OWNER_LINKS = [
  { to: '/admin/restaurant', label: 'Restaurant',   icon: '🏪' },
  { to: '/admin/categories', label: 'Categories',   icon: '🗂️' },
  { to: '/admin/items',      label: 'Menu Items',   icon: '🍽️' },
];

const ADMIN_LINKS = [
  { to: '/admin/users',         label: 'Users',         icon: '👥' },
  { to: '/admin/subscriptions', label: 'Subscriptions', icon: '💳' },
];

export default function AdminLayout() {
  const role = getRole();
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const [subInfo, setSubInfo] = useState<SubInfo | null>(null);
  const [limits, setLimits] = useState<PlanLimits | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    if (role !== 'owner') return;
    client.get<{ subscription: SubInfo | null; limits: PlanLimits | null }>('/subscriptions/me/limits')
      .then(res => { setSubInfo(res.data.subscription); setLimits(res.data.limits); })
      .catch(() => {});
  }, [role]);

  // Close sidebar on route change (mobile)
  useEffect(() => { setSidebarOpen(false); }, [pathname]);

  function logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    navigate('/login');
  }

  const navLinks = role === 'super_admin' ? ADMIN_LINKS : OWNER_LINKS;
  const planLabel: Record<string, string> = {
    professional: 'Professional', growing: 'Growing', enterprise: 'Enterprise',
  };
  const planColor = subInfo ? (PLAN_COLORS[subInfo.plan] ?? 'var(--gold)') : 'var(--gold)';

  const Sidebar = () => (
    <aside style={{
      width: '240px', flexShrink: 0,
      background: 'var(--bg2)',
      borderRight: '1px solid var(--border)',
      display: 'flex', flexDirection: 'column',
      height: '100%',
    }}>
      {/* Logo */}
      <div style={{ padding: '24px 20px 20px', borderBottom: '1px solid var(--border)' }}>
        <Link to="/" style={{ fontWeight: 800, fontSize: '1.2rem', color: 'var(--text)', display: 'flex', alignItems: 'center', gap: '8px' }}>
          🍽️ <span style={{ color: 'var(--gold)' }}>Menu</span>QR
        </Link>
        <div style={{ fontSize: '0.7rem', color: 'var(--muted)', marginTop: '4px', letterSpacing: '0.06em' }}>
          {role === 'super_admin' ? 'SUPER ADMIN' : 'OWNER DASHBOARD'}
        </div>
      </div>

      {/* Plan badge (owner only) */}
      {role === 'owner' && (
        <div style={{ padding: '14px 20px', borderBottom: '1px solid var(--border)' }}>
          {subInfo ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: planColor, flexShrink: 0 }} />
              <div>
                <div style={{ fontSize: '0.72rem', color: 'var(--muted)', letterSpacing: '0.06em' }}>ACTIVE PLAN</div>
                <div style={{ fontSize: '0.85rem', fontWeight: 700, color: planColor }}>{planLabel[subInfo.plan] ?? subInfo.plan}</div>
              </div>
            </div>
          ) : (
            <Link to="/pricing" style={{ fontSize: '0.8rem', color: 'var(--gold)', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '6px' }}>
              ⚡ Upgrade Plan
            </Link>
          )}
        </div>
      )}

      {/* Nav links */}
      <nav style={{ flex: 1, padding: '12px 10px', display: 'flex', flexDirection: 'column', gap: '2px' }}>
        <div style={{ fontSize: '0.65rem', fontWeight: 700, color: 'var(--muted)', letterSpacing: '0.1em', padding: '6px 10px 4px' }}>
          NAVIGATION
        </div>
        {navLinks.map(({ to, label, icon }) => {
          const active = pathname.startsWith(to);
          return (
            <Link key={to} to={to} style={{
              display: 'flex', alignItems: 'center', gap: '10px',
              padding: '10px 12px', borderRadius: '10px',
              fontSize: '0.875rem', fontWeight: active ? 700 : 500,
              color: active ? 'var(--gold)' : 'var(--muted)',
              background: active ? 'var(--gold-dim)' : 'transparent',
              borderLeft: active ? '3px solid var(--gold)' : '3px solid transparent',
              transition: 'all 0.15s',
            }}>
              <span style={{ fontSize: '1rem', width: '20px', textAlign: 'center' }}>{icon}</span>
              {label}
            </Link>
          );
        })}
      </nav>

      {/* No subscription warning */}
      {role === 'owner' && !subInfo && (
        <div style={{ margin: '0 10px 12px', padding: '10px 12px', background: 'rgba(201,168,76,0.08)', border: '1px solid rgba(201,168,76,0.2)', borderRadius: '10px', fontSize: '0.78rem', color: 'var(--gold)', lineHeight: 1.5 }}>
          No active plan. <Link to="/pricing" style={{ color: 'var(--gold)', fontWeight: 700, textDecoration: 'underline' }}>Subscribe →</Link>
        </div>
      )}

      {/* Logout */}
      <div style={{ padding: '12px 10px', borderTop: '1px solid var(--border)' }}>
        <button onClick={logout} style={{
          width: '100%', display: 'flex', alignItems: 'center', gap: '10px',
          padding: '10px 12px', borderRadius: '10px',
          background: 'transparent', border: 'none', cursor: 'pointer',
          fontSize: '0.875rem', fontWeight: 500, color: 'var(--muted)',
          transition: 'all 0.15s',
        }}
          onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.background = 'rgba(224,82,82,0.08)'; (e.currentTarget as HTMLButtonElement).style.color = 'var(--danger)'; }}
          onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.background = 'transparent'; (e.currentTarget as HTMLButtonElement).style.color = 'var(--muted)'; }}
        >
          <span style={{ fontSize: '1rem', width: '20px', textAlign: 'center' }}>🚪</span>
          Log Out
        </button>
      </div>
    </aside>
  );

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)', display: 'flex' }}>
      <style>{`
        /* Desktop: always-visible sidebar */
        .admin-sidebar-desktop { display: flex; position: sticky; top: 0; height: 100vh; overflow-y: auto; }
        .admin-sidebar-mobile  { display: none; }
        .admin-topbar          { display: none; }
        .admin-main            { flex: 1; min-width: 0; overflow-x: hidden; }

        @media (max-width: 768px) {
          .admin-sidebar-desktop { display: none; }
          .admin-topbar {
            display: flex; align-items: center; gap: 12px;
            position: sticky; top: 0; z-index: 100;
            background: var(--bg2); border-bottom: 1px solid var(--border);
            padding: 0 16px; height: 56px;
          }
          .admin-sidebar-mobile {
            display: block;
            position: fixed; top: 0; left: 0; bottom: 0; width: 260px;
            z-index: 300; overflow-y: auto;
            transform: translateX(-100%);
            transition: transform 0.25s ease;
          }
          .admin-sidebar-mobile.open { transform: translateX(0); }
          .admin-overlay {
            display: none; position: fixed; inset: 0;
            background: rgba(0,0,0,0.5); z-index: 299;
          }
          .admin-overlay.open { display: block; }
        }
      `}</style>

      {/* Desktop sidebar */}
      <div className="admin-sidebar-desktop">
        <Sidebar />
      </div>

      {/* Mobile overlay */}
      <div className={`admin-overlay${sidebarOpen ? ' open' : ''}`} onClick={() => setSidebarOpen(false)} />

      {/* Mobile sidebar drawer */}
      <div className={`admin-sidebar-mobile${sidebarOpen ? ' open' : ''}`}>
        <Sidebar />
      </div>

      {/* Main content */}
      <div className="admin-main">
        {/* Mobile top bar */}
        <div className="admin-topbar">
          <button onClick={() => setSidebarOpen(true)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text)', fontSize: '1.3rem', padding: '4px', flexShrink: 0 }}>
            ☰
          </button>
          <Link to="/" style={{ fontWeight: 800, fontSize: '1rem', color: 'var(--text)', flex: 1, textAlign: 'center' }}>
            🍽️ <span style={{ color: 'var(--gold)' }}>Menu</span>QR
          </Link>
          {subInfo && (
            <span style={{ fontSize: '0.7rem', fontWeight: 700, color: planColor, background: `${planColor}18`, padding: '3px 8px', borderRadius: '20px', flexShrink: 0 }}>
              {planLabel[subInfo.plan] ?? subInfo.plan}
            </span>
          )}
        </div>

        {/* Page content */}
        <Routes>
          <Route index element={
            <div className="page-content" style={{ textAlign: 'center', paddingTop: '80px' }}>
              <div style={{ fontSize: '3rem', marginBottom: '16px' }}>🍽️</div>
              <h2 style={{ color: 'var(--gold)', fontFamily: 'var(--font-ser)', marginBottom: '8px' }}>Welcome to MenuQR</h2>
              <p style={{ color: 'var(--muted)' }}>Select a section from the sidebar.</p>
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

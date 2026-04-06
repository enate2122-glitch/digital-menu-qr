import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';

const links = [
  { to: '/', label: 'Home' },
  { to: '/features', label: 'Features' },
  { to: '/faq', label: 'FAQ' },
  { to: '/blog', label: 'Blog' },
  { to: '/contact', label: 'Contact' },
];

export default function LandingLayout({ children }: { children: React.ReactNode }) {
  const { pathname } = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <div style={{ fontFamily: 'var(--font-ui)', minHeight: '100vh', background: 'var(--bg)' }}>
      <style>{`
        .landing-nav-inner {
          max-width: 1100px;
          margin: 0 auto;
          display: flex;
          align-items: center;
          height: 64px;
          gap: 24px;
          padding: 0;
        }
        .landing-nav-links { display: flex; gap: 2px; flex: 1; }
        .landing-nav-actions { display: flex; gap: 8px; flex-shrink: 0; }
        .landing-hamburger { display: none; }

        .landing-mobile-menu {
          display: none;
          flex-direction: column;
          background: rgba(13,13,26,0.98);
          border-top: 1px solid var(--border);
          padding: 12px 16px 20px;
          gap: 4px;
        }
        .landing-mobile-menu.open { display: flex; }
        .landing-mobile-link {
          padding: 12px 14px;
          border-radius: 10px;
          font-size: 0.95rem;
          color: var(--muted);
          font-weight: 500;
          display: block;
        }
        .landing-mobile-link.active { color: var(--gold); background: var(--gold-dim); }
        .landing-mobile-actions {
          display: flex;
          gap: 8px;
          margin-top: 8px;
          padding-top: 12px;
          border-top: 1px solid var(--border);
        }
        .landing-mobile-actions a { flex: 1; text-align: center; }

        @media (max-width: 700px) {
          .landing-nav-links { display: none; }
          .landing-nav-actions { display: none; }
          .landing-hamburger {
            display: flex;
            margin-left: auto;
            background: none;
            border: 1.5px solid var(--border);
            border-radius: 8px;
            padding: 6px 10px;
            color: var(--text);
            font-size: 1.1rem;
            cursor: pointer;
            align-items: center;
            justify-content: center;
          }
        }

        /* HomePage showcase fix on mobile */
        @media (max-width: 640px) {
          .showcase-imgs-wrap {
            height: 220px !important;
          }
          .showcase-img-main {
            width: 100% !important;
            height: 100% !important;
            position: relative !important;
            top: auto !important; left: auto !important;
          }
          .showcase-img-sub { display: none !important; }

          /* Stats */
          .landing-stats { gap: 24px !important; padding: 28px 16px !important; }

          /* Section padding */
          .landing-section { padding: 48px 16px !important; }
          .landing-cta { padding: 72px 16px !important; }
        }
      `}</style>

      <nav style={{ position: 'sticky', top: 0, zIndex: 100, background: 'rgba(13,13,26,0.92)', backdropFilter: 'blur(12px)', borderBottom: '1px solid var(--border)', padding: '0 24px' }}>
        <div className="landing-nav-inner">
          <Link to="/" style={{ fontWeight: 800, fontSize: '1.2rem', color: 'var(--text)', textDecoration: 'none', flexShrink: 0 }}>
            🍽️ <span style={{ color: 'var(--gold)' }}>Menu</span>QR
          </Link>
          <div className="landing-nav-links">
            {links.map(l => (
              <Link key={l.to} to={l.to} style={{ padding: '6px 12px', borderRadius: '8px', fontSize: '0.875rem', color: pathname === l.to ? 'var(--gold)' : 'var(--muted)', textDecoration: 'none', fontWeight: 500, background: pathname === l.to ? 'var(--gold-dim)' : 'transparent' }}>
                {l.label}
              </Link>
            ))}
          </div>
          <div className="landing-nav-actions">
            <Link to="/login" className="btn-ghost" style={{ padding: '8px 18px', borderRadius: '10px', fontSize: '0.875rem' }}>Log In</Link>
            <Link to="/signup" className="btn-gold" style={{ padding: '8px 18px', borderRadius: '10px', fontSize: '0.875rem', fontWeight: 700 }}>Get Started</Link>
          </div>
          <button className="landing-hamburger" onClick={() => setMenuOpen(o => !o)} aria-label="Toggle menu">
            {menuOpen ? '✕' : '☰'}
          </button>
        </div>

        {/* Mobile dropdown */}
        <div className={`landing-mobile-menu${menuOpen ? ' open' : ''}`}>
          {links.map(l => (
            <Link key={l.to} to={l.to} className={`landing-mobile-link${pathname === l.to ? ' active' : ''}`} onClick={() => setMenuOpen(false)}>
              {l.label}
            </Link>
          ))}
          <div className="landing-mobile-actions">
            <Link to="/login" className="btn-ghost" style={{ padding: '10px', fontSize: '0.875rem', textAlign: 'center' }} onClick={() => setMenuOpen(false)}>Log In</Link>
            <Link to="/signup" className="btn-gold" style={{ padding: '10px', fontSize: '0.875rem', fontWeight: 700, textAlign: 'center' }} onClick={() => setMenuOpen(false)}>Get Started</Link>
          </div>
        </div>
      </nav>

      {children}

      <footer style={{ background: 'var(--bg2)', borderTop: '1px solid var(--border)', padding: '48px 24px', textAlign: 'center' }}>
        <div style={{ maxWidth: '600px', margin: '0 auto' }}>
          <div style={{ fontWeight: 800, fontSize: '1.3rem', color: 'var(--text)' }}>🍽️ <span style={{ color: 'var(--gold)' }}>Menu</span>QR</div>
          <p style={{ color: 'var(--muted)', fontSize: '0.875rem', marginTop: '8px' }}>Digital menus made simple for modern restaurants.</p>
          <div style={{ width: '40px', height: '1px', background: 'var(--gold)', margin: '16px auto' }} />
          <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap', justifyContent: 'center', marginBottom: '16px' }}>
            {links.map(l => <Link key={l.to} to={l.to} style={{ color: 'var(--muted)', textDecoration: 'none', fontSize: '0.875rem' }}>{l.label}</Link>)}
          </div>
          <p style={{ fontSize: '0.78rem', color: '#444' }}>© {new Date().getFullYear()} MenuQR. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}

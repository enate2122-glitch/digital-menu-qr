import { Link, useLocation } from 'react-router-dom';

export default function LandingLayout({ children }: { children: React.ReactNode }) {
  const { pathname } = useLocation();
  const links = [
    { to: '/', label: 'Home' },
    { to: '/features', label: 'Features' },
    { to: '/faq', label: 'FAQ' },
    { to: '/blog', label: 'Blog' },
    { to: '/contact', label: 'Contact' },
  ];

  return (
    <div style={{ fontFamily: 'var(--font-ui)', minHeight: '100vh', background: 'var(--bg)' }}>
      <nav style={n.bar}>
        <div style={n.inner}>
          <Link to="/" style={n.logo}>🍽️ <span style={{ color: 'var(--gold)' }}>Menu</span>QR</Link>
          <div style={n.links}>
            {links.map(l => (
              <Link key={l.to} to={l.to} style={{ ...n.link, ...(pathname === l.to ? n.active : {}) }}>
                {l.label}
              </Link>
            ))}
          </div>
          <div style={n.actions}>
            <Link to="/login" className="btn-ghost" style={{ padding: '8px 18px', borderRadius: '10px', fontSize: '0.875rem' }}>Log In</Link>
            <Link to="/signup" className="btn-gold" style={{ padding: '8px 18px', borderRadius: '10px', fontSize: '0.875rem', fontWeight: 700 }}>Get Started</Link>
          </div>
        </div>
      </nav>

      {children}

      <footer style={f.bar}>
        <div style={f.inner}>
          <div style={f.brand}>🍽️ <span style={{ color: 'var(--gold)' }}>Menu</span>QR</div>
          <p style={f.tagline}>Digital menus made simple for modern restaurants.</p>
          <div style={{ width: '40px', height: '1px', background: 'var(--gold)', margin: '16px auto' }} />
          <div style={f.links}>
            {links.map(l => <Link key={l.to} to={l.to} style={f.link}>{l.label}</Link>)}
          </div>
          <p style={f.copy}>© {new Date().getFullYear()} MenuQR. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}

const n: Record<string, React.CSSProperties> = {
  bar: { position: 'sticky', top: 0, zIndex: 100, background: 'rgba(13,13,26,0.92)', backdropFilter: 'blur(12px)', borderBottom: '1px solid var(--border)', padding: '0 24px' },
  inner: { maxWidth: '1100px', margin: '0 auto', display: 'flex', alignItems: 'center', height: '64px', gap: '24px' },
  logo: { fontWeight: 800, fontSize: '1.2rem', color: 'var(--text)', textDecoration: 'none', flexShrink: 0 },
  links: { display: 'flex', gap: '2px', flex: 1 },
  link: { padding: '6px 12px', borderRadius: '8px', fontSize: '0.875rem', color: 'var(--muted)', textDecoration: 'none', fontWeight: 500, transition: 'color 0.15s' },
  active: { color: 'var(--gold)', background: 'var(--gold-dim)' },
  actions: { display: 'flex', gap: '8px', flexShrink: 0 },
};

const f: Record<string, React.CSSProperties> = {
  bar: { background: 'var(--bg2)', borderTop: '1px solid var(--border)', padding: '48px 24px', textAlign: 'center' },
  inner: { maxWidth: '600px', margin: '0 auto' },
  brand: { fontWeight: 800, fontSize: '1.3rem', color: 'var(--text)' },
  tagline: { color: 'var(--muted)', fontSize: '0.875rem', marginTop: '8px' },
  links: { display: 'flex', gap: '20px', flexWrap: 'wrap' as const, justifyContent: 'center', marginBottom: '16px' },
  link: { color: 'var(--muted)', textDecoration: 'none', fontSize: '0.875rem', transition: 'color 0.15s' },
  copy: { fontSize: '0.78rem', color: '#444' },
};

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
    <div style={{ fontFamily: 'system-ui, sans-serif', minHeight: '100vh', background: '#fff' }}>
      {/* Nav */}
      <nav style={nav.bar}>
        <div style={nav.inner}>
          <Link to="/" style={nav.logo}>🍽️ MenuQR</Link>
          <div style={nav.links}>
            {links.map(l => (
              <Link key={l.to} to={l.to} style={{ ...nav.link, ...(pathname === l.to ? nav.active : {}) }}>
                {l.label}
              </Link>
            ))}
          </div>
          <div style={nav.actions}>
            <Link to="/login" style={nav.loginBtn}>Log In</Link>
            <Link to="/signup" style={nav.signupBtn}>Get Started</Link>
          </div>
        </div>
      </nav>

      {children}

      {/* Footer */}
      <footer style={foot.bar}>
        <div style={foot.inner}>
          <span style={foot.brand}>🍽️ MenuQR — Digital menus made simple.</span>
          <div style={foot.links}>
            {links.map(l => <Link key={l.to} to={l.to} style={foot.link}>{l.label}</Link>)}
          </div>
          <p style={foot.copy}>© {new Date().getFullYear()} MenuQR. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}

const nav: Record<string, React.CSSProperties> = {
  bar: { position: 'sticky', top: 0, zIndex: 100, background: 'rgba(255,255,255,0.95)', backdropFilter: 'blur(8px)', borderBottom: '1px solid #f0f0f0', padding: '0 24px' },
  inner: { maxWidth: '1100px', margin: '0 auto', display: 'flex', alignItems: 'center', height: '64px', gap: '32px' },
  logo: { fontWeight: 800, fontSize: '1.2rem', color: '#1e293b', textDecoration: 'none', flexShrink: 0 },
  links: { display: 'flex', gap: '4px', flex: 1 },
  link: { padding: '6px 12px', borderRadius: '8px', fontSize: '0.9rem', color: '#64748b', textDecoration: 'none', fontWeight: 500 },
  active: { color: '#2563eb', background: '#eff6ff' },
  actions: { display: 'flex', gap: '8px', flexShrink: 0 },
  loginBtn: { padding: '8px 16px', borderRadius: '8px', fontSize: '0.875rem', fontWeight: 600, color: '#374151', textDecoration: 'none', border: '1px solid #e5e7eb' },
  signupBtn: { padding: '8px 16px', borderRadius: '8px', fontSize: '0.875rem', fontWeight: 600, color: '#fff', background: '#2563eb', textDecoration: 'none' },
};

const foot: Record<string, React.CSSProperties> = {
  bar: { background: '#1e293b', color: '#94a3b8', padding: '40px 24px' },
  inner: { maxWidth: '1100px', margin: '0 auto', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '16px' },
  brand: { color: '#f1f5f9', fontWeight: 700, fontSize: '1rem' },
  links: { display: 'flex', gap: '16px', flexWrap: 'wrap' as const, justifyContent: 'center' },
  link: { color: '#94a3b8', textDecoration: 'none', fontSize: '0.875rem' },
  copy: { fontSize: '0.8rem', color: '#64748b', margin: 0 },
};

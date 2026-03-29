import LandingLayout from './LandingLayout';
import { Link } from 'react-router-dom';

const features = [
  { icon: '📱', title: 'Mobile-First Menus', desc: 'Stunning on any phone screen, from 320px to 1280px wide.' },
  { icon: '🎨', title: 'Custom Branding', desc: 'Set your logo, restaurant name, and brand color to match your identity.' },
  { icon: '⚡', title: 'Instant Updates', desc: 'Change prices, add items, or mark sold out — live immediately.' },
  { icon: '📷', title: 'QR Code Generator', desc: 'Download a print-ready PNG QR code linking to your digital menu.' },
  { icon: '🗂️', title: 'Category Management', desc: 'Organize into sections like Starters, Mains, Drinks, and Desserts.' },
  { icon: '🔒', title: 'Secure & Reliable', desc: 'JWT authentication, bcrypt passwords, and 99.9% uptime.' },
  { icon: '🌐', title: 'No App Required', desc: 'Customers scan and view — no download, no account, no friction.' },
  { icon: '📊', title: 'Multi-Restaurant', desc: 'Manage multiple restaurant profiles from a single owner account.' },
  { icon: '🛡️', title: 'Data Isolation', desc: "Each restaurant's data is fully isolated — no cross-tenant access." },
];

export default function FeaturesPage() {
  return (
    <LandingLayout>
      <section style={s.hero}>
        <div style={s.glow} />
        <p style={s.eyebrow}>FEATURES</p>
        <h1 style={s.title}>Everything You <span style={{ color: 'var(--gold)' }}>Need</span></h1>
        <div className="gold-divider" />
        <p style={s.sub}>A complete digital menu platform built for restaurants of all sizes.</p>
      </section>

      <section style={s.grid}>
        {features.map(f => (
          <div key={f.title} className="card" style={s.card}>
            <div style={s.icon}>{f.icon}</div>
            <h3 style={s.cardTitle}>{f.title}</h3>
            <p style={s.cardDesc}>{f.desc}</p>
          </div>
        ))}
      </section>

      <section style={s.cta}>
        <h2 style={s.ctaTitle}>Ready to get started?</h2>
        <Link to="/signup" className="btn-gold" style={{ padding: '13px 32px', fontSize: '0.95rem', borderRadius: '12px' }}>Create Free Account →</Link>
      </section>
    </LandingLayout>
  );
}

const s: Record<string, React.CSSProperties> = {
  hero: { position: 'relative', padding: '80px 24px 60px', textAlign: 'center' as const, overflow: 'hidden' },
  glow: { position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%,-50%)', width: '500px', height: '300px', background: 'radial-gradient(ellipse, rgba(201,168,76,0.07) 0%, transparent 70%)', pointerEvents: 'none' },
  eyebrow: { color: 'var(--gold)', fontSize: '0.75rem', fontWeight: 700, letterSpacing: '0.15em', marginBottom: '12px', position: 'relative' as const },
  title: { fontSize: 'clamp(1.8rem, 5vw, 2.8rem)', fontWeight: 900, color: 'var(--text)', margin: '0 0 20px', fontFamily: 'var(--font-ser)', position: 'relative' as const },
  sub: { color: 'var(--muted)', fontSize: '1rem', margin: '20px 0 0', position: 'relative' as const },
  grid: { padding: '48px 24px 64px', maxWidth: '1000px', margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '20px' },
  card: { transition: 'border-color 0.2s', cursor: 'default' },
  icon: { fontSize: '2rem', marginBottom: '14px' },
  cardTitle: { fontWeight: 700, fontSize: '1rem', color: 'var(--text)', margin: '0 0 8px' },
  cardDesc: { color: 'var(--muted)', fontSize: '0.875rem', lineHeight: 1.6, margin: 0 },
  cta: { borderTop: '1px solid var(--border)', padding: '64px 24px', textAlign: 'center' as const },
  ctaTitle: { color: 'var(--text)', fontSize: '1.8rem', fontWeight: 800, margin: '0 0 24px', fontFamily: 'var(--font-ser)' },
};

import LandingLayout from './LandingLayout';
import { Link } from 'react-router-dom';

const features = [
  { icon: '📱', title: 'Mobile-First Menus', desc: 'Your menu looks stunning on any phone screen, from 320px to 1280px wide.' },
  { icon: '🎨', title: 'Custom Branding', desc: 'Set your logo, restaurant name, and brand color to match your identity.' },
  { icon: '⚡', title: 'Instant Updates', desc: 'Change prices, add items, or mark items sold out — updates are live immediately.' },
  { icon: '📷', title: 'QR Code Generator', desc: 'Download a print-ready PNG QR code that links directly to your digital menu.' },
  { icon: '🗂️', title: 'Category Management', desc: 'Organize your menu into sections like Starters, Mains, Drinks, and Desserts.' },
  { icon: '🔒', title: 'Secure & Reliable', desc: 'JWT authentication, bcrypt passwords, and a 99.9% uptime SLA.' },
  { icon: '🌐', title: 'No App Required', desc: 'Customers scan and view — no app download, no account, no friction.' },
  { icon: '📊', title: 'Multi-Restaurant', desc: 'Manage multiple restaurant profiles from a single owner account.' },
  { icon: '🛡️', title: 'Data Isolation', desc: 'Each restaurant\'s data is fully isolated — no cross-tenant access.' },
];

export default function FeaturesPage() {
  return (
    <LandingLayout>
      <section style={s.hero}>
        <h1 style={s.title}>Everything You Need</h1>
        <p style={s.sub}>A complete digital menu platform built for restaurants of all sizes.</p>
      </section>

      <section style={s.grid}>
        <div style={s.gridInner}>
          {features.map(f => (
            <div key={f.title} style={s.card}>
              <div style={s.icon}>{f.icon}</div>
              <h3 style={s.cardTitle}>{f.title}</h3>
              <p style={s.cardDesc}>{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      <section style={s.cta}>
        <h2 style={s.ctaTitle}>Ready to get started?</h2>
        <Link to="/signup" style={s.btn}>Create Free Account →</Link>
      </section>
    </LandingLayout>
  );
}

const s: Record<string, React.CSSProperties> = {
  hero: { background: 'linear-gradient(135deg, #f0f7ff, #fafafa)', padding: '80px 24px', textAlign: 'center' as const },
  title: { fontSize: 'clamp(1.8rem, 5vw, 2.8rem)', fontWeight: 900, color: '#0f172a', margin: '0 0 16px' },
  sub: { color: '#64748b', fontSize: '1.1rem', margin: 0 },
  grid: { padding: '64px 24px', background: '#fff' },
  gridInner: { maxWidth: '1000px', margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '24px' },
  card: { background: '#f8fafc', borderRadius: '16px', padding: '28px 24px', border: '1px solid #f1f5f9' },
  icon: { fontSize: '2rem', marginBottom: '12px' },
  cardTitle: { fontWeight: 700, fontSize: '1rem', color: '#1e293b', margin: '0 0 8px' },
  cardDesc: { color: '#64748b', fontSize: '0.875rem', lineHeight: 1.6, margin: 0 },
  cta: { background: '#1e293b', padding: '64px 24px', textAlign: 'center' as const },
  ctaTitle: { color: '#fff', fontSize: '1.8rem', fontWeight: 800, margin: '0 0 24px' },
  btn: { padding: '14px 32px', background: '#2563eb', color: '#fff', borderRadius: '10px', fontWeight: 700, textDecoration: 'none', fontSize: '1rem' },
};

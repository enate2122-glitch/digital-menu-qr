import { Link } from 'react-router-dom';
import LandingLayout from './LandingLayout';

export default function HomePage() {
  return (
    <LandingLayout>
      {/* Hero */}
      <section style={s.hero}>
        <div style={s.heroInner}>
          <div style={s.badge}>✨ No app required for customers</div>
          <h1 style={s.heroTitle}>
            Digital Menus for<br />
            <span style={{ color: '#2563eb' }}>Modern Restaurants</span>
          </h1>
          <p style={s.heroSub}>
            Create a beautiful digital menu, generate a QR code, and let customers browse your menu instantly from their phone. No printing, no hassle.
          </p>
          <div style={s.heroBtns}>
            <Link to="/signup" style={s.btnPrimary}>Start for Free →</Link>
            <Link to="/features" style={s.btnOutline}>See Features</Link>
          </div>
          <p style={s.heroNote}>Free to start · No credit card required</p>
        </div>

        {/* Mock phone */}
        <div style={s.mockWrap}>
          <div style={s.phone}>
            <div style={s.phoneScreen}>
              <div style={{ background: '#2563eb', padding: '16px', borderRadius: '12px 12px 0 0' }}>
                <div style={{ width: '40px', height: '40px', background: 'rgba(255,255,255,0.3)', borderRadius: '8px', marginBottom: '8px' }} />
                <div style={{ color: '#fff', fontWeight: 700, fontSize: '1rem' }}>The Golden Fork</div>
                <div style={{ color: 'rgba(255,255,255,0.7)', fontSize: '0.75rem' }}>📍 123 Main Street</div>
              </div>
              <div style={{ padding: '12px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {['Starters', 'Mains', 'Desserts', 'Drinks'].map(cat => (
                  <div key={cat} style={{ background: '#f8fafc', borderRadius: '8px', padding: '10px 12px' }}>
                    <div style={{ fontWeight: 600, fontSize: '0.8rem', color: '#1e293b' }}>{cat}</div>
                    <div style={{ display: 'flex', gap: '6px', marginTop: '6px' }}>
                      {[1, 2].map(i => (
                        <div key={i} style={{ flex: 1, background: '#e2e8f0', borderRadius: '6px', height: '48px' }} />
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section style={s.stats}>
        {[
          { n: '500+', l: 'Restaurants' },
          { n: '50K+', l: 'Menu Scans' },
          { n: '99.9%', l: 'Uptime' },
          { n: '< 1s', l: 'Load Time' },
        ].map(({ n, l }) => (
          <div key={l} style={s.stat}>
            <div style={s.statNum}>{n}</div>
            <div style={s.statLabel}>{l}</div>
          </div>
        ))}
      </section>

      {/* How it works */}
      <section style={s.section}>
        <div style={s.sectionInner}>
          <h2 style={s.sectionTitle}>How It Works</h2>
          <p style={s.sectionSub}>Get your digital menu live in minutes</p>
          <div style={s.steps}>
            {[
              { n: '1', icon: '📝', title: 'Create Account', desc: 'Sign up free and set up your restaurant profile with logo and brand color.' },
              { n: '2', icon: '🍕', title: 'Build Your Menu', desc: 'Add categories and menu items with names, descriptions, prices and photos.' },
              { n: '3', icon: '📱', title: 'Download QR Code', desc: 'Get your unique QR code PNG and print it for your tables.' },
              { n: '4', icon: '✅', title: 'Customers Scan', desc: 'Customers scan and instantly see your full menu — no app needed.' },
            ].map(step => (
              <div key={step.n} style={s.step}>
                <div style={s.stepIcon}>{step.icon}</div>
                <h3 style={s.stepTitle}>{step.title}</h3>
                <p style={s.stepDesc}>{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section style={s.cta}>
        <h2 style={s.ctaTitle}>Ready to go digital?</h2>
        <p style={s.ctaSub}>Join hundreds of restaurants already using MenuQR.</p>
        <Link to="/signup" style={s.btnWhite}>Create Your Free Account →</Link>
      </section>
    </LandingLayout>
  );
}

const s: Record<string, React.CSSProperties> = {
  hero: { background: 'linear-gradient(135deg, #f0f7ff 0%, #fafafa 100%)', padding: '80px 24px', display: 'flex', justifyContent: 'center', gap: '60px', flexWrap: 'wrap' as const, alignItems: 'center' },
  heroInner: { maxWidth: '520px' },
  badge: { display: 'inline-block', background: '#eff6ff', color: '#2563eb', padding: '4px 12px', borderRadius: '20px', fontSize: '0.8rem', fontWeight: 600, marginBottom: '20px' },
  heroTitle: { fontSize: 'clamp(2rem, 5vw, 3rem)', fontWeight: 900, color: '#0f172a', lineHeight: 1.15, margin: '0 0 20px' },
  heroSub: { fontSize: '1.1rem', color: '#475569', lineHeight: 1.7, margin: '0 0 32px' },
  heroBtns: { display: 'flex', gap: '12px', flexWrap: 'wrap' as const },
  btnPrimary: { padding: '14px 28px', background: '#2563eb', color: '#fff', borderRadius: '10px', fontWeight: 700, textDecoration: 'none', fontSize: '1rem' },
  btnOutline: { padding: '14px 28px', border: '2px solid #e2e8f0', color: '#374151', borderRadius: '10px', fontWeight: 700, textDecoration: 'none', fontSize: '1rem' },
  heroNote: { margin: '16px 0 0', fontSize: '0.8rem', color: '#94a3b8' },

  mockWrap: { display: 'flex', justifyContent: 'center' },
  phone: { width: '220px', background: '#1e293b', borderRadius: '32px', padding: '12px', boxShadow: '0 24px 60px rgba(0,0,0,0.2)' },
  phoneScreen: { background: '#fff', borderRadius: '22px', overflow: 'hidden', minHeight: '380px' },

  stats: { background: '#1e293b', padding: '40px 24px', display: 'flex', justifyContent: 'center', gap: '48px', flexWrap: 'wrap' as const },
  stat: { textAlign: 'center' as const },
  statNum: { fontSize: '2rem', fontWeight: 900, color: '#fff' },
  statLabel: { fontSize: '0.875rem', color: '#94a3b8', marginTop: '4px' },

  section: { padding: '80px 24px', background: '#fff' },
  sectionInner: { maxWidth: '1000px', margin: '0 auto', textAlign: 'center' as const },
  sectionTitle: { fontSize: 'clamp(1.5rem, 4vw, 2.2rem)', fontWeight: 800, color: '#0f172a', margin: '0 0 12px' },
  sectionSub: { color: '#64748b', fontSize: '1rem', margin: '0 0 48px' },
  steps: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '32px', textAlign: 'left' as const },
  step: { background: '#f8fafc', borderRadius: '16px', padding: '28px 24px' },
  stepIcon: { fontSize: '2rem', marginBottom: '12px' },
  stepTitle: { fontWeight: 700, fontSize: '1rem', color: '#1e293b', margin: '0 0 8px' },
  stepDesc: { color: '#64748b', fontSize: '0.875rem', lineHeight: 1.6, margin: 0 },

  cta: { background: 'linear-gradient(135deg, #2563eb, #7c3aed)', padding: '80px 24px', textAlign: 'center' as const },
  ctaTitle: { fontSize: 'clamp(1.5rem, 4vw, 2.2rem)', fontWeight: 800, color: '#fff', margin: '0 0 12px' },
  ctaSub: { color: 'rgba(255,255,255,0.8)', fontSize: '1rem', margin: '0 0 32px' },
  btnWhite: { padding: '14px 32px', background: '#fff', color: '#2563eb', borderRadius: '10px', fontWeight: 700, textDecoration: 'none', fontSize: '1rem' },
};

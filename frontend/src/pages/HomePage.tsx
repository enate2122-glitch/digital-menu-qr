import { Link } from 'react-router-dom';
import LandingLayout from './LandingLayout';

export default function HomePage() {
  return (
    <LandingLayout>
      {/* Hero */}
      <section style={s.hero}>
        <div style={s.heroGlow} />
        <div style={s.heroInner}>
          <span style={s.badge}>✨ No app required for customers</span>
          <h1 style={s.heroTitle}>Digital Menus for<br /><span style={{ color: 'var(--gold)' }}>Modern Restaurants</span></h1>
          <p style={s.heroSub}>Create a beautiful digital menu, generate a QR code, and let customers browse instantly from their phone.</p>
          <div style={s.heroBtns}>
            <Link to="/signup" className="btn-gold" style={s.heroBtn}>Start for Free →</Link>
            <Link to="/features" className="btn-outline" style={s.heroBtn}>See Features</Link>
          </div>
          <p style={{ color: '#444', fontSize: '0.8rem', marginTop: '12px' }}>Free to start · No credit card required</p>
        </div>
        <div style={s.mockWrap}>
          <div style={s.phone}>
            <div style={s.phoneScreen}>
              <div style={{ background: 'linear-gradient(135deg,#c9a84c,#a07830)', padding: '16px' }}>
                <div style={{ width: '36px', height: '36px', background: 'rgba(255,255,255,0.2)', borderRadius: '50%', marginBottom: '8px' }} />
                <div style={{ color: '#fff', fontWeight: 700, fontSize: '0.95rem' }}>Savoria</div>
                <div style={{ color: 'rgba(255,255,255,0.7)', fontSize: '0.7rem' }}>Fine Dining Experience</div>
              </div>
              <div style={{ padding: '10px', display: 'flex', flexDirection: 'column', gap: '6px' }}>
                {['Starters', 'Mains', 'Desserts'].map(cat => (
                  <div key={cat} style={{ background: 'var(--bg3)', borderRadius: '8px', padding: '8px 10px', border: '1px solid var(--border)' }}>
                    <div style={{ fontWeight: 600, fontSize: '0.72rem', color: 'var(--gold)', marginBottom: '4px' }}>{cat}</div>
                    <div style={{ display: 'flex', gap: '4px' }}>
                      {[1, 2].map(i => <div key={i} style={{ flex: 1, background: 'var(--border)', borderRadius: '4px', height: '36px' }} />)}
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
        {[{ n: '500+', l: 'Restaurants' }, { n: '50K+', l: 'Menu Scans' }, { n: '99.9%', l: 'Uptime' }, { n: '< 1s', l: 'Load Time' }].map(({ n, l }) => (
          <div key={l} style={s.stat}>
            <div style={{ fontSize: '2rem', fontWeight: 900, color: 'var(--gold)' }}>{n}</div>
            <div style={{ fontSize: '0.8rem', color: 'var(--muted)', marginTop: '4px' }}>{l}</div>
          </div>
        ))}
      </section>

      {/* How it works */}
      <section style={s.section}>
        <div style={s.sectionInner}>
          <p style={s.eyebrow}>HOW IT WORKS</p>
          <h2 style={s.sectionTitle}>Live in <span style={{ color: 'var(--gold)' }}>Minutes</span></h2>
          <div className="gold-divider" />
          <div style={s.steps}>
            {[
              { n: '01', icon: '📝', title: 'Create Account', desc: 'Sign up free and set up your restaurant profile with logo and brand color.' },
              { n: '02', icon: '🍕', title: 'Build Your Menu', desc: 'Add categories and items with names, descriptions, prices and photos.' },
              { n: '03', icon: '📱', title: 'Download QR Code', desc: 'Get your unique QR code PNG and print it for your tables.' },
              { n: '04', icon: '✅', title: 'Customers Scan', desc: 'Customers scan and instantly see your full menu — no app needed.' },
            ].map(step => (
              <div key={step.n} className="card" style={s.step}>
                <div style={{ color: 'var(--gold)', fontSize: '0.75rem', fontWeight: 700, letterSpacing: '0.1em', marginBottom: '12px' }}>{step.n}</div>
                <div style={{ fontSize: '2rem', marginBottom: '12px' }}>{step.icon}</div>
                <h3 style={{ fontWeight: 700, fontSize: '1rem', color: 'var(--text)', margin: '0 0 8px' }}>{step.title}</h3>
                <p style={{ color: 'var(--muted)', fontSize: '0.875rem', lineHeight: 1.6, margin: 0 }}>{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section style={s.cta}>
        <div style={s.ctaGlow} />
        <p style={s.eyebrow}>GET STARTED TODAY</p>
        <h2 style={{ ...s.sectionTitle, color: 'var(--text)' }}>Ready to go <span style={{ color: 'var(--gold)' }}>digital?</span></h2>
        <div className="gold-divider" />
        <p style={{ color: 'var(--muted)', marginBottom: '32px' }}>Join hundreds of restaurants already using MenuQR.</p>
        <Link to="/signup" className="btn-gold" style={{ padding: '14px 36px', fontSize: '1rem', borderRadius: '12px', fontWeight: 700 }}>Create Your Free Account →</Link>
      </section>
    </LandingLayout>
  );
}

const s: Record<string, React.CSSProperties> = {
  hero: { position: 'relative', padding: '80px 24px', display: 'flex', justifyContent: 'center', gap: '60px', flexWrap: 'wrap' as const, alignItems: 'center', overflow: 'hidden' },
  heroGlow: { position: 'absolute', top: '-100px', left: '50%', transform: 'translateX(-50%)', width: '600px', height: '400px', background: 'radial-gradient(ellipse, rgba(201,168,76,0.08) 0%, transparent 70%)', pointerEvents: 'none' },
  heroInner: { maxWidth: '520px', position: 'relative', zIndex: 1 },
  badge: { display: 'inline-block', background: 'var(--gold-dim)', color: 'var(--gold)', padding: '4px 14px', borderRadius: '20px', fontSize: '0.8rem', fontWeight: 600, marginBottom: '20px', border: '1px solid rgba(201,168,76,0.3)' },
  heroTitle: { fontSize: 'clamp(2rem, 5vw, 3rem)', fontWeight: 900, color: 'var(--text)', lineHeight: 1.15, margin: '0 0 20px', fontFamily: 'var(--font-ser)' },
  heroSub: { fontSize: '1rem', color: 'var(--muted)', lineHeight: 1.7, margin: '0 0 32px' },
  heroBtns: { display: 'flex', gap: '12px', flexWrap: 'wrap' as const },
  heroBtn: { padding: '13px 28px', borderRadius: '10px', fontWeight: 700, fontSize: '0.95rem' },
  mockWrap: { display: 'flex', justifyContent: 'center', position: 'relative', zIndex: 1 },
  phone: { width: '200px', background: 'var(--bg2)', borderRadius: '28px', padding: '10px', boxShadow: '0 24px 60px rgba(0,0,0,0.5), 0 0 0 1px var(--border)', border: '1px solid var(--border)' },
  phoneScreen: { background: 'var(--bg)', borderRadius: '20px', overflow: 'hidden', minHeight: '340px' },
  stats: { background: 'var(--bg2)', borderTop: '1px solid var(--border)', borderBottom: '1px solid var(--border)', padding: '40px 24px', display: 'flex', justifyContent: 'center', gap: '60px', flexWrap: 'wrap' as const },
  stat: { textAlign: 'center' as const },
  section: { padding: '80px 24px' },
  sectionInner: { maxWidth: '1000px', margin: '0 auto', textAlign: 'center' as const },
  eyebrow: { color: 'var(--gold)', fontSize: '0.75rem', fontWeight: 700, letterSpacing: '0.15em', marginBottom: '12px' },
  sectionTitle: { fontSize: 'clamp(1.6rem, 4vw, 2.4rem)', fontWeight: 800, color: 'var(--text)', margin: '0 0 20px', fontFamily: 'var(--font-ser)' },
  steps: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px', textAlign: 'left' as const, marginTop: '40px' },
  step: { padding: '28px 24px' },
  cta: { position: 'relative', padding: '80px 24px', textAlign: 'center' as const, borderTop: '1px solid var(--border)', overflow: 'hidden' },
  ctaGlow: { position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%,-50%)', width: '500px', height: '300px', background: 'radial-gradient(ellipse, rgba(201,168,76,0.06) 0%, transparent 70%)', pointerEvents: 'none' },
};

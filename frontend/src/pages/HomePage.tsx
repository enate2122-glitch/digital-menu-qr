import { Link } from 'react-router-dom';
import LandingLayout from './LandingLayout';

const heroImg = 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=1200&q=80';
const food1   = 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=600&q=80';
const food2   = 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=600&q=80';
const food3   = 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=600&q=80';
const food4   = 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=600&q=80';
const qrImg   = 'https://images.unsplash.com/photo-1595079676339-1534801ad6cf?w=600&q=80';

const testimonials = [
  { name: 'Abebe Girma', role: 'Owner, Addis Grill', text: 'MenuQR transformed how our customers interact with our menu. Setup took less than 30 minutes!', avatar: 'AG' },
  { name: 'Sara Tadesse', role: 'Manager, Habesha Kitchen', text: 'We update prices and sold-out items instantly. No more reprinting menus every week.', avatar: 'ST' },
  { name: 'Dawit Bekele', role: 'Owner, Lalibela Café', text: 'Our customers love scanning the QR code. It feels modern and professional.', avatar: 'DB' },
];

export default function HomePage() {
  return (
    <LandingLayout>

      {/* ── Hero ── */}
      <section style={s.hero}>
        <div style={{ ...s.heroBg, backgroundImage: `url(${heroImg})` }} />
        <div style={s.heroOverlay} />
        <div style={s.heroContent}>
          <span style={s.badge}>✨ No app required for customers</span>
          <h1 style={s.heroTitle}>
            Digital Menus for<br />
            <span style={{ color: 'var(--gold)' }}>Modern Restaurants</span>
          </h1>
          <p style={s.heroSub}>
            Create a stunning digital menu, generate a QR code, and let customers browse instantly from their phone — no printing, no hassle.
          </p>
          <div style={s.heroBtns}>
            <Link to="/signup" className="btn-gold" style={s.heroBtn}>Start for Free →</Link>
            <Link to="/features" className="btn-outline" style={s.heroBtn}>See Features</Link>
          </div>
          <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.8rem', marginTop: '12px' }}>
            Free to start · No credit card required
          </p>
        </div>
      </section>

      {/* ── Stats ── */}
      <section style={s.stats}>
        {[
          { n: '500+', l: 'Restaurants' },
          { n: '50K+', l: 'Menu Scans' },
          { n: '99.9%', l: 'Uptime' },
          { n: '< 1s', l: 'Load Time' },
        ].map(({ n, l }) => (
          <div key={l} style={s.stat}>
            <div style={{ fontSize: '2rem', fontWeight: 900, color: 'var(--gold)' }}>{n}</div>
            <div style={{ fontSize: '0.8rem', color: 'var(--muted)', marginTop: '4px' }}>{l}</div>
          </div>
        ))}
      </section>

      {/* ── How it works ── */}
      <section style={s.section}>
        <div style={s.sectionInner}>
          <p style={s.eyebrow}>HOW IT WORKS</p>
          <h2 style={s.sectionTitle}>Live in <span style={{ color: 'var(--gold)' }}>Minutes</span></h2>
          <div className="gold-divider" style={{ margin: '0 auto 48px' }} />
          <div style={s.steps}>
            {[
              { n: '01', icon: '📝', title: 'Create Account', desc: 'Sign up free and set up your restaurant profile with logo and brand color.', img: food3 },
              { n: '02', icon: '🍕', title: 'Build Your Menu', desc: 'Add categories and items with names, descriptions, prices and photos.', img: food1 },
              { n: '03', icon: '📱', title: 'Download QR Code', desc: 'Get your unique QR code PNG and print it for your tables.', img: qrImg },
              { n: '04', icon: '✅', title: 'Customers Scan', desc: 'Customers scan and instantly see your full menu — no app needed.', img: food2 },
            ].map(step => (
              <div key={step.n} className="card" style={s.step}>
                <div style={{ ...s.stepImg, backgroundImage: `url(${step.img})` }} />
                <div style={{ padding: '20px' }}>
                  <div style={{ color: 'var(--gold)', fontSize: '0.72rem', fontWeight: 700, letterSpacing: '0.1em', marginBottom: '8px' }}>{step.n}</div>
                  <h3 style={{ fontWeight: 700, fontSize: '1rem', color: 'var(--text)', margin: '0 0 6px' }}>{step.title}</h3>
                  <p style={{ color: 'var(--muted)', fontSize: '0.875rem', lineHeight: 1.6, margin: 0 }}>{step.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Feature showcase ── */}
      <section style={s.showcase}>
        <div style={s.showcaseInner}>
          <div style={s.showcaseText}>
            <p style={s.eyebrow}>BEAUTIFUL MENUS</p>
            <h2 style={{ ...s.sectionTitle, textAlign: 'left' as const }}>
              Your Menu,<br /><span style={{ color: 'var(--gold)' }}>Your Brand</span>
            </h2>
            <div style={{ width: '40px', height: '2px', background: 'var(--gold)', margin: '0 0 20px', borderRadius: '2px' }} />
            <p style={{ color: 'var(--muted)', lineHeight: 1.8, marginBottom: '24px', fontSize: '0.95rem' }}>
              Customize your menu with your logo, brand colors, and high-quality food photos. Customers get a premium experience that reflects your restaurant's identity.
            </p>
            {['Custom logo & brand color', 'High-quality food photos', 'Mobile-first responsive design', 'Instant sold-out updates'].map(f => (
              <div key={f} style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '10px' }}>
                <span style={{ color: 'var(--gold)', fontSize: '1rem' }}>✓</span>
                <span style={{ color: 'var(--text)', fontSize: '0.9rem' }}>{f}</span>
              </div>
            ))}
            <Link to="/signup" className="btn-gold" style={{ display: 'inline-block', marginTop: '24px', padding: '12px 28px', borderRadius: '10px', fontWeight: 700 }}>
              Get Started Free →
            </Link>
          </div>
          <div style={s.showcaseImgs}>
            <div style={{ ...s.showcaseImg, ...s.showcaseImgMain, backgroundImage: `url(${food4})` }} />
            <div style={{ ...s.showcaseImg, ...s.showcaseImgSub, backgroundImage: `url(${food2})` }} />
          </div>
        </div>
      </section>

      {/* ── Testimonials ── */}
      <section style={s.section}>
        <div style={s.sectionInner}>
          <p style={s.eyebrow}>TESTIMONIALS</p>
          <h2 style={s.sectionTitle}>Loved by <span style={{ color: 'var(--gold)' }}>Restaurant Owners</span></h2>
          <div className="gold-divider" style={{ margin: '0 auto 48px' }} />
          <div style={s.testimonials}>
            {testimonials.map(t => (
              <div key={t.name} className="card" style={s.testimonial}>
                <div style={s.stars}>★★★★★</div>
                <p style={s.testimonialText}>"{t.text}"</p>
                <div style={s.testimonialAuthor}>
                  <div style={s.avatar}>{t.avatar}</div>
                  <div>
                    <div style={{ fontWeight: 700, fontSize: '0.9rem', color: 'var(--text)' }}>{t.name}</div>
                    <div style={{ fontSize: '0.78rem', color: 'var(--muted)' }}>{t.role}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Pricing teaser ── */}
      <section style={s.pricingTeaser}>
        <div style={s.pricingTeaserInner}>
          <p style={s.eyebrow}>PRICING</p>
          <h2 style={{ ...s.sectionTitle, color: 'var(--text)' }}>Simple, <span style={{ color: 'var(--gold)' }}>Transparent</span> Pricing</h2>
          <div className="gold-divider" style={{ margin: '0 auto 16px' }} />
          <p style={{ color: 'var(--muted)', marginBottom: '40px', fontSize: '0.95rem' }}>Choose the plan that fits your restaurant.</p>
          <div style={s.pricingCards}>
            {[
              { name: 'Professional', price: '1,500 ETB', period: '/month', desc: 'Growing businesses' },
              { name: 'Growing', price: '8k–10k ETB', period: '/year', desc: 'Busy restaurants', highlight: true },
              { name: 'Enterprise', price: '10k–50k+ ETB', period: '/year', desc: 'Large brands' },
            ].map(p => (
              <div key={p.name} style={{ ...s.pricingCard, ...(p.highlight ? s.pricingCardHL : {}) }}>
                {p.highlight && <div style={s.popularTag}>Most Popular</div>}
                <div style={{ fontWeight: 800, fontSize: '1rem', color: 'var(--text)', marginBottom: '4px' }}>{p.name}</div>
                <div style={{ fontSize: '1.4rem', fontWeight: 900, color: 'var(--gold)' }}>{p.price}</div>
                <div style={{ fontSize: '0.78rem', color: 'var(--muted)', marginBottom: '8px' }}>{p.period}</div>
                <div style={{ fontSize: '0.8rem', color: 'var(--muted)' }}>{p.desc}</div>
              </div>
            ))}
          </div>
          <Link to="/signup" className="btn-gold" style={{ display: 'inline-block', marginTop: '32px', padding: '13px 36px', fontSize: '0.95rem', borderRadius: '12px', fontWeight: 700 }}>
            Start Free Today →
          </Link>
        </div>
      </section>

      {/* ── CTA ── */}
      <section style={s.cta}>
        <div style={{ ...s.ctaBg, backgroundImage: `url(${food1})` }} />
        <div style={s.ctaOverlay} />
        <div style={s.ctaContent}>
          <p style={{ ...s.eyebrow, color: 'rgba(201,168,76,0.9)' }}>GET STARTED TODAY</p>
          <h2 style={{ fontSize: 'clamp(1.8rem, 5vw, 2.8rem)', fontWeight: 900, color: '#fff', margin: '0 0 16px', fontFamily: 'var(--font-ser)' }}>
            Ready to go <span style={{ color: 'var(--gold)' }}>digital?</span>
          </h2>
          <p style={{ color: 'rgba(255,255,255,0.7)', marginBottom: '32px', fontSize: '0.95rem' }}>
            Join hundreds of restaurants already using MenuQR.
          </p>
          <Link to="/signup" className="btn-gold" style={{ padding: '14px 40px', fontSize: '1rem', borderRadius: '12px', fontWeight: 700 }}>
            Create Your Free Account →
          </Link>
        </div>
      </section>

    </LandingLayout>
  );
}

const s: Record<string, React.CSSProperties> = {
  // Hero
  hero: { position: 'relative', minHeight: '92vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '80px 24px', overflow: 'hidden' },
  heroBg: { position: 'absolute', inset: 0, backgroundSize: 'cover', backgroundPosition: 'center', filter: 'brightness(0.35)' },
  heroOverlay: { position: 'absolute', inset: 0, background: 'linear-gradient(to bottom, rgba(13,13,26,0.3) 0%, rgba(13,13,26,0.85) 100%)' },
  heroContent: { position: 'relative', zIndex: 1, maxWidth: '680px', textAlign: 'center' as const },
  badge: { display: 'inline-block', background: 'rgba(201,168,76,0.15)', color: 'var(--gold)', padding: '5px 16px', borderRadius: '20px', fontSize: '0.8rem', fontWeight: 600, marginBottom: '24px', border: '1px solid rgba(201,168,76,0.3)' },
  heroTitle: { fontSize: 'clamp(2.2rem, 6vw, 3.8rem)', fontWeight: 900, color: '#fff', lineHeight: 1.15, margin: '0 0 20px', fontFamily: 'var(--font-ser)' },
  heroSub: { fontSize: '1.05rem', color: 'rgba(255,255,255,0.75)', lineHeight: 1.8, margin: '0 0 36px' },
  heroBtns: { display: 'flex', gap: '12px', flexWrap: 'wrap' as const, justifyContent: 'center' },
  heroBtn: { padding: '13px 28px', borderRadius: '10px', fontWeight: 700, fontSize: '0.95rem' },

  // Stats
  stats: { background: 'var(--bg2)', borderTop: '1px solid var(--border)', borderBottom: '1px solid var(--border)', padding: '36px 24px', display: 'flex', justifyContent: 'center', gap: '60px', flexWrap: 'wrap' as const },
  stat: { textAlign: 'center' as const },

  // Sections
  section: { padding: '80px 24px' },
  sectionInner: { maxWidth: '1000px', margin: '0 auto', textAlign: 'center' as const },
  eyebrow: { color: 'var(--gold)', fontSize: '0.72rem', fontWeight: 700, letterSpacing: '0.15em', marginBottom: '12px' },
  sectionTitle: { fontSize: 'clamp(1.6rem, 4vw, 2.4rem)', fontWeight: 900, color: 'var(--text)', margin: '0 0 20px', fontFamily: 'var(--font-ser)' },

  // Steps
  steps: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '20px', textAlign: 'left' as const },
  step: { padding: 0, overflow: 'hidden' },
  stepImg: { height: '160px', backgroundSize: 'cover', backgroundPosition: 'center' },

  // Showcase
  showcase: { padding: '80px 24px', background: 'var(--bg2)', borderTop: '1px solid var(--border)', borderBottom: '1px solid var(--border)' },
  showcaseInner: { maxWidth: '1000px', margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '60px', alignItems: 'center' },
  showcaseText: {},
  showcaseImgs: { position: 'relative' as const, height: '400px' },
  showcaseImg: { position: 'absolute' as const, backgroundSize: 'cover', backgroundPosition: 'center', borderRadius: '16px', border: '2px solid var(--border)' },
  showcaseImgMain: { width: '75%', height: '80%', top: 0, left: 0, zIndex: 1 },
  showcaseImgSub: { width: '55%', height: '55%', bottom: 0, right: 0, zIndex: 2, border: '3px solid var(--gold)' },

  // Testimonials
  testimonials: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '20px', textAlign: 'left' as const },
  testimonial: { display: 'flex', flexDirection: 'column' as const, gap: '12px' },
  stars: { color: 'var(--gold)', fontSize: '0.9rem', letterSpacing: '2px' },
  testimonialText: { color: 'var(--muted)', fontSize: '0.9rem', lineHeight: 1.7, margin: 0, flex: 1 },
  testimonialAuthor: { display: 'flex', alignItems: 'center', gap: '12px' },
  avatar: { width: '40px', height: '40px', borderRadius: '50%', background: 'var(--gold-dim)', border: '2px solid var(--gold)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.75rem', fontWeight: 700, color: 'var(--gold)', flexShrink: 0 },

  // Pricing teaser
  pricingTeaser: { padding: '80px 24px', textAlign: 'center' as const },
  pricingTeaserInner: { maxWidth: '800px', margin: '0 auto' },
  pricingCards: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px' },
  pricingCard: { background: 'var(--bg2)', border: '1px solid var(--border)', borderRadius: '16px', padding: '24px 20px', position: 'relative' as const },
  pricingCardHL: { border: '2px solid rgba(201,168,76,0.5)', background: 'linear-gradient(135deg, var(--bg2), rgba(201,168,76,0.05))' },
  popularTag: { position: 'absolute' as const, top: '-11px', left: '50%', transform: 'translateX(-50%)', background: 'var(--gold)', color: '#0d0d1a', padding: '2px 14px', borderRadius: '20px', fontSize: '0.72rem', fontWeight: 700, whiteSpace: 'nowrap' as const },

  // CTA
  cta: { position: 'relative', padding: '120px 24px', textAlign: 'center' as const, overflow: 'hidden' },
  ctaBg: { position: 'absolute', inset: 0, backgroundSize: 'cover', backgroundPosition: 'center', filter: 'brightness(0.25)' },
  ctaOverlay: { position: 'absolute', inset: 0, background: 'linear-gradient(to bottom, rgba(13,13,26,0.5), rgba(13,13,26,0.8))' },
  ctaContent: { position: 'relative', zIndex: 1 },
};

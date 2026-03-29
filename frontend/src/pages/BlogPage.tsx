import LandingLayout from './LandingLayout';

const posts = [
  { date: 'March 20, 2026', tag: 'Tips', title: '5 Ways a Digital Menu Boosts Revenue', excerpt: 'Discover how switching to a QR-based digital menu can reduce printing costs, speed up table turnover, and increase upsells.', icon: '📈' },
  { date: 'March 12, 2026', tag: 'Guide', title: 'How to Take Great Food Photos with Your Phone', excerpt: 'Great photos sell food. Learn simple techniques to photograph your dishes in natural light and make your menu irresistible.', icon: '📸' },
  { date: 'March 5, 2026', tag: 'News', title: 'MenuQR Now Supports Custom Brand Colors', excerpt: "You can now set a custom theme color for your public menu page, making it match your restaurant's brand perfectly.", icon: '🎨' },
  { date: 'February 28, 2026', tag: 'Guide', title: 'Where to Place QR Codes in Your Restaurant', excerpt: 'Table tents, window stickers, receipts — the best spots to place your QR code for maximum customer engagement.', icon: '📍' },
  { date: 'February 15, 2026', tag: 'Tips', title: 'Writing Menu Descriptions That Sell', excerpt: 'The right words make a dish irresistible. Learn how to write compelling menu descriptions that drive orders.', icon: '✍️' },
  { date: 'February 3, 2026', tag: 'News', title: 'Introducing MenuQR', excerpt: "We're excited to launch MenuQR — a simple, affordable platform for restaurants to create and share digital menus via QR codes.", icon: '🚀' },
];

export default function BlogPage() {
  return (
    <LandingLayout>
      <section style={s.hero}>
        <div style={s.glow} />
        <p style={s.eyebrow}>BLOG</p>
        <h1 style={s.title}>Tips & <span style={{ color: 'var(--gold)' }}>Insights</span></h1>
        <div className="gold-divider" />
        <p style={s.sub}>Tips, guides, and news for restaurant owners.</p>
      </section>
      <section style={s.body}>
        <div style={s.grid}>
          {posts.map(post => (
            <div key={post.title} className="card" style={{ padding: 0, overflow: 'hidden', cursor: 'pointer' }}>
              <div style={s.cardImg}>{post.icon}</div>
              <div style={{ padding: '20px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '10px' }}>
                  <span style={{ background: 'var(--gold-dim)', color: 'var(--gold)', padding: '2px 10px', borderRadius: '20px', fontSize: '0.72rem', fontWeight: 700 }}>{post.tag}</span>
                  <span style={{ color: 'var(--muted)', fontSize: '0.78rem' }}>{post.date}</span>
                </div>
                <h3 style={{ fontWeight: 700, fontSize: '0.95rem', color: 'var(--text)', margin: '0 0 8px', lineHeight: 1.4 }}>{post.title}</h3>
                <p style={{ color: 'var(--muted)', fontSize: '0.85rem', lineHeight: 1.6, margin: '0 0 12px' }}>{post.excerpt}</p>
                <span style={{ color: 'var(--gold)', fontWeight: 600, fontSize: '0.85rem' }}>Read more →</span>
              </div>
            </div>
          ))}
        </div>
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
  body: { padding: '48px 24px 80px' },
  grid: { maxWidth: '1000px', margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '20px' },
  cardImg: { background: 'var(--bg3)', fontSize: '3rem', display: 'flex', alignItems: 'center', justifyContent: 'center', height: '110px', borderBottom: '1px solid var(--border)' },
};

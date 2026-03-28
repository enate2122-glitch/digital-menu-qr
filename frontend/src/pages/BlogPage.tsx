import LandingLayout from './LandingLayout';

const posts = [
  {
    date: 'March 20, 2026',
    tag: 'Tips',
    title: '5 Ways a Digital Menu Boosts Your Restaurant Revenue',
    excerpt: 'Discover how switching to a QR-based digital menu can reduce printing costs, speed up table turnover, and increase upsells.',
    img: '📈',
  },
  {
    date: 'March 12, 2026',
    tag: 'Guide',
    title: 'How to Take Great Food Photos with Your Phone',
    excerpt: 'Great photos sell food. Learn simple techniques to photograph your dishes in natural light and make your menu irresistible.',
    img: '📸',
  },
  {
    date: 'March 5, 2026',
    tag: 'News',
    title: 'MenuQR Now Supports Custom Brand Colors',
    excerpt: 'You can now set a custom theme color for your public menu page, making it match your restaurant\'s brand perfectly.',
    img: '🎨',
  },
  {
    date: 'February 28, 2026',
    tag: 'Guide',
    title: 'Where to Place QR Codes in Your Restaurant',
    excerpt: 'Table tents, window stickers, receipts — we cover the best spots to place your QR code for maximum customer engagement.',
    img: '📍',
  },
  {
    date: 'February 15, 2026',
    tag: 'Tips',
    title: 'Writing Menu Descriptions That Sell',
    excerpt: 'The right words can make a dish irresistible. Learn how to write compelling menu descriptions that drive orders.',
    img: '✍️',
  },
  {
    date: 'February 3, 2026',
    tag: 'News',
    title: 'Introducing MenuQR: Digital Menus for Every Restaurant',
    excerpt: 'We\'re excited to launch MenuQR — a simple, affordable platform for restaurants to create and share digital menus via QR codes.',
    img: '🚀',
  },
];

export default function BlogPage() {
  return (
    <LandingLayout>
      <section style={s.hero}>
        <h1 style={s.title}>Blog</h1>
        <p style={s.sub}>Tips, guides, and news for restaurant owners.</p>
      </section>

      <section style={s.body}>
        <div style={s.grid}>
          {posts.map(post => (
            <div key={post.title} style={s.card}>
              <div style={s.cardImg}>{post.img}</div>
              <div style={s.cardBody}>
                <div style={s.meta}>
                  <span style={s.tag}>{post.tag}</span>
                  <span style={s.date}>{post.date}</span>
                </div>
                <h3 style={s.cardTitle}>{post.title}</h3>
                <p style={s.cardExcerpt}>{post.excerpt}</p>
                <span style={s.readMore}>Read more →</span>
              </div>
            </div>
          ))}
        </div>
      </section>
    </LandingLayout>
  );
}

const s: Record<string, React.CSSProperties> = {
  hero: { background: 'linear-gradient(135deg, #f0f7ff, #fafafa)', padding: '80px 24px', textAlign: 'center' as const },
  title: { fontSize: 'clamp(1.8rem, 5vw, 2.8rem)', fontWeight: 900, color: '#0f172a', margin: '0 0 16px' },
  sub: { color: '#64748b', fontSize: '1.1rem', margin: 0 },
  body: { padding: '64px 24px', background: '#fff' },
  grid: { maxWidth: '1000px', margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '24px' },
  card: { border: '1px solid #e5e7eb', borderRadius: '16px', overflow: 'hidden', display: 'flex', flexDirection: 'column' as const },
  cardImg: { background: '#f0f7ff', fontSize: '3rem', display: 'flex', alignItems: 'center', justifyContent: 'center', height: '120px' },
  cardBody: { padding: '20px', display: 'flex', flexDirection: 'column' as const, gap: '8px', flex: 1 },
  meta: { display: 'flex', alignItems: 'center', gap: '10px' },
  tag: { background: '#eff6ff', color: '#2563eb', padding: '2px 8px', borderRadius: '20px', fontSize: '0.75rem', fontWeight: 600 },
  date: { color: '#94a3b8', fontSize: '0.8rem' },
  cardTitle: { fontWeight: 700, fontSize: '1rem', color: '#1e293b', margin: 0, lineHeight: 1.4 },
  cardExcerpt: { color: '#64748b', fontSize: '0.875rem', lineHeight: 1.6, margin: 0, flex: 1 },
  readMore: { color: '#2563eb', fontWeight: 600, fontSize: '0.875rem', cursor: 'pointer' },
};

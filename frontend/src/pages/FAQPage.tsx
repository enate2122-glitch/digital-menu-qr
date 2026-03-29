import { useState } from 'react';
import LandingLayout from './LandingLayout';

const faqs = [
  { q: 'Is MenuQR free to use?', a: 'Yes! Create an account and set up your digital menu completely free. No credit card required.' },
  { q: 'Do my customers need to download an app?', a: 'No. Customers scan the QR code with their phone camera and the menu opens instantly in their browser.' },
  { q: 'How do I update my menu?', a: 'Log in, go to Menu Items, and make any changes. Updates are live immediately — no reprinting needed.' },
  { q: 'Can I mark items as sold out?', a: 'Yes. Toggle the availability switch on any item and it shows a "Sold Out" badge to customers in real time.' },
  { q: 'How do I get my QR code?', a: "After setting up your restaurant profile, go to the Restaurant page and click \"Download QR Code\". You'll get a print-ready PNG." },
  { q: 'Can I upload photos of my dishes?', a: 'Yes. Upload JPEG, PNG, or WebP images (up to 5 MB) for each menu item and your restaurant logo.' },
  { q: 'Can I manage multiple restaurants?', a: 'Yes. A single owner account can manage multiple restaurant profiles, each with its own menu and QR code.' },
  { q: 'Is my data secure?', a: "Absolutely. Passwords are hashed with bcrypt, authentication uses JWT tokens, and each restaurant's data is fully isolated." },
  { q: 'What if I lose my QR code?', a: 'Just log in and download it again from the Restaurant page. The QR code always points to the same URL.' },
];

export default function FAQPage() {
  const [open, setOpen] = useState<number | null>(null);
  return (
    <LandingLayout>
      <section style={s.hero}>
        <div style={s.glow} />
        <p style={s.eyebrow}>FAQ</p>
        <h1 style={s.title}>Frequently Asked <span style={{ color: 'var(--gold)' }}>Questions</span></h1>
        <div className="gold-divider" />
        <p style={s.sub}>Everything you need to know about MenuQR.</p>
      </section>
      <section style={s.body}>
        <div style={s.list}>
          {faqs.map((faq, i) => (
            <div key={i} className="card" style={{ padding: 0, overflow: 'hidden' }}>
              <button style={{ ...s.q, ...(open === i ? { color: 'var(--gold)' } : {}) }} onClick={() => setOpen(open === i ? null : i)}>
                <span>{faq.q}</span>
                <span style={{ color: 'var(--gold)', fontSize: '1.2rem', flexShrink: 0 }}>{open === i ? '−' : '+'}</span>
              </button>
              {open === i && <p style={s.a}>{faq.a}</p>}
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
  list: { maxWidth: '720px', margin: '0 auto', display: 'flex', flexDirection: 'column' as const, gap: '12px' },
  q: { width: '100%', display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '18px 20px', background: 'transparent', border: 'none', cursor: 'pointer', fontWeight: 600, fontSize: '0.95rem', color: 'var(--text)', textAlign: 'left' as const, gap: '12px', fontFamily: 'var(--font-ui)' },
  a: { padding: '0 20px 18px', color: 'var(--muted)', fontSize: '0.9rem', lineHeight: 1.7, margin: 0 },
};

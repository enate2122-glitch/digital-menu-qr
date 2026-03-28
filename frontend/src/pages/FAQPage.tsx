import { useState } from 'react';
import LandingLayout from './LandingLayout';

const faqs = [
  { q: 'Is MenuQR free to use?', a: 'Yes! You can create an account and set up your digital menu completely free. No credit card required to get started.' },
  { q: 'Do my customers need to download an app?', a: 'No. Customers simply scan the QR code with their phone camera and the menu opens instantly in their browser.' },
  { q: 'How do I update my menu?', a: 'Log in to your dashboard, go to Menu Items, and make any changes. Updates are live immediately — no reprinting needed.' },
  { q: 'Can I mark items as sold out?', a: 'Yes. Toggle the availability switch on any item and it will show a "Sold Out" badge to customers in real time.' },
  { q: 'How do I get my QR code?', a: 'After setting up your restaurant profile, go to the Restaurant page and click "Download QR Code". You\'ll get a print-ready PNG file.' },
  { q: 'Can I upload photos of my dishes?', a: 'Yes. You can upload a JPEG, PNG, or WebP image (up to 5 MB) for each menu item and your restaurant logo.' },
  { q: 'Can I manage multiple restaurants?', a: 'Yes. A single owner account can manage multiple restaurant profiles, each with its own menu and QR code.' },
  { q: 'Is my data secure?', a: 'Absolutely. All passwords are hashed with bcrypt, authentication uses JWT tokens, and each restaurant\'s data is fully isolated.' },
  { q: 'What happens if I lose my QR code?', a: 'Just log in and download it again from the Restaurant page. The QR code always points to the same URL.' },
];

export default function FAQPage() {
  const [open, setOpen] = useState<number | null>(null);

  return (
    <LandingLayout>
      <section style={s.hero}>
        <h1 style={s.title}>Frequently Asked Questions</h1>
        <p style={s.sub}>Everything you need to know about MenuQR.</p>
      </section>

      <section style={s.body}>
        <div style={s.list}>
          {faqs.map((faq, i) => (
            <div key={i} style={s.item}>
              <button style={s.question} onClick={() => setOpen(open === i ? null : i)}>
                <span>{faq.q}</span>
                <span style={{ fontSize: '1.2rem', color: '#2563eb' }}>{open === i ? '−' : '+'}</span>
              </button>
              {open === i && <p style={s.answer}>{faq.a}</p>}
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
  list: { maxWidth: '720px', margin: '0 auto', display: 'flex', flexDirection: 'column' as const, gap: '12px' },
  item: { border: '1px solid #e5e7eb', borderRadius: '12px', overflow: 'hidden' },
  question: { width: '100%', display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '18px 20px', background: '#fff', border: 'none', cursor: 'pointer', fontWeight: 600, fontSize: '0.95rem', color: '#1e293b', textAlign: 'left' as const, gap: '12px' },
  answer: { padding: '0 20px 18px', color: '#64748b', fontSize: '0.9rem', lineHeight: 1.7, margin: 0 },
};

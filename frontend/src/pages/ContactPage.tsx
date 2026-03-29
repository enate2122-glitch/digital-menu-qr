import { useState } from 'react';
import LandingLayout from './LandingLayout';

export default function ContactPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [sent, setSent] = useState(false);

  return (
    <LandingLayout>
      <section style={s.hero}>
        <div style={s.glow} />
        <p style={s.eyebrow}>CONTACT</p>
        <h1 style={s.title}>Get in <span style={{ color: 'var(--gold)' }}>Touch</span></h1>
        <div className="gold-divider" />
        <p style={s.sub}>Have a question or need help? We'd love to hear from you.</p>
      </section>

      <section style={s.body}>
        <div style={s.grid}>
          <div>
            <h2 style={s.infoTitle}>We're Here to Help</h2>
            <p style={s.infoText}>Our team responds within 24 hours on business days.</p>
            {[
              { icon: '📧', label: 'Email', value: 'support@menuqr.app' },
              { icon: '💬', label: 'Live Chat', value: 'Mon–Fri, 9am–6pm' },
              { icon: '📍', label: 'Location', value: 'Remote-first, worldwide' },
            ].map(item => (
              <div key={item.label} style={s.infoItem}>
                <span style={s.infoIcon}>{item.icon}</span>
                <div>
                  <div style={{ fontSize: '0.72rem', fontWeight: 700, color: 'var(--muted)', textTransform: 'uppercase' as const, letterSpacing: '0.08em' }}>{item.label}</div>
                  <div style={{ color: 'var(--text)', fontSize: '0.9rem', marginTop: '2px' }}>{item.value}</div>
                </div>
              </div>
            ))}
          </div>

          <div className="card">
            {sent ? (
              <div style={{ textAlign: 'center', padding: '32px 0' }}>
                <div style={{ fontSize: '3rem', marginBottom: '12px' }}>✅</div>
                <h3 style={{ fontWeight: 700, color: 'var(--gold)', margin: '0 0 8px', fontFamily: 'var(--font-ser)' }}>Message Sent!</h3>
                <p style={{ color: 'var(--muted)', margin: 0 }}>We'll get back to you within 24 hours.</p>
              </div>
            ) : (
              <form onSubmit={e => { e.preventDefault(); setSent(true); }} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <h2 style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--gold)', margin: '0 0 4px' }}>Send a Message</h2>
                <div className="form-field"><label>Your Name</label><input type="text" value={name} onChange={e => setName(e.target.value)} required placeholder="John Smith" /></div>
                <div className="form-field"><label>Email Address</label><input type="email" value={email} onChange={e => setEmail(e.target.value)} required placeholder="john@example.com" /></div>
                <div className="form-field"><label>Message</label><textarea value={message} onChange={e => setMessage(e.target.value)} required placeholder="How can we help?" rows={5} style={{ resize: 'vertical' as const }} /></div>
                <button type="submit" className="btn-gold" style={{ padding: '11px', fontSize: '0.95rem' }}>Send Message →</button>
              </form>
            )}
          </div>
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
  grid: { maxWidth: '900px', margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '40px', alignItems: 'start' },
  infoTitle: { fontWeight: 800, fontSize: '1.3rem', color: 'var(--text)', margin: '0 0 10px', fontFamily: 'var(--font-ser)' },
  infoText: { color: 'var(--muted)', lineHeight: 1.7, margin: '0 0 28px', fontSize: '0.9rem' },
  infoItem: { display: 'flex', alignItems: 'flex-start', gap: '14px', marginBottom: '20px' },
  infoIcon: { fontSize: '1.4rem', flexShrink: 0 },
};

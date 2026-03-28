import { useState } from 'react';
import LandingLayout from './LandingLayout';

export default function ContactPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [sent, setSent] = useState(false);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    // In production, wire this to an email service
    setSent(true);
  }

  return (
    <LandingLayout>
      <section style={s.hero}>
        <h1 style={s.title}>Contact Us</h1>
        <p style={s.sub}>Have a question or need help? We'd love to hear from you.</p>
      </section>

      <section style={s.body}>
        <div style={s.grid}>
          {/* Info */}
          <div style={s.info}>
            <h2 style={s.infoTitle}>Get in Touch</h2>
            <p style={s.infoText}>Our team is here to help you get the most out of MenuQR. Reach out and we'll respond within 24 hours.</p>

            {[
              { icon: '📧', label: 'Email', value: 'support@menuqr.app' },
              { icon: '💬', label: 'Live Chat', value: 'Available Mon–Fri, 9am–6pm' },
              { icon: '📍', label: 'Location', value: 'Remote-first team, worldwide' },
            ].map(item => (
              <div key={item.label} style={s.infoItem}>
                <span style={s.infoIcon}>{item.icon}</span>
                <div>
                  <div style={s.infoLabel}>{item.label}</div>
                  <div style={s.infoValue}>{item.value}</div>
                </div>
              </div>
            ))}
          </div>

          {/* Form */}
          <div style={s.formCard}>
            {sent ? (
              <div style={s.success}>
                <div style={{ fontSize: '3rem', marginBottom: '12px' }}>✅</div>
                <h3 style={{ fontWeight: 700, color: '#1e293b', margin: '0 0 8px' }}>Message Sent!</h3>
                <p style={{ color: '#64748b', margin: 0 }}>Thanks for reaching out. We'll get back to you within 24 hours.</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} style={s.form}>
                <h2 style={s.formTitle}>Send a Message</h2>
                <div style={s.field}>
                  <label style={s.label}>Your Name</label>
                  <input type="text" value={name} onChange={e => setName(e.target.value)} required placeholder="John Smith" style={s.input} />
                </div>
                <div style={s.field}>
                  <label style={s.label}>Email Address</label>
                  <input type="email" value={email} onChange={e => setEmail(e.target.value)} required placeholder="john@example.com" style={s.input} />
                </div>
                <div style={s.field}>
                  <label style={s.label}>Message</label>
                  <textarea value={message} onChange={e => setMessage(e.target.value)} required placeholder="How can we help you?" rows={5} style={{ ...s.input, resize: 'vertical' as const }} />
                </div>
                <button type="submit" style={s.btn}>Send Message →</button>
              </form>
            )}
          </div>
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
  grid: { maxWidth: '900px', margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '40px', alignItems: 'start' },
  info: {},
  infoTitle: { fontWeight: 800, fontSize: '1.4rem', color: '#0f172a', margin: '0 0 12px' },
  infoText: { color: '#64748b', lineHeight: 1.7, margin: '0 0 28px', fontSize: '0.95rem' },
  infoItem: { display: 'flex', alignItems: 'flex-start', gap: '14px', marginBottom: '20px' },
  infoIcon: { fontSize: '1.4rem', flexShrink: 0 },
  infoLabel: { fontWeight: 600, fontSize: '0.8rem', color: '#94a3b8', textTransform: 'uppercase' as const, letterSpacing: '0.05em' },
  infoValue: { color: '#1e293b', fontSize: '0.9rem', marginTop: '2px' },
  formCard: { background: '#f8fafc', borderRadius: '16px', padding: '32px' },
  success: { textAlign: 'center' as const, padding: '32px 0' },
  form: { display: 'flex', flexDirection: 'column' as const, gap: '16px' },
  formTitle: { fontWeight: 800, fontSize: '1.2rem', color: '#0f172a', margin: '0 0 4px' },
  field: { display: 'flex', flexDirection: 'column' as const, gap: '6px' },
  label: { fontSize: '0.8rem', fontWeight: 700, color: '#374151', textTransform: 'uppercase' as const, letterSpacing: '0.04em' },
  input: { padding: '10px 14px', border: '1.5px solid #e5e7eb', borderRadius: '10px', fontSize: '0.9rem', outline: 'none', background: '#fff', width: '100%', boxSizing: 'border-box' as const, fontFamily: 'inherit' },
  btn: { padding: '12px 24px', background: '#2563eb', color: '#fff', border: 'none', borderRadius: '10px', fontWeight: 700, fontSize: '0.95rem', cursor: 'pointer' },
};

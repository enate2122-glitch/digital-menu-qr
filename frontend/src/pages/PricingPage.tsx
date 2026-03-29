import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import client from '../api/client';

const plans = [
  {
    id: 'professional',
    name: 'Professional',
    price: '1,500 ETB',
    period: '/month',
    desc: 'Perfect for growing businesses',
    features: ['Unlimited menu items', 'Custom branding', 'QR code generator', 'Image uploads', 'Email support'],
    highlight: false,
  },
  {
    id: 'growing',
    name: 'Growing',
    price: '8,000–10,000 ETB',
    period: '/year',
    desc: 'Best value for busy restaurants',
    features: ['Everything in Professional', 'Priority support', 'Multiple restaurants', 'Analytics dashboard', 'Early access to features'],
    highlight: true,
  },
  {
    id: 'enterprise',
    name: 'Enterprise',
    price: '10,000–50,000+ ETB',
    period: '/year',
    desc: 'For large brands & chains',
    features: ['Everything in Growing', 'Dedicated account manager', 'Custom integrations', 'SLA guarantee', 'On-site onboarding'],
    highlight: false,
  },
];

export default function PricingPage() {
  const [selected, setSelected] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  async function handleSubmit() {
    if (!selected) return;
    setError(''); setLoading(true);
    try {
      await client.post('/subscriptions', { plan: selected });
      navigate('/pending');
    } catch (err: unknown) {
      setError((err as { response?: { data?: { error?: { message?: string } } } })?.response?.data?.error?.message || 'Failed to submit. Please try again.');
    } finally { setLoading(false); }
  }

  return (
    <div style={s.page}>
      <div style={s.glow} />
      <div style={s.inner}>
        <p style={s.eyebrow}>CHOOSE YOUR PLAN</p>
        <h1 style={s.title}>Start Growing Your <span style={{ color: 'var(--gold)' }}>Digital Menu</span></h1>
        <div className="gold-divider" style={{ margin: '0 auto 16px' }} />
        <p style={s.sub}>Select a plan and our team will activate your account within 24 hours.</p>

        <div style={s.grid}>
          {plans.map(plan => (
            <div
              key={plan.id}
              onClick={() => setSelected(plan.id)}
              style={{
                ...s.card,
                ...(plan.highlight ? s.cardHighlight : {}),
                ...(selected === plan.id ? { ...s.cardSelected, borderColor: 'var(--gold)' } : {}),
              }}
            >
              {plan.highlight && <div style={s.popularBadge}>Most Popular</div>}
              <h2 style={s.planName}>{plan.name}</h2>
              <div style={s.planPrice}>{plan.price}</div>
              <div style={s.planPeriod}>{plan.period}</div>
              <p style={s.planDesc}>{plan.desc}</p>
              <div style={s.divider} />
              <ul style={s.features}>
                {plan.features.map(f => (
                  <li key={f} style={s.feature}>
                    <span style={{ color: 'var(--gold)', marginRight: '8px' }}>✓</span>{f}
                  </li>
                ))}
              </ul>
              <div style={{ ...s.selectIndicator, ...(selected === plan.id ? s.selectIndicatorActive : {}) }}>
                {selected === plan.id ? '✓ Selected' : 'Select Plan'}
              </div>
            </div>
          ))}
        </div>

        {error && <div className="alert-error" style={{ maxWidth: '500px', margin: '0 auto 16px' }}>{error}</div>}

        <div style={{ textAlign: 'center' }}>
          <button
            onClick={handleSubmit}
            disabled={!selected || loading}
            className="btn-gold"
            style={{ padding: '14px 48px', fontSize: '1rem', borderRadius: '12px', opacity: selected ? 1 : 0.4 }}
          >
            {loading ? 'Submitting...' : 'Request Activation →'}
          </button>
          <p style={{ color: 'var(--muted)', fontSize: '0.8rem', marginTop: '12px' }}>
            Payment is collected manually after admin approval. We'll contact you within 24 hours.
          </p>
        </div>
      </div>
    </div>
  );
}

const s: Record<string, React.CSSProperties> = {
  page: { minHeight: '100vh', background: 'var(--bg)', padding: '60px 24px', position: 'relative', overflow: 'hidden' },
  glow: { position: 'absolute', top: '0', left: '50%', transform: 'translateX(-50%)', width: '700px', height: '400px', background: 'radial-gradient(ellipse, rgba(201,168,76,0.07) 0%, transparent 70%)', pointerEvents: 'none' },
  inner: { maxWidth: '1000px', margin: '0 auto', position: 'relative', zIndex: 1 },
  eyebrow: { color: 'var(--gold)', fontSize: '0.75rem', fontWeight: 700, letterSpacing: '0.15em', textAlign: 'center', marginBottom: '12px' },
  title: { fontSize: 'clamp(1.6rem, 4vw, 2.4rem)', fontWeight: 900, color: 'var(--text)', textAlign: 'center', margin: '0 0 20px', fontFamily: 'var(--font-ser)' },
  sub: { color: 'var(--muted)', textAlign: 'center', fontSize: '0.95rem', marginBottom: '48px' },
  grid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px', marginBottom: '32px' },
  card: { background: 'var(--bg2)', border: '2px solid var(--border)', borderRadius: '20px', padding: '28px 24px', cursor: 'pointer', transition: 'border-color 0.2s, transform 0.15s', position: 'relative' as const },
  cardHighlight: { border: '2px solid rgba(201,168,76,0.4)', background: 'linear-gradient(135deg, var(--bg2), rgba(201,168,76,0.05))' },
  cardSelected: { transform: 'translateY(-4px)', boxShadow: '0 8px 32px rgba(201,168,76,0.15)' },
  popularBadge: { position: 'absolute' as const, top: '-12px', left: '50%', transform: 'translateX(-50%)', background: 'var(--gold)', color: '#0d0d1a', padding: '3px 16px', borderRadius: '20px', fontSize: '0.75rem', fontWeight: 700, whiteSpace: 'nowrap' as const },
  planName: { fontSize: '1.1rem', fontWeight: 800, color: 'var(--text)', margin: '0 0 8px', fontFamily: 'var(--font-ser)' },
  planPrice: { fontSize: '1.6rem', fontWeight: 900, color: 'var(--gold)', lineHeight: 1 },
  planPeriod: { fontSize: '0.8rem', color: 'var(--muted)', marginBottom: '8px' },
  planDesc: { color: 'var(--muted)', fontSize: '0.85rem', marginBottom: '16px' },
  divider: { height: '1px', background: 'var(--border)', margin: '16px 0' },
  features: { listStyle: 'none', display: 'flex', flexDirection: 'column' as const, gap: '8px', marginBottom: '20px' },
  feature: { fontSize: '0.875rem', color: 'var(--text)', display: 'flex', alignItems: 'flex-start' },
  selectIndicator: { textAlign: 'center' as const, padding: '8px', borderRadius: '8px', fontSize: '0.875rem', fontWeight: 600, color: 'var(--muted)', border: '1.5px solid var(--border)', transition: 'all 0.2s' },
  selectIndicatorActive: { color: 'var(--gold)', borderColor: 'var(--gold)', background: 'var(--gold-dim)' },
};

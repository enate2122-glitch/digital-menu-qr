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
    <div className="pricing-page">
      <style>{`
        .pricing-page {
          min-height: 100vh;
          background: var(--bg);
          padding: 60px 24px;
          position: relative;
          overflow: hidden;
        }
        .pricing-glow {
          position: absolute;
          top: 0; left: 50%;
          transform: translateX(-50%);
          width: 700px; height: 400px;
          background: radial-gradient(ellipse, rgba(201,168,76,0.07) 0%, transparent 70%);
          pointer-events: none;
        }
        .pricing-inner {
          max-width: 1000px;
          margin: 0 auto;
          position: relative;
          z-index: 1;
        }
        .pricing-eyebrow {
          color: var(--gold);
          font-size: 0.75rem;
          font-weight: 700;
          letter-spacing: 0.15em;
          text-align: center;
          margin-bottom: 12px;
        }
        .pricing-title {
          font-size: clamp(1.5rem, 5vw, 2.4rem);
          font-weight: 900;
          color: var(--text);
          text-align: center;
          margin: 0 0 20px;
          font-family: var(--font-ser);
          line-height: 1.2;
        }
        .pricing-sub {
          color: var(--muted);
          text-align: center;
          font-size: 0.95rem;
          margin-bottom: 40px;
          padding: 0 8px;
        }
        .pricing-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 20px;
          margin-bottom: 32px;
        }
        .pricing-card {
          background: var(--bg2);
          border: 2px solid var(--border);
          border-radius: 20px;
          padding: 28px 24px;
          cursor: pointer;
          transition: border-color 0.2s, transform 0.15s;
          position: relative;
        }
        .pricing-card.highlight {
          border-color: rgba(201,168,76,0.4);
          background: linear-gradient(135deg, var(--bg2), rgba(201,168,76,0.05));
        }
        .pricing-card.selected {
          transform: translateY(-4px);
          border-color: var(--gold) !important;
          box-shadow: 0 8px 32px rgba(201,168,76,0.15);
        }
        .pricing-badge {
          position: absolute;
          top: -12px; left: 50%;
          transform: translateX(-50%);
          background: var(--gold);
          color: #0d0d1a;
          padding: 3px 16px;
          border-radius: 20px;
          font-size: 0.75rem;
          font-weight: 700;
          white-space: nowrap;
        }
        .pricing-plan-name {
          font-size: 1.1rem;
          font-weight: 800;
          color: var(--text);
          margin: 0 0 8px;
          font-family: var(--font-ser);
        }
        .pricing-plan-price {
          font-size: 1.6rem;
          font-weight: 900;
          color: var(--gold);
          line-height: 1;
        }
        .pricing-plan-period {
          font-size: 0.8rem;
          color: var(--muted);
          margin-bottom: 8px;
        }
        .pricing-plan-desc {
          color: var(--muted);
          font-size: 0.85rem;
          margin-bottom: 16px;
        }
        .pricing-divider {
          height: 1px;
          background: var(--border);
          margin: 16px 0;
        }
        .pricing-features {
          list-style: none;
          display: flex;
          flex-direction: column;
          gap: 8px;
          margin-bottom: 20px;
          padding: 0;
        }
        .pricing-feature {
          font-size: 0.875rem;
          color: var(--text);
          display: flex;
          align-items: flex-start;
        }
        .pricing-feature span { color: var(--gold); margin-right: 8px; flex-shrink: 0; }
        .pricing-select-btn {
          text-align: center;
          padding: 8px;
          border-radius: 8px;
          font-size: 0.875rem;
          font-weight: 600;
          color: var(--muted);
          border: 1.5px solid var(--border);
          transition: all 0.2s;
        }
        .pricing-select-btn.active {
          color: var(--gold);
          border-color: var(--gold);
          background: var(--gold-dim);
        }
        .pricing-cta {
          text-align: center;
        }
        .pricing-note {
          color: var(--muted);
          font-size: 0.8rem;
          margin-top: 12px;
        }

        @media (max-width: 768px) {
          .pricing-page { padding: 40px 16px; }
          .pricing-grid {
            grid-template-columns: 1fr;
            max-width: 420px;
            margin-left: auto;
            margin-right: auto;
          }
          .pricing-card { padding: 24px 20px; }
        }

        @media (min-width: 769px) and (max-width: 900px) {
          .pricing-grid {
            grid-template-columns: repeat(2, 1fr);
          }
          .pricing-grid > .pricing-card:last-child {
            grid-column: 1 / -1;
            max-width: 420px;
            margin: 0 auto;
            width: 100%;
          }
        }
      `}</style>

      <div className="pricing-glow" />
      <div className="pricing-inner">
        <p className="pricing-eyebrow">CHOOSE YOUR PLAN</p>
        <h1 className="pricing-title">
          Start Growing Your <span style={{ color: 'var(--gold)' }}>Digital Menu</span>
        </h1>
        <div className="gold-divider" style={{ margin: '0 auto 16px' }} />
        <p className="pricing-sub">Select a plan and our team will activate your account within 24 hours.</p>

        <div className="pricing-grid">
          {plans.map(plan => (
            <div
              key={plan.id}
              onClick={() => setSelected(plan.id)}
              className={`pricing-card${plan.highlight ? ' highlight' : ''}${selected === plan.id ? ' selected' : ''}`}
            >
              {plan.highlight && <div className="pricing-badge">Most Popular</div>}
              <h2 className="pricing-plan-name">{plan.name}</h2>
              <div className="pricing-plan-price">{plan.price}</div>
              <div className="pricing-plan-period">{plan.period}</div>
              <p className="pricing-plan-desc">{plan.desc}</p>
              <div className="pricing-divider" />
              <ul className="pricing-features">
                {plan.features.map(f => (
                  <li key={f} className="pricing-feature">
                    <span>✓</span>{f}
                  </li>
                ))}
              </ul>
              <div className={`pricing-select-btn${selected === plan.id ? ' active' : ''}`}>
                {selected === plan.id ? '✓ Selected' : 'Select Plan'}
              </div>
            </div>
          ))}
        </div>

        {error && <div className="alert-error" style={{ maxWidth: '500px', margin: '0 auto 16px' }}>{error}</div>}

        <div className="pricing-cta">
          <button
            onClick={handleSubmit}
            disabled={!selected || loading}
            className="btn-gold"
            style={{ padding: '14px 48px', fontSize: '1rem', borderRadius: '12px', opacity: selected ? 1 : 0.4 }}
          >
            {loading ? 'Submitting...' : 'Request Activation →'}
          </button>
          <p className="pricing-note">
            Payment is collected manually after admin approval. We'll contact you within 24 hours.
          </p>
        </div>
      </div>
    </div>
  );
}

import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import client from '../api/client';

interface Subscription {
  id: string; plan: string; status: string; created_at: string;
}

const planLabels: Record<string, string> = {
  professional: 'Professional — 1,500 ETB/month',
  growing: 'Growing — 8,000–10,000 ETB/year',
  enterprise: 'Enterprise — 10,000–50,000+ ETB/year',
};

export default function PendingPage() {
  const [sub, setSub] = useState<Subscription | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    client.get<Subscription>('/subscriptions/me')
      .then(res => setSub(res.data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    if (sub?.status === 'active') navigate('/admin');
  }, [sub, navigate]);

  function handleLogout() {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    navigate('/login');
  }

  return (
    <div style={s.page}>
      <div style={s.glow} />
      <div style={s.card}>
        {loading ? (
          <div style={{ textAlign: 'center' }}>
            <div style={s.spinner} />
          </div>
        ) : sub?.status === 'rejected' ? (
          <>
            <div style={s.icon}>❌</div>
            <h1 style={s.title}>Request Rejected</h1>
            <p style={s.sub}>Your subscription request was not approved. Please contact support or choose a different plan.</p>
            <button className="btn-gold" style={s.btn} onClick={() => navigate('/pricing')}>Choose Another Plan</button>
          </>
        ) : (
          <>
            <div style={s.icon}>⏳</div>
            <h1 style={s.title}>Awaiting Approval</h1>
            <div style={{ width: '40px', height: '2px', background: 'var(--gold)', margin: '0 auto 20px', borderRadius: '2px' }} />
            <p style={s.sub}>Your subscription request has been submitted. Our team will review and activate your account within <strong style={{ color: 'var(--gold)' }}>24 hours</strong>.</p>

            {sub && (
              <div style={s.planBox}>
                <div style={s.planLabel}>Selected Plan</div>
                <div style={s.planValue}>{planLabels[sub.plan] ?? sub.plan}</div>
                <div style={s.planStatus}>
                  <span style={{ ...s.statusDot, background: sub.status === 'active' ? 'var(--success)' : '#f59e0b' }} />
                  {sub.status === 'active' ? 'Active' : 'Pending review'}
                </div>
              </div>
            )}

            <p style={s.note}>We'll contact you at your registered email once approved. Payment is collected after activation.</p>
            <button className="btn-ghost" style={s.btn} onClick={handleLogout}>Log Out</button>
          </>
        )}
      </div>
    </div>
  );
}

const s: Record<string, React.CSSProperties> = {
  page: { minHeight: '100vh', background: 'var(--bg)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px', position: 'relative', overflow: 'hidden' },
  glow: { position: 'absolute', top: '30%', left: '50%', transform: 'translate(-50%,-50%)', width: '500px', height: '400px', background: 'radial-gradient(ellipse, rgba(201,168,76,0.07) 0%, transparent 70%)', pointerEvents: 'none' },
  card: { background: 'var(--bg2)', border: '1px solid var(--border)', borderRadius: '20px', padding: '48px 36px', width: '100%', maxWidth: '480px', textAlign: 'center' as const, position: 'relative', zIndex: 1 },
  spinner: { width: '36px', height: '36px', border: '3px solid var(--border)', borderTop: '3px solid var(--gold)', borderRadius: '50%', animation: 'spin 0.7s linear infinite', margin: '0 auto' },
  icon: { fontSize: '3.5rem', marginBottom: '16px' },
  title: { fontSize: '1.6rem', fontWeight: 800, color: 'var(--text)', margin: '0 0 16px', fontFamily: 'var(--font-ser)' },
  sub: { color: 'var(--muted)', fontSize: '0.95rem', lineHeight: 1.7, margin: '0 0 24px' },
  planBox: { background: 'var(--bg3)', border: '1px solid var(--border)', borderRadius: '12px', padding: '16px 20px', marginBottom: '20px', textAlign: 'left' as const },
  planLabel: { fontSize: '0.72rem', fontWeight: 700, color: 'var(--muted)', textTransform: 'uppercase' as const, letterSpacing: '0.08em', marginBottom: '4px' },
  planValue: { fontSize: '0.95rem', fontWeight: 700, color: 'var(--gold)', marginBottom: '8px' },
  planStatus: { display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.8rem', color: 'var(--muted)' },
  statusDot: { width: '8px', height: '8px', borderRadius: '50%', flexShrink: 0 },
  note: { color: '#555', fontSize: '0.8rem', lineHeight: 1.6, margin: '0 0 24px' },
  btn: { width: '100%', padding: '11px', fontSize: '0.9rem' },
};

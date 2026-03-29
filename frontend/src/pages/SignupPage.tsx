import { useState, FormEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import client from '../api/client';

export default function SignupPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError('');
    if (password !== confirm) { setError('Passwords do not match.'); return; }
    if (password.length < 8) { setError('Password must be at least 8 characters.'); return; }
    setLoading(true);
    try {
      await client.post('/auth/signup', { email, password });
      const res = await client.post<{ token: string; role: string }>('/auth/login', { email, password });
      localStorage.setItem('token', res.data.token);
      localStorage.setItem('role', res.data.role);
      navigate('/pricing');
    } catch (err: unknown) {
      setError((err as { response?: { data?: { error?: { message?: string } } } })?.response?.data?.error?.message || 'Failed to create account.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={s.page}>
      <div style={s.glow} />
      <div style={s.card}>
        <Link to="/" style={s.logo}>🍽️ <span style={{ color: 'var(--gold)' }}>Menu</span>QR</Link>
        <div style={s.divider} />
        <h1 style={s.title}>Create Account</h1>
        <p style={s.sub}>Start managing your digital menu for free</p>

        <form onSubmit={handleSubmit} style={s.form}>
          {error && <div className="alert-error">{error}</div>}
          <div className="form-field">
            <label>Email Address</label>
            <input type="email" value={email} onChange={e => setEmail(e.target.value)} required placeholder="you@restaurant.com" autoComplete="email" />
          </div>
          <div className="form-field">
            <label>Password</label>
            <input type="password" value={password} onChange={e => setPassword(e.target.value)} required placeholder="Min. 8 characters" autoComplete="new-password" />
          </div>
          <div className="form-field">
            <label>Confirm Password</label>
            <input type="password" value={confirm} onChange={e => setConfirm(e.target.value)} required placeholder="Repeat password" autoComplete="new-password" />
          </div>
          <button type="submit" disabled={loading} className="btn-gold" style={{ width: '100%', padding: '12px', fontSize: '0.95rem', marginTop: '4px' }}>
            {loading ? 'Creating account…' : 'Create Account →'}
          </button>
        </form>

        <p style={s.footer}>
          Already have an account?{' '}
          <Link to="/login" style={{ color: 'var(--gold)', fontWeight: 600 }}>Log in</Link>
        </p>
      </div>
    </div>
  );
}

const s: Record<string, React.CSSProperties> = {
  page: { minHeight: '100vh', background: 'var(--bg)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px', position: 'relative', overflow: 'hidden' },
  glow: { position: 'absolute', top: '30%', left: '50%', transform: 'translate(-50%,-50%)', width: '500px', height: '400px', background: 'radial-gradient(ellipse, rgba(201,168,76,0.07) 0%, transparent 70%)', pointerEvents: 'none' },
  card: { background: 'var(--bg2)', border: '1px solid var(--border)', borderRadius: '20px', padding: '40px 36px', width: '100%', maxWidth: '420px', position: 'relative', zIndex: 1, textAlign: 'center' as const },
  logo: { fontWeight: 800, fontSize: '1.3rem', color: 'var(--text)', display: 'block', marginBottom: '20px' },
  divider: { width: '40px', height: '2px', background: 'var(--gold)', margin: '0 auto 24px', borderRadius: '2px' },
  title: { fontSize: '1.6rem', fontWeight: 700, color: 'var(--text)', margin: '0 0 6px', fontFamily: 'var(--font-ser)' },
  sub: { color: 'var(--muted)', fontSize: '0.875rem', margin: '0 0 28px' },
  form: { display: 'flex', flexDirection: 'column' as const, gap: '16px', textAlign: 'left' as const },
  footer: { marginTop: '24px', fontSize: '0.875rem', color: 'var(--muted)' },
};

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
      // Auto-login after signup
      const res = await client.post<{ token: string; role: string }>('/auth/login', { email, password });
      localStorage.setItem('token', res.data.token);
      localStorage.setItem('role', res.data.role);
      navigate('/admin');
    } catch (err: unknown) {
      setError(
        (err as { response?: { data?: { error?: { message?: string } } } })?.response?.data?.error?.message ||
        'Failed to create account.'
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={s.page}>
      <div style={s.card}>
        <div style={s.top}>
          <Link to="/" style={s.logo}>🍽️ MenuQR</Link>
          <h1 style={s.title}>Create your account</h1>
          <p style={s.sub}>Start managing your digital menu for free.</p>
        </div>

        <form onSubmit={handleSubmit} style={s.form}>
          {error && <div style={s.error}>{error}</div>}

          <div style={s.field}>
            <label style={s.label}>Email Address</label>
            <input type="email" value={email} onChange={e => setEmail(e.target.value)} required placeholder="you@restaurant.com" autoComplete="email" style={s.input} />
          </div>

          <div style={s.field}>
            <label style={s.label}>Password</label>
            <input type="password" value={password} onChange={e => setPassword(e.target.value)} required placeholder="Min. 8 characters" autoComplete="new-password" style={s.input} />
          </div>

          <div style={s.field}>
            <label style={s.label}>Confirm Password</label>
            <input type="password" value={confirm} onChange={e => setConfirm(e.target.value)} required placeholder="Repeat password" autoComplete="new-password" style={s.input} />
          </div>

          <button type="submit" disabled={loading} style={s.btn}>
            {loading ? 'Creating account...' : 'Create Account →'}
          </button>
        </form>

        <p style={s.footer}>
          Already have an account?{' '}
          <Link to="/login" style={{ color: '#2563eb', fontWeight: 600 }}>Log in</Link>
        </p>
      </div>
    </div>
  );
}

const s: Record<string, React.CSSProperties> = {
  page: { minHeight: '100vh', background: 'linear-gradient(135deg, #f0f7ff, #fafafa)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px', fontFamily: 'system-ui, sans-serif' },
  card: { background: '#fff', borderRadius: '20px', boxShadow: '0 8px 40px rgba(0,0,0,0.1)', padding: '40px 36px', width: '100%', maxWidth: '420px', boxSizing: 'border-box' as const },
  top: { textAlign: 'center' as const, marginBottom: '28px' },
  logo: { fontWeight: 800, fontSize: '1.2rem', color: '#1e293b', textDecoration: 'none', display: 'block', marginBottom: '16px' },
  title: { margin: '0 0 6px', fontSize: '1.5rem', fontWeight: 800, color: '#0f172a' },
  sub: { margin: 0, color: '#64748b', fontSize: '0.9rem' },
  form: { display: 'flex', flexDirection: 'column' as const, gap: '16px' },
  error: { background: '#fff0f0', border: '1px solid #fecaca', borderRadius: '8px', padding: '10px 14px', color: '#dc2626', fontSize: '0.875rem' },
  field: { display: 'flex', flexDirection: 'column' as const, gap: '6px' },
  label: { fontSize: '0.78rem', fontWeight: 700, color: '#374151', textTransform: 'uppercase' as const, letterSpacing: '0.04em' },
  input: { padding: '10px 14px', border: '1.5px solid #e5e7eb', borderRadius: '10px', fontSize: '0.9rem', outline: 'none', width: '100%', boxSizing: 'border-box' as const, fontFamily: 'inherit' },
  btn: { padding: '12px', background: '#2563eb', color: '#fff', border: 'none', borderRadius: '10px', fontWeight: 700, fontSize: '0.95rem', cursor: 'pointer', marginTop: '4px' },
  footer: { textAlign: 'center' as const, marginTop: '20px', fontSize: '0.875rem', color: '#64748b' },
};

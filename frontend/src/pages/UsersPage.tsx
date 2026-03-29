import { useEffect, useState } from 'react';
import client from '../api/client';

interface OwnerUser { id: string; email: string; status: string; created_at: string; }

export default function UsersPage() {
  const [users, setUsers] = useState<OwnerUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [newEmail, setNewEmail] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [formError, setFormError] = useState('');
  const [formSuccess, setFormSuccess] = useState('');

  async function fetchUsers() {
    try { setLoading(true); const res = await client.get<OwnerUser[]>('/auth/users'); setUsers(res.data); setError(''); }
    catch { setError('Failed to load users.'); } finally { setLoading(false); }
  }

  useEffect(() => { fetchUsers(); }, []);

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault(); setFormError(''); setFormSuccess('');
    try {
      await client.post('/auth/register', { email: newEmail, password: newPassword });
      setFormSuccess('Owner account created.'); setNewEmail(''); setNewPassword(''); fetchUsers();
    } catch (err: unknown) {
      setFormError((err as { response?: { data?: { error?: { message?: string } } } })?.response?.data?.error?.message || 'Failed to create account.');
    }
  }

  async function handleDeactivate(id: string) {
    if (!window.confirm('Deactivate this owner account?')) return;
    try { await client.patch(`/auth/users/${id}/deactivate`); fetchUsers(); }
    catch { setError('Failed to deactivate user.'); }
  }

  return (
    <div className="page-content">
      <p style={{ color: 'var(--gold)', fontSize: '0.75rem', fontWeight: 700, letterSpacing: '0.12em', marginBottom: '8px' }}>ADMINISTRATION</p>
      <h1 className="page-title" style={{ fontFamily: 'var(--font-ser)' }}>Owner Accounts</h1>

      <div className="card" style={{ marginBottom: '24px' }}>
        <h2 style={{ fontSize: '0.95rem', fontWeight: 700, marginBottom: '16px', color: 'var(--gold)' }}>➕ Create New Owner</h2>
        <form onSubmit={handleCreate}>
          <div className="form-row">
            <div className="form-field" style={{ flex: 1, minWidth: '200px' }}>
              <label>Email</label>
              <input type="email" placeholder="owner@restaurant.com" value={newEmail} onChange={e => setNewEmail(e.target.value)} required />
            </div>
            <div className="form-field" style={{ flex: 1, minWidth: '160px' }}>
              <label>Password</label>
              <input type="password" placeholder="Min. 8 characters" value={newPassword} onChange={e => setNewPassword(e.target.value)} required />
            </div>
            <button type="submit" className="btn-gold" style={{ alignSelf: 'flex-end', padding: '10px 20px' }}>Create</button>
          </div>
          {formError && <div className="alert-error" style={{ marginTop: '8px' }}>{formError}</div>}
          {formSuccess && <div className="alert-success" style={{ marginTop: '8px' }}>{formSuccess}</div>}
        </form>
      </div>

      <div className="card">
        {loading && <p style={{ color: 'var(--muted)', padding: '16px 0' }}>Loading...</p>}
        {error && <div className="alert-error">{error}</div>}
        {!loading && (
          <table>
            <thead><tr><th>Email</th><th>Status</th><th>Created</th><th>Actions</th></tr></thead>
            <tbody>
              {users.map(u => (
                <tr key={u.id}>
                  <td style={{ fontWeight: 500 }}>{u.email}</td>
                  <td><span className={u.status === 'active' ? 'badge-active' : 'badge-inactive'}>{u.status}</span></td>
                  <td style={{ color: 'var(--muted)', fontSize: '0.85rem' }}>{new Date(u.created_at).toLocaleDateString()}</td>
                  <td>{u.status !== 'inactive' && <button className="btn-danger" style={{ padding: '6px 14px', fontSize: '0.8rem' }} onClick={() => handleDeactivate(u.id)}>Deactivate</button>}</td>
                </tr>
              ))}
              {users.length === 0 && <tr><td colSpan={4} style={{ color: 'var(--muted)', textAlign: 'center', padding: '32px' }}>No owner accounts yet.</td></tr>}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

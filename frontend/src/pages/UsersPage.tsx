import { useEffect, useState } from 'react';
import client from '../api/client';

interface OwnerUser {
  id: string;
  email: string;
  status: string;
  created_at: string;
}

export default function UsersPage() {
  const [users, setUsers] = useState<OwnerUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [newEmail, setNewEmail] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [formError, setFormError] = useState('');
  const [formSuccess, setFormSuccess] = useState('');

  async function fetchUsers() {
    try {
      setLoading(true);
      const res = await client.get<OwnerUser[]>('/auth/users');
      setUsers(res.data);
      setError('');
    } catch {
      setError('Failed to load users.');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { fetchUsers(); }, []);

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    setFormError('');
    setFormSuccess('');
    try {
      await client.post('/auth/register', { email: newEmail, password: newPassword });
      setFormSuccess('Owner account created.');
      setNewEmail('');
      setNewPassword('');
      fetchUsers();
    } catch (err: unknown) {
      const msg = (err as { response?: { data?: { message?: string } } })?.response?.data?.message || 'Failed to create account.';
      setFormError(msg);
    }
  }

  async function handleDeactivate(id: string) {
    if (!window.confirm('Deactivate this owner account?')) return;
    try {
      await client.patch(`/auth/users/${id}/deactivate`);
      fetchUsers();
    } catch {
      setError('Failed to deactivate user.');
    }
  }

  return (
    <div className="page-content">
      <h1 className="page-title">Owner Accounts</h1>

      <div className="card" style={{ marginBottom: '24px' }}>
        <h2 style={{ fontSize: '1rem', fontWeight: 600, marginBottom: '16px' }}>Create New Owner</h2>
        <form onSubmit={handleCreate}>
          <div className="form-row">
            <div className="form-field" style={{ flex: 1, minWidth: '200px' }}>
              <label>Email</label>
              <input type="email" placeholder="owner@example.com" value={newEmail} onChange={e => setNewEmail(e.target.value)} required />
            </div>
            <div className="form-field" style={{ flex: 1, minWidth: '160px' }}>
              <label>Password</label>
              <input type="password" placeholder="••••••••" value={newPassword} onChange={e => setNewPassword(e.target.value)} required />
            </div>
            <button type="submit" className="btn-primary" style={{ alignSelf: 'flex-end' }}>Create Owner</button>
          </div>
          {formError && <div className="alert-error">{formError}</div>}
          {formSuccess && <div className="alert-success">{formSuccess}</div>}
        </form>
      </div>

      <div className="card">
        {loading && <p style={{ color: '#6b7280' }}>Loading...</p>}
        {error && <div className="alert-error">{error}</div>}
        {!loading && (
          <table>
            <thead>
              <tr>
                <th>Email</th>
                <th>Status</th>
                <th>Created</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map(u => (
                <tr key={u.id}>
                  <td>{u.email}</td>
                  <td><span className={u.status === 'active' ? 'badge-active' : 'badge-inactive'}>{u.status}</span></td>
                  <td style={{ color: '#6b7280', fontSize: '0.875rem' }}>{new Date(u.created_at).toLocaleDateString()}</td>
                  <td>
                    {u.status !== 'inactive' && (
                      <button className="btn-danger" onClick={() => handleDeactivate(u.id)}>Deactivate</button>
                    )}
                  </td>
                </tr>
              ))}
              {users.length === 0 && (
                <tr><td colSpan={4} style={{ color: '#9ca3af', textAlign: 'center', padding: '24px' }}>No owner accounts yet.</td></tr>
              )}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

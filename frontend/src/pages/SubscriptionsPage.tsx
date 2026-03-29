import { useEffect, useState } from 'react';
import client from '../api/client';

interface Sub {
  id: string; user_id: string; email: string;
  plan: string; status: string; created_at: string;
  approved_at: string | null; notes: string | null;
}

const planLabels: Record<string, string> = {
  professional: 'Professional',
  growing: 'Growing',
  enterprise: 'Enterprise',
};

export default function SubscriptionsPage() {
  const [subs, setSubs] = useState<Sub[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [rejectNotes, setRejectNotes] = useState<Record<string, string>>({});

  async function fetchSubs() {
    try {
      setLoading(true);
      const res = await client.get<Sub[]>('/subscriptions');
      setSubs(res.data);
    } catch { setError('Failed to load subscriptions.'); }
    finally { setLoading(false); }
  }

  useEffect(() => { fetchSubs(); }, []);

  async function handleApprove(id: string) {
    try { await client.patch(`/subscriptions/${id}/approve`); fetchSubs(); }
    catch { setError('Failed to approve.'); }
  }

  async function handleReject(id: string) {
    try { await client.patch(`/subscriptions/${id}/reject`, { notes: rejectNotes[id] ?? '' }); fetchSubs(); }
    catch { setError('Failed to reject.'); }
  }

  const statusColor: Record<string, string> = {
    pending: '#f59e0b', active: 'var(--success)', rejected: 'var(--danger)', cancelled: 'var(--muted)',
  };

  return (
    <div className="page-content">
      <p style={{ color: 'var(--gold)', fontSize: '0.75rem', fontWeight: 700, letterSpacing: '0.12em', marginBottom: '8px' }}>ADMINISTRATION</p>
      <h1 className="page-title" style={{ fontFamily: 'var(--font-ser)' }}>Subscription Requests</h1>

      {error && <div className="alert-error" style={{ marginBottom: '16px' }}>{error}</div>}

      <div className="card">
        {loading && <p style={{ color: 'var(--muted)', padding: '16px 0' }}>Loading...</p>}
        {!loading && (
          <table>
            <thead>
              <tr>
                <th>Email</th>
                <th>Plan</th>
                <th>Status</th>
                <th>Requested</th>
                <th style={{ width: '280px' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {subs.map(sub => (
                <tr key={sub.id}>
                  <td style={{ fontWeight: 500 }}>{sub.email}</td>
                  <td><span className="badge-gold">{planLabels[sub.plan] ?? sub.plan}</span></td>
                  <td>
                    <span style={{ color: statusColor[sub.status] ?? 'var(--muted)', fontWeight: 600, fontSize: '0.85rem' }}>
                      ● {sub.status}
                    </span>
                  </td>
                  <td style={{ color: 'var(--muted)', fontSize: '0.85rem' }}>{new Date(sub.created_at).toLocaleDateString()}</td>
                  <td>
                    {sub.status === 'pending' && (
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                        <div style={{ display: 'flex', gap: '6px' }}>
                          <button className="btn-gold" style={{ padding: '5px 14px', fontSize: '0.8rem', flex: 1 }} onClick={() => handleApprove(sub.id)}>
                            ✓ Approve
                          </button>
                          <button className="btn-danger" style={{ padding: '5px 14px', fontSize: '0.8rem', flex: 1 }} onClick={() => handleReject(sub.id)}>
                            ✗ Reject
                          </button>
                        </div>
                        <input
                          type="text"
                          placeholder="Rejection reason (optional)"
                          value={rejectNotes[sub.id] ?? ''}
                          onChange={e => setRejectNotes(prev => ({ ...prev, [sub.id]: e.target.value }))}
                          style={{ fontSize: '0.78rem', padding: '5px 10px' }}
                        />
                      </div>
                    )}
                    {sub.status === 'active' && <span style={{ color: 'var(--success)', fontSize: '0.85rem' }}>✓ Approved</span>}
                    {sub.status === 'rejected' && (
                      <div>
                        <span style={{ color: 'var(--danger)', fontSize: '0.85rem' }}>✗ Rejected</span>
                        {sub.notes && <p style={{ color: 'var(--muted)', fontSize: '0.78rem', margin: '2px 0 0' }}>{sub.notes}</p>}
                      </div>
                    )}
                  </td>
                </tr>
              ))}
              {subs.length === 0 && (
                <tr><td colSpan={5} style={{ color: 'var(--muted)', textAlign: 'center', padding: '32px' }}>No subscription requests yet.</td></tr>
              )}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

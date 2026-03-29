import { useEffect, useState } from 'react';
import client from '../api/client';

interface Category { id: string; name: string; display_order: number; }

export default function CategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [restaurantId, setRestaurantId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [newName, setNewName] = useState('');
  const [newOrder, setNewOrder] = useState('');
  const [formError, setFormError] = useState('');
  const [formSuccess, setFormSuccess] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editName, setEditName] = useState('');
  const [editOrder, setEditOrder] = useState('');
  const [editError, setEditError] = useState('');

  async function fetchCategories(restId: string) {
    try { const res = await client.get<Category[]>(`/restaurants/${restId}/categories`); setCategories([...res.data].sort((a, b) => a.display_order - b.display_order)); setError(''); }
    catch { setError('Failed to load categories.'); }
  }

  useEffect(() => {
    async function init() {
      try {
        setLoading(true);
        const res = await client.get<{ id: string }[]>('/restaurants');
        const restId = res.data[0]?.id;
        if (!restId) { setError('No restaurant found. Please create a restaurant first.'); return; }
        setRestaurantId(restId);
        await fetchCategories(restId);
      } catch { setError('Failed to load restaurant.'); } finally { setLoading(false); }
    }
    init();
  }, []);

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault(); setFormError(''); setFormSuccess('');
    if (!restaurantId) return;
    try {
      await client.post('/categories', { restaurant_id: restaurantId, name: newName, ...(newOrder !== '' ? { display_order: Number(newOrder) } : {}) });
      setFormSuccess('Category created.'); setNewName(''); setNewOrder(''); await fetchCategories(restaurantId);
    } catch (err: unknown) { setFormError((err as { response?: { data?: { error?: { message?: string } } } })?.response?.data?.error?.message || 'Failed to create.'); }
  }

  async function handleSaveEdit(id: string) {
    setEditError(''); if (!restaurantId) return;
    try { await client.patch(`/categories/${id}`, { name: editName, display_order: Number(editOrder) }); setEditingId(null); await fetchCategories(restaurantId); }
    catch (err: unknown) { setEditError((err as { response?: { data?: { error?: { message?: string } } } })?.response?.data?.error?.message || 'Failed to update.'); }
  }

  async function handleDelete(id: string) {
    if (!restaurantId || !window.confirm('Delete this category and all its items?')) return;
    try { await client.delete(`/categories/${id}`); await fetchCategories(restaurantId); }
    catch { setError('Failed to delete category.'); }
  }

  return (
    <div className="page-content">
      <p style={{ color: 'var(--gold)', fontSize: '0.75rem', fontWeight: 700, letterSpacing: '0.12em', marginBottom: '8px' }}>MENU MANAGEMENT</p>
      <h1 className="page-title" style={{ fontFamily: 'var(--font-ser)' }}>Categories</h1>

      <div className="card" style={{ marginBottom: '24px' }}>
        <h2 style={{ fontSize: '0.95rem', fontWeight: 700, marginBottom: '16px', color: 'var(--gold)' }}>➕ Add Category</h2>
        <form onSubmit={handleCreate}>
          <div className="form-row">
            <div className="form-field" style={{ flex: 2, minWidth: '180px' }}>
              <label>Name</label>
              <input type="text" placeholder="e.g. Starters" value={newName} onChange={e => setNewName(e.target.value)} required />
            </div>
            <div className="form-field" style={{ width: '130px' }}>
              <label>Display Order</label>
              <input type="number" placeholder="0" value={newOrder} onChange={e => setNewOrder(e.target.value)} />
            </div>
            <button type="submit" className="btn-gold" style={{ alignSelf: 'flex-end', padding: '10px 20px' }}>Add</button>
          </div>
          {formError && <div className="alert-error" style={{ marginTop: '8px' }}>{formError}</div>}
          {formSuccess && <div className="alert-success" style={{ marginTop: '8px' }}>{formSuccess}</div>}
        </form>
      </div>

      <div className="card">
        {loading && <p style={{ color: 'var(--muted)', padding: '16px 0' }}>Loading...</p>}
        {error && <div className="alert-error">{error}</div>}
        {!loading && !error && (
          <table>
            <thead><tr><th>Name</th><th style={{ width: '120px' }}>Order</th><th style={{ width: '180px' }}>Actions</th></tr></thead>
            <tbody>
              {categories.map(cat => (
                <tr key={cat.id}>
                  {editingId === cat.id ? (
                    <>
                      <td><input type="text" value={editName} onChange={e => setEditName(e.target.value)} /></td>
                      <td><input type="number" value={editOrder} onChange={e => setEditOrder(e.target.value)} style={{ width: '80px' }} /></td>
                      <td>
                        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                          <button className="btn-gold" style={{ padding: '6px 14px', fontSize: '0.8rem' }} onClick={() => handleSaveEdit(cat.id)}>Save</button>
                          <button className="btn-ghost" style={{ padding: '6px 14px', fontSize: '0.8rem' }} onClick={() => setEditingId(null)}>Cancel</button>
                          {editError && <span style={{ color: 'var(--danger)', fontSize: '0.8rem' }}>{editError}</span>}
                        </div>
                      </td>
                    </>
                  ) : (
                    <>
                      <td style={{ fontWeight: 500 }}>{cat.name}</td>
                      <td><span className="badge-gold">{cat.display_order}</span></td>
                      <td>
                        <div style={{ display: 'flex', gap: '8px' }}>
                          <button className="btn-ghost" style={{ padding: '6px 14px', fontSize: '0.8rem' }} onClick={() => { setEditingId(cat.id); setEditName(cat.name); setEditOrder(String(cat.display_order)); setEditError(''); }}>Edit</button>
                          <button className="btn-danger" style={{ padding: '6px 14px', fontSize: '0.8rem' }} onClick={() => handleDelete(cat.id)}>Delete</button>
                        </div>
                      </td>
                    </>
                  )}
                </tr>
              ))}
              {categories.length === 0 && <tr><td colSpan={3} style={{ color: 'var(--muted)', textAlign: 'center', padding: '32px' }}>No categories yet.</td></tr>}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

import { useEffect, useState, useRef } from 'react';
import client from '../api/client';

interface Category { id: string; name: string; display_order: number; }
interface MenuItem {
  id: string; category_id: string; name: string;
  description: string | null; price: number;
  image_url: string | null; display_order: number; is_available: boolean;
}

export default function ItemsPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(null);
  const [items, setItems] = useState<MenuItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [itemsLoading, setItemsLoading] = useState(false);
  const [error, setError] = useState('');

  const [newName, setNewName] = useState('');
  const [newDesc, setNewDesc] = useState('');
  const [newPrice, setNewPrice] = useState('');
  const [newOrder, setNewOrder] = useState('');
  const [newAvailable, setNewAvailable] = useState(true);
  const [formError, setFormError] = useState('');
  const [formSuccess, setFormSuccess] = useState('');
  const createFileRef = useRef<HTMLInputElement>(null);

  const [editingId, setEditingId] = useState<string | null>(null);
  const [editName, setEditName] = useState('');
  const [editDesc, setEditDesc] = useState('');
  const [editPrice, setEditPrice] = useState('');
  const [editOrder, setEditOrder] = useState('');
  const [editAvailable, setEditAvailable] = useState(true);
  const [editImageUrl, setEditImageUrl] = useState('');
  const [editError, setEditError] = useState('');
  const editFileRef = useRef<HTMLInputElement>(null);

  async function fetchItems(categoryId: string) {
    setItemsLoading(true);
    try {
      const res = await client.get<MenuItem[]>(`/categories/${categoryId}/items`);
      setItems(res.data);
    } catch { setError('Failed to load items.'); }
    finally { setItemsLoading(false); }
  }

  useEffect(() => {
    async function init() {
      try {
        setLoading(true);
        const res = await client.get<{ id: string }[]>('/restaurants');
        const restId = res.data[0]?.id;
        if (!restId) { setError('No restaurant found.'); return; }
        const catRes = await client.get<Category[]>(`/restaurants/${restId}/categories`);
        const sorted = [...catRes.data].sort((a, b) => a.display_order - b.display_order);
        setCategories(sorted);
        if (sorted.length > 0) {
          setSelectedCategoryId(sorted[0].id);
          await fetchItems(sorted[0].id);
        }
      } catch { setError('Failed to load data.'); }
      finally { setLoading(false); }
    }
    init();
  }, []);

  async function uploadImage(file: File): Promise<string> {
    const formData = new FormData();
    formData.append('image', file);
    const res = await client.post<{ url: string }>('/images/upload', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return res.data.url;
  }

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    setFormError(''); setFormSuccess('');
    if (!selectedCategoryId) return;
    let imageUrl = '';
    if (createFileRef.current?.files?.[0]) {
      try { imageUrl = await uploadImage(createFileRef.current.files[0]); }
      catch { setFormError('Image upload failed.'); return; }
    }
    try {
      await client.post('/items', {
        category_id: selectedCategoryId, name: newName,
        ...(newDesc ? { description: newDesc } : {}),
        price: Number(newPrice),
        ...(imageUrl ? { image_url: imageUrl } : {}),
        ...(newOrder !== '' ? { display_order: Number(newOrder) } : {}),
        is_available: newAvailable,
      });
      setFormSuccess('Item created.');
      setNewName(''); setNewDesc(''); setNewPrice(''); setNewOrder(''); setNewAvailable(true);
      if (createFileRef.current) createFileRef.current.value = '';
      await fetchItems(selectedCategoryId);
    } catch (err: unknown) {
      setFormError((err as { response?: { data?: { message?: string } } })?.response?.data?.message || 'Failed to create item.');
    }
  }

  function startEdit(item: MenuItem) {
    setEditingId(item.id);
    setEditName(item.name);
    setEditDesc(item.description ?? '');
    setEditPrice(String(item.price));
    setEditOrder(String(item.display_order));
    setEditAvailable(item.is_available);
    setEditImageUrl(item.image_url ?? '');
    setEditError('');
  }

  async function handleSaveEdit(id: string) {
    setEditError('');
    if (!selectedCategoryId) return;
    let imageUrl = editImageUrl;
    if (editFileRef.current?.files?.[0]) {
      try { imageUrl = await uploadImage(editFileRef.current.files[0]); }
      catch { setEditError('Image upload failed.'); return; }
    }
    try {
      await client.patch(`/items/${id}`, {
        name: editName, description: editDesc,
        price: Number(editPrice), display_order: Number(editOrder),
        is_available: editAvailable,
        ...(imageUrl ? { image_url: imageUrl } : {}),
      });
      setEditingId(null);
      await fetchItems(selectedCategoryId);
    } catch (err: unknown) {
      setEditError((err as { response?: { data?: { message?: string } } })?.response?.data?.message || 'Failed to update item.');
    }
  }

  async function handleDelete(id: string) {
    if (!selectedCategoryId || !window.confirm('Delete this item permanently?')) return;
    try { await client.delete(`/items/${id}`); await fetchItems(selectedCategoryId); }
    catch { setError('Failed to delete item.'); }
  }

  if (loading) return <div className="page-content"><p style={{ color: '#6b7280' }}>Loading...</p></div>;
  if (error) return <div className="page-content"><div className="alert-error">{error}</div></div>;

  return (
    <div className="page-content">
      <h1 className="page-title">Menu Items</h1>

      {categories.length === 0 ? (
        <div className="card"><p style={{ color: '#6b7280' }}>No categories found. Please create a category first.</p></div>
      ) : (
        <>
          <div style={{ marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '12px' }}>
            <label style={{ fontWeight: 600, fontSize: '0.875rem' }}>Category:</label>
            <select value={selectedCategoryId ?? ''} onChange={e => { setSelectedCategoryId(e.target.value); fetchItems(e.target.value); }} style={{ width: 'auto' }}>
              {categories.map(cat => <option key={cat.id} value={cat.id}>{cat.name}</option>)}
            </select>
          </div>

          <div className="card" style={{ marginBottom: '20px' }}>
            <h2 style={{ fontSize: '1rem', fontWeight: 600, marginBottom: '14px' }}>Add Item</h2>
            <form onSubmit={handleCreate}>
              <div className="form-row">
                <div className="form-field" style={{ flex: 2, minWidth: '160px' }}>
                  <label>Name *</label>
                  <input type="text" placeholder="Item name" value={newName} onChange={e => setNewName(e.target.value)} required />
                </div>
                <div className="form-field" style={{ flex: 3, minWidth: '180px' }}>
                  <label>Description</label>
                  <input type="text" placeholder="Optional" value={newDesc} onChange={e => setNewDesc(e.target.value)} />
                </div>
                <div className="form-field" style={{ width: '110px' }}>
                  <label>Price *</label>
                  <input type="number" placeholder="0.00" value={newPrice} onChange={e => setNewPrice(e.target.value)} required min="0" step="0.01" />
                </div>
                <div className="form-field" style={{ width: '100px' }}>
                  <label>Order</label>
                  <input type="number" placeholder="0" value={newOrder} onChange={e => setNewOrder(e.target.value)} />
                </div>
              </div>
              <div className="form-row" style={{ alignItems: 'center' }}>
                <div className="form-field">
                  <label>Image</label>
                  <input type="file" accept="image/jpeg,image/png,image/webp" ref={createFileRef} />
                </div>
                <label style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.875rem', fontWeight: 500, cursor: 'pointer', alignSelf: 'flex-end', paddingBottom: '2px' }}>
                  <input type="checkbox" checked={newAvailable} onChange={e => setNewAvailable(e.target.checked)} />
                  Available
                </label>
                <button type="submit" className="btn-primary" style={{ alignSelf: 'flex-end' }}>Add Item</button>
              </div>
              {formError && <div className="alert-error" style={{ marginTop: '8px' }}>{formError}</div>}
              {formSuccess && <div className="alert-success" style={{ marginTop: '8px' }}>{formSuccess}</div>}
            </form>
          </div>

          <div className="card">
            {itemsLoading ? <p style={{ color: '#6b7280' }}>Loading items...</p> : (
              <table>
                <thead>
                  <tr>
                    <th>Item</th>
                    <th style={{ width: '90px' }}>Price</th>
                    <th style={{ width: '70px' }}>Order</th>
                    <th style={{ width: '110px' }}>Status</th>
                    <th style={{ width: '160px' }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {items.map(item => (
                    <tr key={item.id}>
                      {editingId === item.id ? (
                        <>
                          <td>
                            <input type="text" value={editName} onChange={e => setEditName(e.target.value)} style={{ marginBottom: '6px' }} />
                            <input type="text" value={editDesc} onChange={e => setEditDesc(e.target.value)} placeholder="Description" />
                            <input type="file" accept="image/jpeg,image/png,image/webp" ref={editFileRef} style={{ marginTop: '6px', fontSize: '0.8rem' }} />
                          </td>
                          <td><input type="number" value={editPrice} onChange={e => setEditPrice(e.target.value)} min="0" step="0.01" style={{ width: '80px' }} /></td>
                          <td><input type="number" value={editOrder} onChange={e => setEditOrder(e.target.value)} style={{ width: '60px' }} /></td>
                          <td>
                            <label style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.875rem', cursor: 'pointer' }}>
                              <input type="checkbox" checked={editAvailable} onChange={e => setEditAvailable(e.target.checked)} />
                              Available
                            </label>
                          </td>
                          <td>
                            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                              <button className="btn-primary" onClick={() => handleSaveEdit(item.id)}>Save</button>
                              <button className="btn-secondary" onClick={() => setEditingId(null)}>Cancel</button>
                              {editError && <span style={{ color: '#dc2626', fontSize: '0.8rem', width: '100%' }}>{editError}</span>}
                            </div>
                          </td>
                        </>
                      ) : (
                        <>
                          <td>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                              {item.image_url && (
                                <img src={item.image_url} alt={item.name} style={{ width: '44px', height: '44px', objectFit: 'cover', borderRadius: '6px', flexShrink: 0 }} />
                              )}
                              <div>
                                <div style={{ fontWeight: 500 }}>{item.name}</div>
                                {item.description && <div style={{ fontSize: '0.8rem', color: '#6b7280' }}>{item.description}</div>}
                              </div>
                            </div>
                          </td>
                          <td style={{ fontWeight: 600 }}>${Number(item.price).toFixed(2)}</td>
                          <td style={{ color: '#6b7280' }}>{item.display_order}</td>
                          <td>
                            <span className={item.is_available ? 'badge-active' : 'badge-inactive'}>
                              {item.is_available ? 'Available' : 'Sold Out'}
                            </span>
                          </td>
                          <td>
                            <div style={{ display: 'flex', gap: '8px' }}>
                              <button className="btn-secondary" onClick={() => startEdit(item)}>Edit</button>
                              <button className="btn-danger" onClick={() => handleDelete(item.id)}>Delete</button>
                            </div>
                          </td>
                        </>
                      )}
                    </tr>
                  ))}
                  {items.length === 0 && (
                    <tr><td colSpan={5} style={{ color: '#9ca3af', textAlign: 'center', padding: '24px' }}>No items yet.</td></tr>
                  )}
                </tbody>
              </table>
            )}
          </div>
        </>
      )}
    </div>
  );
}

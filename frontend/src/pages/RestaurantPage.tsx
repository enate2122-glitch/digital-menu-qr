import { useEffect, useState, useRef } from 'react';
import client from '../api/client';

interface Restaurant {
  id: string; name: string; address: string;
  logo_url: string; primary_color: string;
  slug: string; unique_qr_id: string;
}

export default function RestaurantPage() {
  const [restaurant, setRestaurant] = useState<Restaurant | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [name, setName] = useState('');
  const [address, setAddress] = useState('');
  const [primaryColor, setPrimaryColor] = useState('#c9a84c');
  const [logoUrl, setLogoUrl] = useState('');
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState('');
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState('');
  const [saveSuccess, setSaveSuccess] = useState('');
  const [qrDownloading, setQrDownloading] = useState(false);
  const [qrError, setQrError] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    async function fetchRestaurant() {
      try {
        setLoading(true);
        const res = await client.get<Restaurant[]>('/restaurants');
        const r = res.data[0];
        if (r) {
          setRestaurant(r);
          setName(r.name ?? '');
          setAddress(r.address ?? '');
          setPrimaryColor(r.primary_color ?? '#c9a84c');
          setLogoUrl(r.logo_url ?? '');
        }
      } catch { setError('Failed to load restaurant profile.'); }
      finally { setLoading(false); }
    }
    fetchRestaurant();
  }, []);

  async function handleLogoChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadError(''); setUploading(true);
    try {
      const formData = new FormData();
      formData.append('image', file);
      const res = await client.post<{ url: string }>('/images/upload', formData, { headers: { 'Content-Type': 'multipart/form-data' } });
      setLogoUrl(res.data.url);
    } catch (err: unknown) {
      setUploadError((err as { response?: { data?: { message?: string } } })?.response?.data?.message || 'Failed to upload image.');
    } finally { setUploading(false); }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaveError(''); setSaveSuccess(''); setSaving(true);
    try {
      if (restaurant) {
        const res = await client.patch<Restaurant>(`/restaurants/${restaurant.id}`, { name, address, primary_color: primaryColor, logo_url: logoUrl });
        setRestaurant(res.data);
        setSaveSuccess('Changes saved successfully.');
      } else {
        const res = await client.post<Restaurant>('/restaurants', { name, address, primary_color: primaryColor, logo_url: logoUrl });
        setRestaurant(res.data);
        setSaveSuccess('Restaurant created successfully.');
      }
    } catch (err: unknown) {
      setSaveError((err as { response?: { data?: { message?: string } } })?.response?.data?.message || 'Failed to save changes.');
    } finally { setSaving(false); }
  }

  async function handleDownloadQr() {
    setQrError(''); setQrDownloading(true);
    try {
      const res = await client.get('/restaurant/qr', { responseType: 'blob' });
      const url = URL.createObjectURL(res.data);
      const a = document.createElement('a');
      a.href = url; a.download = 'qr-code.png'; a.click();
      URL.revokeObjectURL(url);
    } catch { setQrError('Failed to download QR code.'); }
    finally { setQrDownloading(false); }
  }

  if (loading) return (
    <div style={{ minHeight: '60vh', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: '12px' }}>
      <div style={{ width: '36px', height: '36px', border: '3px solid var(--border)', borderTop: '3px solid var(--gold)', borderRadius: '50%', animation: 'spin 0.7s linear infinite' }} />
      <p style={{ color: 'var(--muted)', fontSize: '0.875rem' }}>Loading...</p>
    </div>
  );

  if (error) return <div className="page-content"><div className="alert-error">{error}</div></div>;

  const initials = name ? name.slice(0, 2).toUpperCase() : '??';

  return (
    <div>
      {/* Hero banner */}
      <div style={{ ...s.hero, background: `linear-gradient(135deg, ${primaryColor}22, var(--bg2))` }}>
        <div style={s.heroInner}>
          <div style={s.avatarWrap}>
            {logoUrl
              ? <img src={logoUrl} alt="Logo" style={s.avatar} />
              : <div style={{ ...s.avatarPlaceholder, background: primaryColor }}><span style={{ fontSize: '1.5rem', fontWeight: 800, color: '#0d0d1a' }}>{initials}</span></div>
            }
            <button style={s.avatarEditBtn} onClick={() => fileInputRef.current?.click()} title="Change logo">
              {uploading ? '…' : '✏️'}
            </button>
            <input ref={fileInputRef} type="file" accept="image/jpeg,image/png,image/webp" onChange={handleLogoChange} style={{ display: 'none' }} />
          </div>
          <div>
            <h1 style={{ ...s.heroName, color: primaryColor }}>{name || 'Your Restaurant'}</h1>
            {address && <p style={s.heroAddress}>📍 {address}</p>}
            {uploadError && <p style={{ color: 'var(--danger)', fontSize: '0.8rem', marginTop: '4px' }}>{uploadError}</p>}
          </div>
        </div>
      </div>

      <div className="page-content" style={{ maxWidth: '860px' }}>
        <div style={s.grid}>
          {/* Profile form */}
          <div className="card">
            <p style={s.cardEyebrow}>RESTAURANT DETAILS</p>
            <h2 style={s.cardTitle}>Profile Settings</h2>
            <div style={{ width: '32px', height: '2px', background: 'var(--gold)', marginBottom: '20px', borderRadius: '2px' }} />

            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div className="form-field">
                <label>Restaurant Name *</label>
                <input type="text" value={name} onChange={e => setName(e.target.value)} required placeholder="e.g. The Golden Fork" />
              </div>
              <div className="form-field">
                <label>Address</label>
                <input type="text" value={address} onChange={e => setAddress(e.target.value)} placeholder="123 Main Street, City" />
              </div>
              <div className="form-field">
                <label>Brand Color</label>
                <p style={{ color: 'var(--muted)', fontSize: '0.78rem', margin: '0 0 8px' }}>Appears on your public menu header.</p>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
                  <input type="color" value={primaryColor} onChange={e => setPrimaryColor(e.target.value)}
                    style={{ width: '44px', height: '40px', padding: '2px', background: 'none', border: '1.5px solid var(--border)', borderRadius: '10px', cursor: 'pointer' }} />
                  <input type="text" value={primaryColor} onChange={e => setPrimaryColor(e.target.value)}
                    style={{ width: '110px', fontFamily: 'monospace' }} pattern="^#[0-9A-Fa-f]{6}$" />
                  <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: primaryColor, border: '1px solid var(--border)', flexShrink: 0 }} />
                  {(['#c9a84c', '#2563eb', '#16a34a', '#dc2626', '#7c3aed', '#0891b2'] as string[]).map(c => (
                    <button key={c} type="button" onClick={() => setPrimaryColor(c)} style={{ width: '28px', height: '28px', borderRadius: '50%', background: c, border: 'none', cursor: 'pointer', outline: primaryColor === c ? `3px solid ${c}` : 'none', outlineOffset: '2px', flexShrink: 0 }} />
                  ))}
                </div>
              </div>

              {saveError && <div className="alert-error">{saveError}</div>}
              {saveSuccess && <div className="alert-success">{saveSuccess}</div>}

              <button type="submit" disabled={saving || uploading} style={{ ...s.btnGold, background: primaryColor }}>
                {saving ? 'Saving...' : restaurant ? 'Save Changes' : 'Create Restaurant'}
              </button>
            </form>
          </div>

          {/* Right column */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            {/* QR card */}
            <div className="card">
              <p style={s.cardEyebrow}>QR CODE</p>
              <h2 style={s.cardTitle}>Download & Print</h2>
              <div style={{ width: '32px', height: '2px', background: 'var(--gold)', marginBottom: '16px', borderRadius: '2px' }} />
              <p style={{ color: 'var(--muted)', fontSize: '0.875rem', lineHeight: 1.6, marginBottom: '16px' }}>
                Place your QR code on tables so customers can instantly view your digital menu.
              </p>
              {/* QR illustration */}
              <div style={{ background: 'var(--bg3)', borderRadius: '12px', padding: '16px', display: 'flex', justifyContent: 'center', marginBottom: '16px' }}>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 16px)', gap: '2px' }}>
                  {Array.from({ length: 49 }).map((_, i) => {
                    const corners = [0,1,2,3,4,5,6,7,13,14,20,21,27,28,34,35,41,42,43,44,45,46,47,48];
                    const inner = [8,9,10,15,16,17,22,23,24];
                    const isCorner = corners.includes(i);
                    const isInner = inner.includes(i);
                    return <div key={i} style={{ width: '16px', height: '16px', borderRadius: '2px', background: isCorner ? 'var(--gold)' : isInner ? 'var(--gold)' : Math.random() > 0.5 ? 'var(--border)' : 'transparent' }} />;
                  })}
                </div>
              </div>
              <button onClick={handleDownloadQr} disabled={qrDownloading} style={s.btnGold}>
                {qrDownloading ? 'Generating...' : '⬇ Download QR Code PNG'}
              </button>
              {qrError && <div className="alert-error" style={{ marginTop: '10px' }}>{qrError}</div>}
            </div>

            {/* Info card */}
            {restaurant && (
              <div className="card">
                <p style={s.cardEyebrow}>SYSTEM INFO</p>
                <h2 style={s.cardTitle}>Identifiers</h2>
                <div style={{ width: '32px', height: '2px', background: 'var(--gold)', marginBottom: '16px', borderRadius: '2px' }} />
                {[
                  { label: 'Slug', value: restaurant.slug },
                  { label: 'QR ID', value: restaurant.unique_qr_id },
                  { label: 'Menu URL', value: `/menu/${restaurant.unique_qr_id}` },
                ].map(row => (
                  <div key={row.label} style={{ marginBottom: '12px' }}>
                    <div style={{ fontSize: '0.72rem', fontWeight: 700, color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '4px' }}>{row.label}</div>
                    <code style={{ fontSize: '0.78rem', color: 'var(--gold)', background: 'var(--bg3)', padding: '4px 8px', borderRadius: '6px', display: 'block', wordBreak: 'break-all' }}>{row.value}</code>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

const s: Record<string, React.CSSProperties> = {
  hero: { padding: '36px 24px 28px', borderBottom: '1px solid var(--border)' },
  heroInner: { maxWidth: '860px', margin: '0 auto', display: 'flex', alignItems: 'center', gap: '20px', flexWrap: 'wrap' as const },
  avatarWrap: { position: 'relative' as const, flexShrink: 0 },
  avatar: { width: '80px', height: '80px', borderRadius: '16px', objectFit: 'cover' as const, border: '2px solid var(--border)' },
  avatarPlaceholder: { width: '80px', height: '80px', borderRadius: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center' },
  avatarEditBtn: { position: 'absolute' as const, bottom: '-8px', right: '-8px', background: 'var(--bg2)', border: '1px solid var(--border)', borderRadius: '50%', width: '26px', height: '26px', cursor: 'pointer', fontSize: '0.7rem', display: 'flex', alignItems: 'center', justifyContent: 'center' },
  heroName: { fontSize: 'clamp(1.4rem, 4vw, 2rem)', fontWeight: 800, margin: '0 0 4px', fontFamily: 'var(--font-ser)' },
  heroAddress: { color: 'var(--muted)', fontSize: '0.875rem', margin: 0 },
  grid: { display: 'grid', gridTemplateColumns: 'minmax(0,1.4fr) minmax(0,1fr)', gap: '20px', alignItems: 'start' },
  cardEyebrow: { color: 'var(--gold)', fontSize: '0.72rem', fontWeight: 700, letterSpacing: '0.12em', marginBottom: '6px' },
  cardTitle: { fontSize: '1.1rem', fontWeight: 700, color: 'var(--text)', margin: '0 0 12px', fontFamily: 'var(--font-ser)' },
  btnGold: { width: '100%', padding: '11px', background: 'var(--gold)', color: '#0d0d1a', border: 'none', borderRadius: '10px', fontWeight: 700, fontSize: '0.9rem', cursor: 'pointer' },
};

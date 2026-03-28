import { useEffect, useState, useRef } from 'react';
import client from '../api/client';

interface Restaurant {
  id: string;
  name: string;
  address: string;
  logo_url: string;
  primary_color: string;
  slug: string;
  unique_qr_id: string;
}

export default function RestaurantPage() {
  const [restaurant, setRestaurant] = useState<Restaurant | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [name, setName] = useState('');
  const [address, setAddress] = useState('');
  const [primaryColor, setPrimaryColor] = useState('#2563eb');
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
          setPrimaryColor(r.primary_color ?? '#2563eb');
          setLogoUrl(r.logo_url ?? '');
        }
      } catch {
        setError('Failed to load restaurant profile.');
      } finally {
        setLoading(false);
      }
    }
    fetchRestaurant();
  }, []);

  async function handleLogoChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadError('');
    setUploading(true);
    try {
      const formData = new FormData();
      formData.append('image', file);
      const res = await client.post<{ url: string }>('/images/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      setLogoUrl(res.data.url);
    } catch (err: unknown) {
      setUploadError(
        (err as { response?: { data?: { message?: string } } })?.response?.data?.message ||
        'Failed to upload image.'
      );
    } finally {
      setUploading(false);
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaveError('');
    setSaveSuccess('');
    setSaving(true);
    try {
      if (restaurant) {
        // Update existing
        const res = await client.patch<Restaurant>(`/restaurants/${restaurant.id}`, {
          name, address, primary_color: primaryColor, logo_url: logoUrl,
        });
        setRestaurant(res.data);
        setSaveSuccess('Changes saved successfully.');
      } else {
        // Create new
        const res = await client.post<Restaurant>('/restaurants', {
          name, address, primary_color: primaryColor, logo_url: logoUrl,
        });
        setRestaurant(res.data);
        setSaveSuccess('Restaurant created successfully.');
      }
    } catch (err: unknown) {
      setSaveError(
        (err as { response?: { data?: { message?: string } } })?.response?.data?.message ||
        'Failed to save changes.'
      );
    } finally {
      setSaving(false);
    }
  }

  async function handleDownloadQr() {
    setQrError('');
    setQrDownloading(true);
    try {
      const res = await client.get('/restaurant/qr', { responseType: 'blob' });
      const url = URL.createObjectURL(res.data);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'qr-code.png';
      a.click();
      URL.revokeObjectURL(url);
    } catch {
      setQrError('Failed to download QR code.');
    } finally {
      setQrDownloading(false);
    }
  }

  if (loading) {
    return (
      <div style={s.page}>
        <div style={s.loadingState}>
          <div style={s.spinner} />
          <p style={{ color: '#6b7280', marginTop: '12px' }}>Loading profile...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div style={s.page}>
        <div className="alert-error">{error}</div>
      </div>
    );
  }

  const initials = name ? name.slice(0, 2).toUpperCase() : '??';

  return (
    <div style={s.page}>
      {/* Hero banner */}
      <div style={{ ...s.hero, background: `linear-gradient(135deg, ${primaryColor}dd, ${primaryColor}88)` }}>
        <div style={s.heroInner}>
          <div style={s.avatarWrap}>
            {logoUrl ? (
              <img src={logoUrl} alt="Logo" style={s.avatarImg} />
            ) : (
              <div style={{ ...s.avatarPlaceholder, background: primaryColor }}>
                <span style={s.avatarInitials}>{initials}</span>
              </div>
            )}
            <button
              style={s.avatarEditBtn}
              onClick={() => fileInputRef.current?.click()}
              title="Change logo"
            >
              {uploading ? '...' : '✏️'}
            </button>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/jpeg,image/png,image/webp"
              onChange={handleLogoChange}
              style={{ display: 'none' }}
            />
          </div>
          <div style={s.heroText}>
            <h1 style={s.heroName}>{name || 'Your Restaurant'}</h1>
            {address && <p style={s.heroAddress}>📍 {address}</p>}
            {uploadError && <p style={{ color: '#fca5a5', fontSize: '0.8rem', marginTop: '4px' }}>{uploadError}</p>}
          </div>
        </div>
      </div>

      <div style={s.body}>
        <div style={s.grid}>
          {/* Profile form */}
          <div style={s.card}>
            <div style={s.cardHeader}>
              <span style={s.cardIcon}>🏪</span>
              <div>
                <h2 style={s.cardTitle}>Restaurant Details</h2>
                <p style={s.cardSub}>Update your public profile information</p>
              </div>
            </div>

            <form onSubmit={handleSubmit} style={s.form}>
              <div style={s.fieldGroup}>
                <label style={s.label}>Restaurant Name <span style={s.required}>*</span></label>
                <input
                  type="text"
                  value={name}
                  onChange={e => setName(e.target.value)}
                  required
                  placeholder="e.g. The Golden Fork"
                  style={s.input}
                />
              </div>

              <div style={s.fieldGroup}>
                <label style={s.label}>Address</label>
                <input
                  type="text"
                  value={address}
                  onChange={e => setAddress(e.target.value)}
                  placeholder="e.g. 123 Main Street, City"
                  style={s.input}
                />
              </div>

              <div style={s.fieldGroup}>
                <label style={s.label}>Brand Color</label>
                <p style={s.hint}>This color appears on your public menu page header.</p>
                <div style={s.colorRow}>
                  <input
                    type="color"
                    value={primaryColor}
                    onChange={e => setPrimaryColor(e.target.value)}
                    style={s.colorPicker}
                  />
                  <input
                    type="text"
                    value={primaryColor}
                    onChange={e => setPrimaryColor(e.target.value)}
                    pattern="^#[0-9A-Fa-f]{6}$"
                    style={{ ...s.input, width: '110px', fontFamily: 'monospace' }}
                  />
                  <div style={{ ...s.colorSwatch, background: primaryColor }} />
                  {(['#2563eb', '#16a34a', '#dc2626', '#d97706', '#7c3aed', '#0891b2'] as string[]).map(c => (
                    <button
                      key={c}
                      type="button"
                      onClick={() => setPrimaryColor(c)}
                      style={{
                        ...s.colorDot,
                        background: c,
                        outline: primaryColor === c ? `3px solid ${c}` : 'none',
                        outlineOffset: '2px',
                      }}
                    />
                  ))}
                </div>
              </div>

              {saveError && <div className="alert-error">{saveError}</div>}
              {saveSuccess && <div className="alert-success">{saveSuccess}</div>}

              <button
                type="submit"
                disabled={saving || uploading}
                style={{ ...s.btnPrimary, background: primaryColor }}
              >
                {saving ? 'Saving...' : restaurant ? 'Save Changes' : 'Create Restaurant'}
              </button>
            </form>
          </div>

          {/* Right column */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>

            {/* QR card */}
            <div style={s.card}>
              <div style={s.cardHeader}>
                <span style={s.cardIcon}>📱</span>
                <div>
                  <h2 style={s.cardTitle}>QR Code</h2>
                  <p style={s.cardSub}>Let customers scan to view your menu</p>
                </div>
              </div>

              <div style={s.qrIllustration}>
                <div style={s.qrGrid}>
                  {Array.from({ length: 25 }).map((_, i) => (
                    <div key={i} style={{ ...s.qrCell, background: Math.random() > 0.5 ? '#1e293b' : 'transparent' }} />
                  ))}
                </div>
              </div>

              <p style={{ color: '#6b7280', fontSize: '0.875rem', marginBottom: '16px', lineHeight: 1.5 }}>
                Download your unique QR code and place it on tables, menus, or windows so customers can instantly access your digital menu.
              </p>

              <button
                onClick={handleDownloadQr}
                disabled={qrDownloading}
                style={{ ...s.btnPrimary, background: primaryColor, width: '100%', justifyContent: 'center' }}
              >
                {qrDownloading ? 'Generating...' : '⬇ Download QR Code PNG'}
              </button>
              {qrError && <div className="alert-error" style={{ marginTop: '10px' }}>{qrError}</div>}
            </div>

            {/* Info card */}
            {restaurant && (
              <div style={s.card}>
                <div style={s.cardHeader}>
                  <span style={s.cardIcon}>ℹ️</span>
                  <div>
                    <h2 style={s.cardTitle}>Restaurant Info</h2>
                    <p style={s.cardSub}>System-generated identifiers</p>
                  </div>
                </div>
                <div style={s.infoList}>
                  <div style={s.infoRow}>
                    <span style={s.infoLabel}>Slug</span>
                    <code style={s.infoValue}>{restaurant.slug}</code>
                  </div>
                  <div style={s.infoRow}>
                    <span style={s.infoLabel}>QR ID</span>
                    <code style={s.infoValue}>{restaurant.unique_qr_id}</code>
                  </div>
                  <div style={s.infoRow}>
                    <span style={s.infoLabel}>Menu URL</span>
                    <code style={{ ...s.infoValue, wordBreak: 'break-all' }}>
                      /menu/{restaurant.unique_qr_id}
                    </code>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

const s: Record<string, React.CSSProperties> = {
  page: { minHeight: '100vh', background: '#f0f2f5' },
  loadingState: { display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '60vh' },
  spinner: { width: '36px', height: '36px', border: '3px solid #e5e7eb', borderTop: '3px solid #2563eb', borderRadius: '50%', animation: 'spin 0.8s linear infinite' },

  hero: { padding: '40px 24px 60px', color: '#fff' },
  heroInner: { maxWidth: '900px', margin: '0 auto', display: 'flex', alignItems: 'center', gap: '24px', flexWrap: 'wrap' as const },
  heroText: { flex: 1 },
  heroName: { margin: 0, fontSize: 'clamp(1.5rem, 4vw, 2.2rem)', fontWeight: 800, color: '#fff', textShadow: '0 1px 4px rgba(0,0,0,0.2)' },
  heroAddress: { margin: '6px 0 0', fontSize: '0.95rem', color: 'rgba(255,255,255,0.85)' },

  avatarWrap: { position: 'relative' as const, flexShrink: 0 },
  avatarImg: { width: '96px', height: '96px', borderRadius: '16px', objectFit: 'cover' as const, border: '3px solid rgba(255,255,255,0.4)', boxShadow: '0 4px 16px rgba(0,0,0,0.2)' },
  avatarPlaceholder: { width: '96px', height: '96px', borderRadius: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '3px solid rgba(255,255,255,0.4)', boxShadow: '0 4px 16px rgba(0,0,0,0.2)' },
  avatarInitials: { fontSize: '2rem', fontWeight: 800, color: '#fff' },
  avatarEditBtn: { position: 'absolute' as const, bottom: '-8px', right: '-8px', background: '#fff', border: 'none', borderRadius: '50%', width: '28px', height: '28px', cursor: 'pointer', fontSize: '0.75rem', boxShadow: '0 2px 8px rgba(0,0,0,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center' },

  body: { maxWidth: '900px', margin: '-32px auto 0', padding: '0 20px 40px', position: 'relative' as const, zIndex: 1 },
  grid: { display: 'grid', gridTemplateColumns: 'minmax(0,1.4fr) minmax(0,1fr)', gap: '20px', alignItems: 'start' },

  card: { background: '#fff', borderRadius: '16px', boxShadow: '0 1px 8px rgba(0,0,0,0.08)', padding: '24px' },
  cardHeader: { display: 'flex', alignItems: 'flex-start', gap: '12px', marginBottom: '20px' },
  cardIcon: { fontSize: '1.5rem', lineHeight: 1 },
  cardTitle: { margin: 0, fontSize: '1rem', fontWeight: 700, color: '#111827' },
  cardSub: { margin: '2px 0 0', fontSize: '0.8rem', color: '#9ca3af' },

  form: { display: 'flex', flexDirection: 'column' as const, gap: '18px' },
  fieldGroup: { display: 'flex', flexDirection: 'column' as const, gap: '6px' },
  label: { fontSize: '0.8rem', fontWeight: 700, color: '#374151', textTransform: 'uppercase' as const, letterSpacing: '0.04em' },
  required: { color: '#ef4444' },
  hint: { margin: '0 0 6px', fontSize: '0.78rem', color: '#9ca3af' },
  input: { padding: '10px 14px', border: '1.5px solid #e5e7eb', borderRadius: '10px', fontSize: '0.9rem', outline: 'none', background: '#fafafa', width: '100%', boxSizing: 'border-box' as const },

  colorRow: { display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' as const },
  colorPicker: { width: '44px', height: '40px', padding: '2px', border: '1.5px solid #e5e7eb', borderRadius: '10px', cursor: 'pointer', background: 'none' },
  colorSwatch: { width: '40px', height: '40px', borderRadius: '10px', border: '1.5px solid #e5e7eb', flexShrink: 0 },
  colorDot: { width: '28px', height: '28px', borderRadius: '50%', border: 'none', cursor: 'pointer', flexShrink: 0 },

  btnPrimary: { display: 'flex', alignItems: 'center', gap: '8px', padding: '11px 22px', color: '#fff', border: 'none', borderRadius: '10px', fontWeight: 700, fontSize: '0.9rem', cursor: 'pointer', boxShadow: '0 2px 8px rgba(0,0,0,0.15)' },

  qrIllustration: { background: '#f8fafc', borderRadius: '12px', padding: '20px', display: 'flex', justifyContent: 'center', marginBottom: '16px' },
  qrGrid: { display: 'grid', gridTemplateColumns: 'repeat(5, 20px)', gap: '3px' },
  qrCell: { width: '20px', height: '20px', borderRadius: '3px' },

  infoList: { display: 'flex', flexDirection: 'column' as const, gap: '12px' },
  infoRow: { display: 'flex', flexDirection: 'column' as const, gap: '3px' },
  infoLabel: { fontSize: '0.75rem', fontWeight: 700, color: '#9ca3af', textTransform: 'uppercase' as const, letterSpacing: '0.05em' },
  infoValue: { fontSize: '0.8rem', color: '#374151', background: '#f3f4f6', padding: '4px 8px', borderRadius: '6px', fontFamily: 'monospace' },
};

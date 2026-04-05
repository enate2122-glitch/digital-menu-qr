import { useEffect, useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import client from '../api/client';
import DarkTheme from '../components/menus/DarkTheme';
import LightTheme from '../components/menus/LightTheme';
import ElegantTheme from '../components/menus/ElegantTheme';
import BoldTheme from '../components/menus/BoldTheme';
import type { MenuData } from '../components/menus/types';
import type { PlanLimits } from './AdminLayout';

interface Restaurant {
  id: string; name: string; address: string;
  logo_url: string; primary_color: string;
  slug: string; unique_qr_id: string;
}

const THEMES = [
  { id: 'dark',    label: 'Dark Fine Dining', desc: 'Gold on dark' },
  { id: 'light',   label: 'Light & Clean',    desc: 'White, modern' },
  { id: 'elegant', label: 'Elegant Classic',  desc: 'Cream, luxury' },
  { id: 'bold',    label: 'Bold Street Food', desc: 'Vibrant, energetic' },
];

const SAMPLE_MENU: MenuData = {
  restaurant: { name: 'Your Restaurant', logo_url: null, primary_color: null, address: '123 Main Street', menu_theme: 'dark' },
  categories: [
    {
      id: 'cat1', name: 'Mains', display_order: 0,
      items: [
        { id: 'i1', name: 'Grilled Salmon', description: 'With lemon butter sauce', price: 18, image_url: null, is_available: true, display_order: 0 },
        { id: 'i2', name: 'Caesar Salad', description: 'Romaine, croutons, parmesan', price: 12, image_url: null, is_available: true, display_order: 1 },
        { id: 'i3', name: 'Beef Burger', description: 'Angus beef, cheddar, pickles', price: 15, image_url: null, is_available: false, display_order: 2 },
      ],
    },
    { id: 'cat2', name: 'Drinks', display_order: 1, items: [
      { id: 'i4', name: 'Fresh Juice', description: 'Orange or mango', price: 5, image_url: null, is_available: true, display_order: 0 },
    ]},
  ],
};

function ThemeEmulator({ themeId, primaryColor, coverImageUrl }: { themeId: string; primaryColor: string; coverImageUrl?: string }) {
  const [activeCategory, setActiveCategory] = useState('all');
  const menuData: MenuData = {
    ...SAMPLE_MENU,
    restaurant: { ...SAMPLE_MENU.restaurant, primary_color: primaryColor, menu_theme: themeId, cover_image_url: coverImageUrl || null },
  };

  const ThemeComponent =
    themeId === 'light' ? LightTheme :
    themeId === 'elegant' ? ElegantTheme :
    themeId === 'bold' ? BoldTheme :
    DarkTheme;

  // Phone frame: 390px wide content scaled to fit 220px display = scale 0.564
  const PHONE_W = 390;
  const PHONE_H = 700;
  const DISPLAY_W = 220;
  const scale = DISPLAY_W / PHONE_W;
  const displayH = PHONE_H * scale;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      {/* Phone shell */}
      <div style={{
        width: DISPLAY_W + 24,
        height: displayH + 48,
        background: '#1a1a2e',
        borderRadius: '36px',
        padding: '20px 12px',
        boxShadow: '0 0 0 2px #333, 0 20px 60px rgba(0,0,0,0.6), inset 0 0 0 1px #444',
        position: 'relative',
        flexShrink: 0,
      }}>
        {/* Notch */}
        <div style={{ position: 'absolute', top: '10px', left: '50%', transform: 'translateX(-50%)', width: '60px', height: '8px', background: '#111', borderRadius: '4px', zIndex: 10 }} />
        {/* Screen */}
        <div style={{
          width: DISPLAY_W,
          height: displayH,
          borderRadius: '20px',
          overflow: 'hidden',
          background: '#000',
          position: 'relative',
        }}>
          {/* Scaled content */}
          <div style={{
            width: PHONE_W,
            height: PHONE_H,
            transform: `scale(${scale})`,
            transformOrigin: 'top left',
            overflow: 'hidden',
            pointerEvents: 'none',
          }}>
            <ThemeComponent data={menuData} activeCategory={activeCategory} setActiveCategory={setActiveCategory} />
          </div>
        </div>
        {/* Home bar */}
        <div style={{ position: 'absolute', bottom: '8px', left: '50%', transform: 'translateX(-50%)', width: '60px', height: '4px', background: '#444', borderRadius: '2px' }} />
      </div>
    </div>
  );
}


export default function RestaurantPage({ limits }: { limits: PlanLimits | null }) {
  const [restaurant, setRestaurant] = useState<Restaurant | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [name, setName] = useState('');
  const [address, setAddress] = useState('');
  const [phone, setPhone] = useState('');
  const [coverImageUrl, setCoverImageUrl] = useState('');
  const [primaryColor, setPrimaryColor] = useState('#c9a84c');
  const [logoUrl, setLogoUrl] = useState('');
  const [menuTheme, setMenuTheme] = useState('dark');
  const [uploading, setUploading] = useState(false);
  const [coverUploading, setCoverUploading] = useState(false);
  const [uploadError, setUploadError] = useState('');
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState('');
  const [saveSuccess, setSaveSuccess] = useState('');
  const [qrDownloading, setQrDownloading] = useState(false);
  const [qrError, setQrError] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);
  const coverInputRef = useRef<HTMLInputElement>(null);

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
          setPhone((r as { phone?: string }).phone ?? '');
          setCoverImageUrl((r as { cover_image_url?: string }).cover_image_url ?? '');
          setPrimaryColor(r.primary_color ?? '#c9a84c');
          setLogoUrl(r.logo_url ?? '');
          setMenuTheme((r as { menu_theme?: string }).menu_theme ?? 'dark');
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

  async function handleCoverChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadError(''); setCoverUploading(true);
    try {
      const formData = new FormData();
      formData.append('image', file);
      const res = await client.post<{ url: string }>('/images/upload', formData, { headers: { 'Content-Type': 'multipart/form-data' } });
      setCoverImageUrl(res.data.url);
    } catch (err: unknown) {
      setUploadError((err as { response?: { data?: { message?: string } } })?.response?.data?.message || 'Failed to upload cover image.');
    } finally { setCoverUploading(false); }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaveError(''); setSaveSuccess(''); setSaving(true);
    try {
      if (restaurant) {
        const res = await client.patch<Restaurant>(`/restaurants/${restaurant.id}`, { name, address, phone, cover_image_url: coverImageUrl, primary_color: primaryColor, logo_url: logoUrl, menu_theme: menuTheme });
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
                <label>Phone Number</label>
                <input type="tel" value={phone} onChange={e => setPhone(e.target.value)} placeholder="+1 (555) 000-0000" />
              </div>
              <div className="form-field">
                <label>Cover Image</label>
                <p style={{ color: 'var(--muted)', fontSize: '0.78rem', margin: '0 0 8px' }}>Shown as the menu header background.</p>
                {limits && !limits.coverImage ? (
                  <div style={{ padding: '10px 14px', background: 'var(--bg3)', border: '1px solid var(--border)', borderRadius: '10px', fontSize: '0.82rem', color: 'var(--muted)' }}>
                    🔒 Cover image is available on Growing & Enterprise plans. <Link to="/pricing" style={{ color: 'var(--gold)' }}>Upgrade →</Link>
                  </div>
                ) : (
                  <>
                    {coverImageUrl && (
                      <div style={{ marginBottom: '8px', borderRadius: '8px', overflow: 'hidden', height: '80px', border: '1px solid var(--border)', position: 'relative' }}>
                        <img src={coverImageUrl} alt="cover preview" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                        <button type="button" onClick={() => setCoverImageUrl('')}
                          style={{ position: 'absolute', top: '6px', right: '6px', background: 'rgba(0,0,0,0.6)', border: 'none', borderRadius: '50%', width: '22px', height: '22px', color: '#fff', cursor: 'pointer', fontSize: '0.7rem', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>✕</button>
                      </div>
                    )}
                    <button type="button" onClick={() => coverInputRef.current?.click()}
                      style={{ width: '100%', padding: '10px', border: '1.5px dashed var(--border)', borderRadius: '10px', background: 'var(--bg3)', color: 'var(--muted)', cursor: 'pointer', fontSize: '0.85rem', fontWeight: 600 }}>
                      {coverUploading ? 'Uploading…' : coverImageUrl ? '🔄 Replace Cover Image' : '📷 Upload Cover Image'}
                    </button>
                    <input ref={coverInputRef} type="file" accept="image/jpeg,image/png,image/webp" onChange={handleCoverChange} style={{ display: 'none' }} />
                  </>
                )}
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

              <div className="form-field">
                <label>Menu Design Theme</label>
                <p style={{ color: 'var(--muted)', fontSize: '0.78rem', margin: '0 0 14px' }}>Choose how your public menu looks to customers.</p>

                {/* Phone emulator preview */}
                <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '16px' }}>
                  <ThemeEmulator themeId={menuTheme} primaryColor={primaryColor} coverImageUrl={coverImageUrl} />
                </div>

                {/* Theme selector pills */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '8px' }}>
                  {THEMES.map(t => (
                    <button key={t.id} type="button" onClick={() => setMenuTheme(t.id)}
                      style={{
                        padding: '10px 12px',
                        borderRadius: '10px',
                        border: `2px solid ${menuTheme === t.id ? 'var(--gold)' : 'var(--border)'}`,
                        background: menuTheme === t.id ? 'var(--gold-dim)' : 'var(--bg3)',
                        cursor: 'pointer',
                        textAlign: 'left' as const,
                        transition: 'all 0.15s',
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                      }}>
                      <div>
                        <div style={{ fontSize: '0.8rem', fontWeight: 700, color: menuTheme === t.id ? 'var(--gold)' : 'var(--text)' }}>{t.label}</div>
                        <div style={{ fontSize: '0.7rem', color: 'var(--muted)', marginTop: '1px' }}>{t.desc}</div>
                      </div>
                      {menuTheme === t.id && <span style={{ color: 'var(--gold)', fontSize: '1rem' }}>✓</span>}
                    </button>
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

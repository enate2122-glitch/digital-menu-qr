// Theme: Organic — Hand-drawn, warm parchment, watercolor feel
import { useState } from 'react';
import type { MenuData } from './types';

function optimizeImage(url: string | null, width = 400): string | null {
  if (!url) return null;
  if (url.includes('cloudinary.com')) return url.replace(/\/upload\//, `/upload/w_${width},q_auto,f_auto/`);
  return url;
}

const FOOD_ICONS = ['🍽️','🥗','🍖','🍜','🥩','🍕','🥘','🍣','🥞','🍔'];

export default function OrganicTheme({ data, activeCategory, setActiveCategory }: {
  data: MenuData; activeCategory: string; setActiveCategory: (id: string) => void;
}) {
  const { restaurant, categories } = data;
  const accent = restaurant.primary_color || '#7a5c3a';
  const [search, setSearch] = useState('');

  const allItems = categories.flatMap(c => c.items);
  const baseItems = activeCategory === 'all' ? allItems : categories.find(c => c.id === activeCategory)?.items ?? [];
  const activeItems = search.trim()
    ? baseItems.filter(i => i.name.toLowerCase().includes(search.toLowerCase()) || i.description?.toLowerCase().includes(search.toLowerCase()))
    : baseItems;

  const activeCatName = activeCategory === 'all' ? 'All Items' : (categories.find(c => c.id === activeCategory)?.name ?? '');

  return (
    <div style={{ minHeight: '100vh', background: '#faf3e0', fontFamily: "'Georgia', serif", color: '#2d1f0e', paddingBottom: '80px' }}>
      <style>{`
        .org-add-btn { background: ${accent}; color: #fff; border: none; border-radius: 20px; padding: 5px 12px; font-size: 0.78rem; font-weight: 700; cursor: pointer; font-family: system-ui; display: flex; align-items: center; gap: 4px; white-space: nowrap; }
        .org-add-btn:hover { opacity: 0.85; }
        .org-card { background: #fffdf5; border-radius: 18px; overflow: hidden; box-shadow: 2px 3px 0px #d4b896, 0 1px 8px rgba(0,0,0,0.06); border: 1.5px solid #e8d5b0; transition: all 0.2s; }
        .org-card:hover { transform: translateY(-2px); box-shadow: 3px 5px 0px #c9a87a, 0 4px 16px rgba(0,0,0,0.1); }
        .org-pill { cursor: pointer; border-radius: 20px; padding: 5px 14px; font-size: 0.75rem; font-weight: 700; font-family: system-ui; border: 1.5px solid; transition: all 0.15s; white-space: nowrap; }
        .org-search { width: 100%; padding: 9px 14px 9px 36px; border: 1.5px solid #d4b896; border-radius: 24px; background: #fffdf5; font-size: 0.85rem; font-family: system-ui; color: #2d1f0e; outline: none; }
        .org-search:focus { border-color: ${accent}; }
        .org-tab { display: flex; flex-direction: column; align-items: center; gap: 2px; padding: 6px 8px; cursor: pointer; border-radius: 10px; transition: all 0.15s; flex: 1; border: none; background: none; }
        .org-tab.active { background: rgba(255,255,255,0.25); }
      `}</style>

      {/* Watercolor blobs decoration */}
      <div style={{ position: 'fixed', top: '-60px', right: '-60px', width: '200px', height: '200px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(180,140,80,0.15) 0%, transparent 70%)', pointerEvents: 'none', zIndex: 0 }} />
      <div style={{ position: 'fixed', bottom: '100px', left: '-40px', width: '160px', height: '160px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(120,160,80,0.1) 0%, transparent 70%)', pointerEvents: 'none', zIndex: 0 }} />

      {/* ── Header ── */}
      <div style={{ position: 'relative', zIndex: 1, background: '#faf3e0', padding: '28px 20px 0', textAlign: 'center' }}>
        {restaurant.cover_image_url && (
          <div style={{ position: 'relative', height: '150px', borderRadius: '20px', overflow: 'hidden', marginBottom: '16px', border: '2px solid #e8d5b0' }}>
            <img src={optimizeImage(restaurant.cover_image_url, 800)!} alt="cover" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to bottom, transparent 50%, rgba(250,243,224,0.85) 100%)' }} />
          </div>
        )}
        {restaurant.logo_url && (
          <img src={optimizeImage(restaurant.logo_url, 128)!} alt="logo"
            style={{ width: '60px', height: '60px', borderRadius: '50%', objectFit: 'cover', border: `3px solid ${accent}`, display: 'block', margin: '0 auto 10px', boxShadow: '2px 2px 0 #c9a87a' }} />
        )}
        <h1 style={{ fontSize: 'clamp(1.6rem, 6vw, 2.2rem)', fontWeight: 800, margin: '0 0 2px', letterSpacing: '0.06em', color: '#2d1f0e' }}>
          {restaurant.name.toUpperCase()}
        </h1>
        <p style={{ fontSize: '0.7rem', color: '#a08060', margin: '0 0 4px', fontFamily: 'system-ui', letterSpacing: '0.12em', textTransform: 'uppercase' }}>
          {restaurant.address || 'Café & Bistro'}
        </p>
        {restaurant.phone && (
          <a href={`tel:${restaurant.phone}`} style={{ fontSize: '0.72rem', color: accent, fontFamily: 'system-ui', textDecoration: 'none', fontWeight: 600 }}>{restaurant.phone}</a>
        )}

        {/* Search */}
        <div style={{ position: 'relative', maxWidth: '480px', margin: '16px auto 20px' }}>
          <span style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', fontSize: '0.85rem', color: '#b09070', pointerEvents: 'none' }}>🔍</span>
          <input className="org-search" placeholder="Search menu…" value={search} onChange={e => setSearch(e.target.value)} />
        </div>
      </div>

      {/* ── Category pills ── */}
      <div style={{ position: 'relative', zIndex: 1, overflowX: 'auto', padding: '0 16px 16px', scrollbarWidth: 'none' }}>
        <div style={{ display: 'flex', gap: '8px', minWidth: 'max-content' }}>
          {[{ id: 'all', name: 'All' }, ...categories].map(cat => {
            const active = activeCategory === cat.id;
            return (
              <button key={cat.id} className="org-pill"
                style={{ background: active ? accent : 'transparent', color: active ? '#fff' : '#8a6a4a', borderColor: active ? accent : '#c8a87a' }}
                onClick={() => setActiveCategory(cat.id)}>
                {cat.name.toUpperCase()}
              </button>
            );
          })}
        </div>
      </div>

      {/* ── Section title ── */}
      <div style={{ position: 'relative', zIndex: 1, padding: '0 16px 12px' }}>
        <h2 style={{ fontSize: '1.3rem', fontWeight: 800, color: '#2d1f0e', margin: 0, letterSpacing: '0.04em' }}>
          {activeCatName.toUpperCase()}
        </h2>
        {/* Hand-drawn underline */}
        <svg width="80" height="8" viewBox="0 0 80 8" style={{ display: 'block', marginTop: '4px' }}>
          <path d="M2 5 Q20 2 40 5 Q60 8 78 4" stroke={accent} strokeWidth="2.5" fill="none" strokeLinecap="round" />
        </svg>
      </div>

      {/* ── 2-column grid ── */}
      <div style={{ position: 'relative', zIndex: 1, padding: '0 12px', display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '12px', maxWidth: '700px', margin: '0 auto' }}>
        {activeItems.map((item, idx) => (
          <div key={item.id} className="org-card" style={{ opacity: item.is_available ? 1 : 0.6 }}>
            <div style={{ position: 'relative', height: '130px', background: '#f0e8d0' }}>
              {item.image_url
                ? <img src={optimizeImage(item.image_url, 400)!} alt={item.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                : <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '2.5rem' }}>{FOOD_ICONS[idx % FOOD_ICONS.length]}</div>
              }
              {!item.is_available && (
                <div style={{ position: 'absolute', inset: 0, background: 'rgba(250,243,224,0.8)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <span style={{ background: '#8b4513', color: '#fff', padding: '3px 10px', borderRadius: '4px', fontSize: '0.7rem', fontWeight: 700, fontFamily: 'system-ui' }}>SOLD OUT</span>
                </div>
              )}
            </div>
            <div style={{ padding: '10px 10px 12px' }}>
              <h3 style={{ margin: '0 0 3px', fontSize: '0.85rem', fontWeight: 800, color: '#2d1f0e', lineHeight: 1.3, letterSpacing: '0.02em' }}>
                {item.name.toUpperCase()}
              </h3>
              {item.description && (
                <p style={{ margin: '0 0 8px', fontSize: '0.72rem', color: '#9a7a5a', lineHeight: 1.5, fontFamily: 'system-ui',
                  display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' } as React.CSSProperties}>
                  {item.description}
                </p>
              )}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '6px' }}>
                <span style={{ fontSize: '0.9rem', fontWeight: 800, color: '#2d1f0e', fontFamily: 'system-ui' }}>
                  ${Number(item.price).toFixed(2)}
                </span>
                {item.is_available && <button className="org-add-btn">＋ Add</button>}
              </div>
            </div>
          </div>
        ))}
        {activeItems.length === 0 && (
          <div style={{ gridColumn: '1/-1', textAlign: 'center', padding: '40px 0', color: '#9a8a78', fontFamily: 'system-ui', fontSize: '0.9rem' }}>No items found.</div>
        )}
      </div>

      {/* ── Bottom nav ── */}
      {categories.length > 0 && (
        <div style={{ position: 'fixed', bottom: 0, left: 0, right: 0, background: accent, padding: '8px 8px 12px', display: 'flex', gap: '4px', zIndex: 50, boxShadow: '0 -2px 16px rgba(0,0,0,0.15)' }}>
          <button className={`org-tab${activeCategory === 'all' ? ' active' : ''}`} onClick={() => setActiveCategory('all')}
            style={{ color: activeCategory === 'all' ? '#fff' : 'rgba(255,255,255,0.6)' }}>
            <span style={{ fontSize: '1.1rem' }}>🏠</span>
            <span style={{ fontSize: '0.6rem', fontFamily: 'system-ui', fontWeight: 700 }}>HOME</span>
          </button>
          {categories.slice(0, 4).map((cat, i) => {
            const active = activeCategory === cat.id;
            return (
              <button key={cat.id} className={`org-tab${active ? ' active' : ''}`} onClick={() => setActiveCategory(cat.id)}
                style={{ color: active ? '#fff' : 'rgba(255,255,255,0.6)' }}>
                <span style={{ fontSize: '1.1rem' }}>{FOOD_ICONS[(i + 1) % FOOD_ICONS.length]}</span>
                <span style={{ fontSize: '0.6rem', fontFamily: 'system-ui', fontWeight: 700, maxWidth: '52px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {cat.name.toUpperCase()}
                </span>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}

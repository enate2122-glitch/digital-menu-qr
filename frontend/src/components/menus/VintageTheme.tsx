// Theme: Vintage — Parchment paper, sepia tones, aged texture
import { useState } from 'react';
import type { MenuData } from './types';

function optimizeImage(url: string | null, width = 400): string | null {
  if (!url) return null;
  if (url.includes('cloudinary.com')) return url.replace(/\/upload\//, `/upload/w_${width},q_auto,f_auto/`);
  return url;
}

const FOOD_ICONS = ['🍽️','🥗','🍖','🍜','🥩','🍕','🥘','🍣','🥞','🍔'];
const BG = '#f2e8d0';
const BG2 = '#e8d9b8';
const INK = '#2c1a0e';

export default function VintageTheme({ data, activeCategory, setActiveCategory }: {
  data: MenuData; activeCategory: string; setActiveCategory: (id: string) => void;
}) {
  const { restaurant, categories } = data;
  const accent = restaurant.primary_color || '#7a3b1e';
  const [search, setSearch] = useState('');

  const allItems = categories.flatMap(c => c.items);
  const baseItems = activeCategory === 'all' ? allItems : categories.find(c => c.id === activeCategory)?.items ?? [];
  const activeItems = search.trim()
    ? baseItems.filter(i => i.name.toLowerCase().includes(search.toLowerCase()) || i.description?.toLowerCase().includes(search.toLowerCase()))
    : baseItems;

  const activeCatName = activeCategory === 'all' ? 'All Items' : (categories.find(c => c.id === activeCategory)?.name ?? '');

  return (
    <div style={{ minHeight: '100vh', background: BG, fontFamily: "'Georgia', serif", color: INK, paddingBottom: '80px',
      backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='400'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3CfeColorMatrix type='saturate' values='0'/%3E%3C/filter%3E%3Crect width='400' height='400' filter='url(%23n)' opacity='0.04'/%3E%3C/svg%3E")` }}>
      <style>{`
        .vin-add-btn { background: ${accent}; color: #f2e8d0; border: none; border-radius: 4px; padding: 5px 12px; font-size: 0.78rem; font-weight: 700; cursor: pointer; font-family: system-ui; display: flex; align-items: center; gap: 4px; white-space: nowrap; letter-spacing: 0.04em; }
        .vin-add-btn:hover { opacity: 0.85; }
        .vin-card { background: #fffdf5; border-radius: 6px; overflow: hidden; box-shadow: 2px 3px 0 #c4a87a, 0 1px 8px rgba(44,26,14,0.1); border: 1px solid #d4b896; transition: all 0.2s; }
        .vin-card:hover { transform: translateY(-2px); box-shadow: 3px 5px 0 #b8956a, 0 4px 16px rgba(44,26,14,0.15); }
        .vin-pill { cursor: pointer; border-radius: 4px; padding: 5px 14px; font-size: 0.72rem; font-weight: 700; font-family: system-ui; border: 1.5px solid; transition: all 0.15s; white-space: nowrap; letter-spacing: 0.06em; }
        .vin-search { width: 100%; padding: 9px 14px 9px 36px; border: 1.5px solid #c4a87a; border-radius: 4px; background: #fffdf5; font-size: 0.85rem; font-family: system-ui; color: ${INK}; outline: none; }
        .vin-search:focus { border-color: ${accent}; box-shadow: 0 0 0 2px ${accent}22; }
        .vin-tab { display: flex; flex-direction: column; align-items: center; gap: 2px; padding: 6px 8px; cursor: pointer; border-radius: 4px; transition: all 0.15s; flex: 1; border: none; background: none; }
        .vin-tab.active { background: ${accent}22; }
      `}</style>

      {/* ── Header ── */}
      <div style={{ background: BG2, borderBottom: `2px solid ${accent}`, padding: '24px 20px 16px', textAlign: 'center', position: 'relative' }}>
        {/* Corner ornaments */}
        <div style={{ position: 'absolute', top: '8px', left: '10px', fontSize: '1rem', color: accent, opacity: 0.5 }}>✦</div>
        <div style={{ position: 'absolute', top: '8px', right: '10px', fontSize: '1rem', color: accent, opacity: 0.5 }}>✦</div>

        {restaurant.cover_image_url && (
          <div style={{ position: 'relative', height: '130px', borderRadius: '4px', overflow: 'hidden', marginBottom: '14px', border: `2px solid ${accent}`, filter: 'sepia(30%)' }}>
            <img src={optimizeImage(restaurant.cover_image_url, 800)!} alt="cover" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            <div style={{ position: 'absolute', inset: 0, background: `linear-gradient(to bottom, transparent 50%, ${BG2}cc 100%)` }} />
          </div>
        )}

        {restaurant.logo_url && (
          <img src={optimizeImage(restaurant.logo_url, 128)!} alt="logo"
            style={{ width: '56px', height: '56px', borderRadius: '50%', objectFit: 'cover', border: `3px solid ${accent}`, display: 'block', margin: '0 auto 10px', filter: 'sepia(20%)', boxShadow: `2px 2px 0 ${accent}66` }} />
        )}

        {/* Decorative line */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', marginBottom: '6px' }}>
          <div style={{ height: '1px', width: '30px', background: accent }} />
          <span style={{ color: accent, fontSize: '0.7rem' }}>✦</span>
          <div style={{ height: '1px', width: '30px', background: accent }} />
        </div>

        <h1 style={{ fontSize: 'clamp(1.5rem, 6vw, 2rem)', fontWeight: 800, margin: '0 0 2px', letterSpacing: '0.1em', color: INK }}>
          {restaurant.name.toUpperCase()}
        </h1>
        <p style={{ fontSize: '0.65rem', color: '#8a6a4a', margin: '0 0 8px', fontFamily: 'system-ui', letterSpacing: '0.2em', textTransform: 'uppercase' }}>
          {restaurant.address || 'Est. 2024'}
        </p>
        {restaurant.phone && (
          <a href={`tel:${restaurant.phone}`} style={{ fontSize: '0.72rem', color: accent, fontFamily: 'system-ui', textDecoration: 'none', fontWeight: 600 }}>{restaurant.phone}</a>
        )}

        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', marginTop: '10px' }}>
          <div style={{ height: '1px', flex: 1, background: `${accent}44` }} />
          <span style={{ color: accent, fontSize: '0.7rem' }}>❧</span>
          <div style={{ height: '1px', flex: 1, background: `${accent}44` }} />
        </div>
      </div>

      {/* ── Search ── */}
      <div style={{ padding: '12px 16px 0' }}>
        <div style={{ position: 'relative' }}>
          <span style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', fontSize: '0.85rem', color: '#a08060', pointerEvents: 'none' }}>🔍</span>
          <input className="vin-search" placeholder="Search menu…" value={search} onChange={e => setSearch(e.target.value)} />
        </div>
      </div>

      {/* ── Category pills ── */}
      <div style={{ overflowX: 'auto', padding: '12px 16px', scrollbarWidth: 'none' }}>
        <div style={{ display: 'flex', gap: '8px', minWidth: 'max-content' }}>
          {[{ id: 'all', name: 'All' }, ...categories].map(cat => {
            const active = activeCategory === cat.id;
            return (
              <button key={cat.id} className="vin-pill"
                style={{ background: active ? accent : 'transparent', color: active ? BG : '#8a6a4a', borderColor: active ? accent : '#c4a87a' }}
                onClick={() => setActiveCategory(cat.id)}>
                {cat.name.toUpperCase()}
              </button>
            );
          })}
        </div>
      </div>

      {/* ── Section title ── */}
      <div style={{ padding: '0 16px 12px' }}>
        <h2 style={{ fontSize: '1.2rem', fontWeight: 800, color: INK, margin: '0 0 4px', letterSpacing: '0.06em' }}>
          {activeCatName.toUpperCase()}
        </h2>
        <svg width="80" height="8" viewBox="0 0 80 8" style={{ display: 'block' }}>
          <path d="M2 6 Q20 2 40 5 Q60 8 78 3" stroke={accent} strokeWidth="2" fill="none" strokeLinecap="round" strokeDasharray="4 2" />
        </svg>
      </div>

      {/* ── 2-column grid ── */}
      <div style={{ padding: '0 12px', display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '12px', maxWidth: '700px', margin: '0 auto' }}>
        {activeItems.map((item, idx) => (
          <div key={item.id} className="vin-card" style={{ opacity: item.is_available ? 1 : 0.6 }}>
            <div style={{ position: 'relative', height: '130px', background: BG2, filter: 'sepia(15%)' }}>
              {item.image_url
                ? <img src={optimizeImage(item.image_url, 400)!} alt={item.name} style={{ width: '100%', height: '100%', objectFit: 'cover', filter: 'sepia(15%)' }} />
                : <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '2.5rem' }}>{FOOD_ICONS[idx % FOOD_ICONS.length]}</div>
              }
              {!item.is_available && (
                <div style={{ position: 'absolute', inset: 0, background: `${BG}bb`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <span style={{ background: accent, color: BG, padding: '3px 10px', borderRadius: '3px', fontSize: '0.7rem', fontWeight: 700, fontFamily: 'system-ui', letterSpacing: '0.08em' }}>SOLD OUT</span>
                </div>
              )}
            </div>
            <div style={{ padding: '10px 10px 12px' }}>
              <h3 style={{ margin: '0 0 3px', fontSize: '0.85rem', fontWeight: 800, color: INK, lineHeight: 1.3, letterSpacing: '0.04em' }}>
                {item.name.toUpperCase()}
              </h3>
              {item.description && (
                <p style={{ margin: '0 0 8px', fontSize: '0.72rem', color: '#8a6a4a', lineHeight: 1.5, fontFamily: 'system-ui',
                  display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' } as React.CSSProperties}>
                  {item.description}
                </p>
              )}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '6px' }}>
                <span style={{ fontSize: '0.9rem', fontWeight: 800, color: INK, fontFamily: 'system-ui' }}>
                  ${Number(item.price).toFixed(2)}
                </span>
                {item.is_available && <button className="vin-add-btn">＋ Add</button>}
              </div>
            </div>
          </div>
        ))}
        {activeItems.length === 0 && (
          <div style={{ gridColumn: '1/-1', textAlign: 'center', padding: '40px 0', color: '#8a6a4a', fontFamily: 'system-ui', fontSize: '0.9rem' }}>No items found.</div>
        )}
      </div>

      {/* ── Bottom nav ── */}
      {categories.length > 0 && (
        <div style={{ position: 'fixed', bottom: 0, left: 0, right: 0, background: BG2, borderTop: `2px solid ${accent}`, padding: '8px 8px 12px', display: 'flex', gap: '4px', zIndex: 50 }}>
          <button className={`vin-tab${activeCategory === 'all' ? ' active' : ''}`} onClick={() => setActiveCategory('all')}
            style={{ color: activeCategory === 'all' ? accent : '#8a6a4a' }}>
            <span style={{ fontSize: '1.1rem' }}>🏠</span>
            <span style={{ fontSize: '0.6rem', fontFamily: 'system-ui', fontWeight: 700, letterSpacing: '0.04em' }}>HOME</span>
          </button>
          {categories.slice(0, 4).map((cat, i) => {
            const active = activeCategory === cat.id;
            return (
              <button key={cat.id} className={`vin-tab${active ? ' active' : ''}`} onClick={() => setActiveCategory(cat.id)}
                style={{ color: active ? accent : '#8a6a4a' }}>
                <span style={{ fontSize: '1.1rem' }}>{FOOD_ICONS[(i + 1) % FOOD_ICONS.length]}</span>
                <span style={{ fontSize: '0.6rem', fontFamily: 'system-ui', fontWeight: 700, letterSpacing: '0.04em', maxWidth: '52px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
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

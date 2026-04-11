// Theme: Neomorphic — Dark charcoal, teal accents, soft shadows
import { useState } from 'react';
import type { MenuData } from './types';

function optimizeImage(url: string | null, width = 400): string | null {
  if (!url) return null;
  if (url.includes('cloudinary.com')) return url.replace(/\/upload\//, `/upload/w_${width},q_auto,f_auto/`);
  return url;
}

const FOOD_ICONS = ['🍽️','🥗','🍖','🍜','🥩','🍕','🥘','🍣','🥞','🍔'];
const BG = '#1a1f2e';
const BG2 = '#222838';
const TEAL = '#00c9a7';

export default function NeomorphicTheme({ data, activeCategory, setActiveCategory }: {
  data: MenuData; activeCategory: string; setActiveCategory: (id: string) => void;
}) {
  const { restaurant, categories } = data;
  const accent = restaurant.primary_color || TEAL;
  const [search, setSearch] = useState('');

  const allItems = categories.flatMap(c => c.items);
  const baseItems = activeCategory === 'all' ? allItems : categories.find(c => c.id === activeCategory)?.items ?? [];
  const activeItems = search.trim()
    ? baseItems.filter(i => i.name.toLowerCase().includes(search.toLowerCase()) || i.description?.toLowerCase().includes(search.toLowerCase()))
    : baseItems;

  const activeCatName = activeCategory === 'all' ? 'All Items' : (categories.find(c => c.id === activeCategory)?.name ?? '');

  const neoShadow = `4px 4px 10px rgba(0,0,0,0.4), -2px -2px 8px rgba(255,255,255,0.04)`;
  const neoInset = `inset 2px 2px 6px rgba(0,0,0,0.4), inset -1px -1px 4px rgba(255,255,255,0.04)`;

  return (
    <div style={{ minHeight: '100vh', background: BG, fontFamily: 'system-ui, sans-serif', color: '#e0e6f0', paddingBottom: '80px' }}>
      <style>{`
        .neo-add-btn { background: ${accent}; color: #0d1117; border: none; border-radius: 8px; padding: 5px 12px; font-size: 0.78rem; font-weight: 800; cursor: pointer; display: flex; align-items: center; gap: 4px; white-space: nowrap; letter-spacing: 0.03em; }
        .neo-add-btn:hover { filter: brightness(1.1); }
        .neo-card { background: ${BG2}; border-radius: 16px; overflow: hidden; transition: all 0.2s; border: 1px solid rgba(255,255,255,0.06); }
        .neo-card:hover { transform: translateY(-2px); box-shadow: 6px 6px 16px rgba(0,0,0,0.5), -2px -2px 8px rgba(255,255,255,0.04); }
        .neo-pill { cursor: pointer; border-radius: 8px; padding: 6px 14px; font-size: 0.75rem; font-weight: 700; border: none; transition: all 0.15s; white-space: nowrap; letter-spacing: 0.04em; }
        .neo-search { width: 100%; padding: 9px 14px 9px 36px; border: none; border-radius: 12px; background: ${BG2}; font-size: 0.85rem; color: #e0e6f0; outline: none; }
        .neo-search::placeholder { color: #4a5568; }
        .neo-search:focus { box-shadow: 0 0 0 2px ${accent}55; }
        .neo-tab { display: flex; flex-direction: column; align-items: center; gap: 2px; padding: 6px 8px; cursor: pointer; border-radius: 10px; transition: all 0.15s; flex: 1; border: none; background: none; }
        .neo-tab.active { background: rgba(255,255,255,0.08); }
      `}</style>

      {/* ── Header ── */}
      <div style={{ background: BG, padding: '28px 20px 0', textAlign: 'center' }}>
        {restaurant.cover_image_url && (
          <div style={{ position: 'relative', height: '150px', borderRadius: '16px', overflow: 'hidden', marginBottom: '16px', boxShadow: neoShadow }}>
            <img src={optimizeImage(restaurant.cover_image_url, 800)!} alt="cover" style={{ width: '100%', height: '100%', objectFit: 'cover', filter: 'brightness(0.8)' }} />
            <div style={{ position: 'absolute', inset: 0, background: `linear-gradient(to bottom, transparent 40%, ${BG}cc 100%)` }} />
          </div>
        )}

        {/* Top bar: logo + name + profile icon */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
          {restaurant.logo_url
            ? <img src={optimizeImage(restaurant.logo_url, 128)!} alt="logo" style={{ width: '40px', height: '40px', borderRadius: '50%', objectFit: 'cover', border: `2px solid ${accent}`, boxShadow: neoShadow }} />
            : <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: BG2, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.2rem', boxShadow: neoShadow }}>🍽️</div>
          }
          <div style={{ flex: 1, textAlign: 'center' }}>
            <h1 style={{ fontSize: 'clamp(1.3rem, 5vw, 1.8rem)', fontWeight: 900, margin: 0, letterSpacing: '0.1em', color: '#fff', textShadow: `0 0 20px ${accent}44` }}>
              {restaurant.name.toUpperCase()}
            </h1>
            {restaurant.address && (
              <p style={{ fontSize: '0.68rem', color: '#4a5568', margin: '2px 0 0', letterSpacing: '0.08em' }}>{restaurant.address}</p>
            )}
          </div>
          <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: BG2, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1rem', boxShadow: neoShadow, cursor: 'pointer' }}>
            {restaurant.phone
              ? <a href={`tel:${restaurant.phone}`} style={{ textDecoration: 'none', fontSize: '1rem' }}>📞</a>
              : '👤'}
          </div>
        </div>

        {/* Search */}
        <div style={{ position: 'relative', maxWidth: '480px', margin: '0 auto 20px', boxShadow: neoInset, borderRadius: '12px' }}>
          <span style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', fontSize: '0.85rem', color: '#4a5568', pointerEvents: 'none' }}>🔍</span>
          <input className="neo-search" placeholder="Search menu…" value={search} onChange={e => setSearch(e.target.value)} />
        </div>
      </div>

      {/* ── Category pills ── */}
      <div style={{ overflowX: 'auto', padding: '0 16px 16px', scrollbarWidth: 'none' }}>
        <div style={{ display: 'flex', gap: '8px', minWidth: 'max-content' }}>
          {[{ id: 'all', name: 'All' }, ...categories].map(cat => {
            const active = activeCategory === cat.id;
            return (
              <button key={cat.id} className="neo-pill"
                style={{ background: active ? accent : BG2, color: active ? '#0d1117' : '#8899aa', boxShadow: active ? `0 0 12px ${accent}66` : neoShadow }}
                onClick={() => setActiveCategory(cat.id)}>
                {cat.name.toUpperCase()}
              </button>
            );
          })}
        </div>
      </div>

      {/* ── Section title ── */}
      <div style={{ padding: '0 16px 12px' }}>
        <h2 style={{ fontSize: '1.2rem', fontWeight: 800, color: accent, margin: 0, letterSpacing: '0.06em', textShadow: `0 0 16px ${accent}55` }}>
          {activeCatName.toUpperCase()}
        </h2>
      </div>

      {/* ── 2-column grid ── */}
      <div style={{ padding: '0 12px', display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '12px', maxWidth: '700px', margin: '0 auto' }}>
        {activeItems.map((item, idx) => (
          <div key={item.id} className="neo-card" style={{ opacity: item.is_available ? 1 : 0.5, boxShadow: neoShadow }}>
            <div style={{ position: 'relative', height: '130px', background: '#2a3040' }}>
              {item.image_url
                ? <img src={optimizeImage(item.image_url, 400)!} alt={item.name} style={{ width: '100%', height: '100%', objectFit: 'cover', filter: 'brightness(0.9)' }} />
                : <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '2.5rem' }}>{FOOD_ICONS[idx % FOOD_ICONS.length]}</div>
              }
              {!item.is_available && (
                <div style={{ position: 'absolute', inset: 0, background: 'rgba(26,31,46,0.8)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <span style={{ background: '#e53e3e', color: '#fff', padding: '3px 10px', borderRadius: '4px', fontSize: '0.7rem', fontWeight: 700 }}>SOLD OUT</span>
                </div>
              )}
            </div>
            <div style={{ padding: '10px 10px 12px' }}>
              <h3 style={{ margin: '0 0 3px', fontSize: '0.82rem', fontWeight: 800, color: '#e0e6f0', lineHeight: 1.3, letterSpacing: '0.03em' }}>
                {item.name.toUpperCase()}
              </h3>
              {item.description && (
                <p style={{ margin: '0 0 8px', fontSize: '0.7rem', color: '#6b7a8d', lineHeight: 1.5,
                  display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' } as React.CSSProperties}>
                  {item.description}
                </p>
              )}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '6px' }}>
                <span style={{ fontSize: '0.9rem', fontWeight: 800, color: accent }}>
                  ${Number(item.price).toFixed(2)}
                </span>
                {item.is_available && <button className="neo-add-btn">Add +</button>}
              </div>
            </div>
          </div>
        ))}
        {activeItems.length === 0 && (
          <div style={{ gridColumn: '1/-1', textAlign: 'center', padding: '40px 0', color: '#4a5568', fontSize: '0.9rem' }}>No items found.</div>
        )}
      </div>

      {/* ── Bottom nav ── */}
      {categories.length > 0 && (
        <div style={{ position: 'fixed', bottom: 0, left: 0, right: 0, background: BG2, padding: '8px 8px 12px', display: 'flex', gap: '4px', zIndex: 50, borderTop: `1px solid rgba(255,255,255,0.06)`, boxShadow: '0 -4px 20px rgba(0,0,0,0.4)' }}>
          <button className={`neo-tab${activeCategory === 'all' ? ' active' : ''}`} onClick={() => setActiveCategory('all')}
            style={{ color: activeCategory === 'all' ? accent : '#4a5568' }}>
            <span style={{ fontSize: '1.1rem' }}>🏠</span>
            <span style={{ fontSize: '0.6rem', fontWeight: 700, letterSpacing: '0.04em' }}>HOME</span>
          </button>
          {categories.slice(0, 4).map((cat, i) => {
            const active = activeCategory === cat.id;
            return (
              <button key={cat.id} className={`neo-tab${active ? ' active' : ''}`} onClick={() => setActiveCategory(cat.id)}
                style={{ color: active ? accent : '#4a5568' }}>
                <span style={{ fontSize: '1.1rem' }}>{FOOD_ICONS[(i + 1) % FOOD_ICONS.length]}</span>
                <span style={{ fontSize: '0.6rem', fontWeight: 700, letterSpacing: '0.04em', maxWidth: '52px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
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

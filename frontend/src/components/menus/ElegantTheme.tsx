// Theme: Elegant — Luma-style (cream, serif, 2-col grid, bottom nav)
import { useState } from 'react';
import type { MenuData } from './types';

function optimizeImage(url: string | null, width = 400): string | null {
  if (!url) return null;
  if (url.includes('cloudinary.com')) return url.replace(/\/upload\//, `/upload/w_${width},q_auto,f_auto/`);
  return url;
}

const FOOD_ICONS = ['🍽️','🥗','🍖','🍜','🥩','🍕','🥘','🍣','🥞','🍔'];

export default function ElegantTheme({ data, activeCategory, setActiveCategory }: {
  data: MenuData; activeCategory: string; setActiveCategory: (id: string) => void;
}) {
  const { restaurant, categories } = data;
  const accent = restaurant.primary_color || '#3d6b3f'; // dark green like Luma
  const [search, setSearch] = useState('');

  const allItems = categories.flatMap(c => c.items);
  const baseItems = activeCategory === 'all' ? allItems : categories.find(c => c.id === activeCategory)?.items ?? [];
  const activeItems = search.trim()
    ? baseItems.filter(i => i.name.toLowerCase().includes(search.toLowerCase()) || i.description?.toLowerCase().includes(search.toLowerCase()))
    : baseItems;

  const activeCatName = activeCategory === 'all' ? 'All Items' : (categories.find(c => c.id === activeCategory)?.name ?? '');

  return (
    <div style={{ minHeight: '100vh', background: '#f5f0e8', fontFamily: "'Georgia', serif", color: '#1a1a1a', paddingBottom: '80px' }}>
      <style>{`
        .el-add-btn {
          background: ${accent};
          color: #fff;
          border: none;
          border-radius: 20px;
          padding: 5px 12px;
          font-size: 0.78rem;
          font-weight: 700;
          cursor: pointer;
          font-family: system-ui, sans-serif;
          display: flex;
          align-items: center;
          gap: 4px;
          white-space: nowrap;
        }
        .el-add-btn:hover { opacity: 0.85; }
        .el-card:hover { box-shadow: 0 4px 20px rgba(0,0,0,0.12); transform: translateY(-1px); }
        .el-pill { cursor: pointer; border-radius: 20px; padding: 6px 16px; font-size: 0.78rem; font-weight: 700; font-family: system-ui, sans-serif; border: 1.5px solid; transition: all 0.15s; white-space: nowrap; }
        .el-bottom-tab { display: flex; flex-direction: column; align-items: center; gap: 2px; padding: 6px 12px; cursor: pointer; border-radius: 10px; transition: all 0.15s; flex: 1; border: none; background: none; }
        .el-bottom-tab.active { background: ${accent}22; }
        .el-search { width: 100%; padding: 9px 14px 9px 36px; border: 1.5px solid #e0d8cc; border-radius: 24px; background: #fff; font-size: 0.85rem; font-family: system-ui, sans-serif; color: #333; outline: none; }
        .el-search:focus { border-color: ${accent}; }
      `}</style>

      {/* ── Header ── */}
      <div style={{ background: '#f5f0e8', padding: '28px 20px 0', textAlign: 'center' }}>
        {restaurant.cover_image_url && (
          <div style={{ position: 'relative', height: '160px', borderRadius: '16px', overflow: 'hidden', marginBottom: '16px' }}>
            <img src={optimizeImage(restaurant.cover_image_url, 800)!} alt="cover" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to bottom, transparent 40%, rgba(245,240,232,0.9) 100%)' }} />
          </div>
        )}
        {restaurant.logo_url && (
          <img src={optimizeImage(restaurant.logo_url, 128)!} alt="logo"
            style={{ width: '56px', height: '56px', borderRadius: '50%', objectFit: 'cover', border: `3px solid ${accent}`, display: 'block', margin: '0 auto 10px' }} />
        )}
        <h1 style={{ fontSize: 'clamp(1.6rem, 6vw, 2.2rem)', fontWeight: 800, margin: '0 0 2px', letterSpacing: '0.08em', color: '#1a1a1a' }}>
          {restaurant.name.toUpperCase()}
        </h1>
        {(restaurant.address || restaurant.phone) && (
          <p style={{ fontSize: '0.72rem', color: '#888', margin: '0 0 16px', fontFamily: 'system-ui', letterSpacing: '0.05em' }}>
            {restaurant.address && `${restaurant.address}`}
            {restaurant.address && restaurant.phone && ' · '}
            {restaurant.phone && <a href={`tel:${restaurant.phone}`} style={{ color: accent, textDecoration: 'none' }}>{restaurant.phone}</a>}
          </p>
        )}

        {/* Search */}
        <div style={{ position: 'relative', maxWidth: '480px', margin: '0 auto 20px' }}>
          <span style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', fontSize: '0.85rem', color: '#aaa', pointerEvents: 'none' }}>🔍</span>
          <input className="el-search" placeholder="Search menu…" value={search} onChange={e => setSearch(e.target.value)} />
        </div>
      </div>

      {/* ── Category pills ── */}
      <div style={{ overflowX: 'auto', padding: '0 16px 16px', scrollbarWidth: 'none' }}>
        <div style={{ display: 'flex', gap: '8px', minWidth: 'max-content' }}>
          {[{ id: 'all', name: 'All' }, ...categories].map(cat => {
            const active = activeCategory === cat.id;
            return (
              <button key={cat.id} className="el-pill"
                style={{ background: active ? accent : 'transparent', color: active ? '#fff' : '#7a6a55', borderColor: active ? accent : '#c8b89a' }}
                onClick={() => setActiveCategory(cat.id)}>
                {cat.name.toUpperCase()}
              </button>
            );
          })}
        </div>
      </div>

      {/* ── Section title ── */}
      <div style={{ padding: '0 16px 12px' }}>
        <h2 style={{ fontSize: '1.3rem', fontWeight: 800, color: '#1a1a1a', margin: 0, letterSpacing: '0.04em' }}>
          {activeCatName.toUpperCase()}
        </h2>
      </div>

      {/* ── 2-column grid ── */}
      <div style={{ padding: '0 12px', display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '12px', maxWidth: '700px', margin: '0 auto' }}>
        {activeItems.map((item, idx) => (
          <div key={item.id} className="el-card"
            style={{ background: '#fff', borderRadius: '14px', overflow: 'hidden', boxShadow: '0 2px 10px rgba(0,0,0,0.07)', opacity: item.is_available ? 1 : 0.6, transition: 'all 0.2s' }}>
            {/* Image */}
            <div style={{ position: 'relative', height: '130px', background: '#ede8df' }}>
              {item.image_url
                ? <img src={optimizeImage(item.image_url, 400)!} alt={item.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                : <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '2.5rem' }}>{FOOD_ICONS[idx % FOOD_ICONS.length]}</div>
              }
              {!item.is_available && (
                <div style={{ position: 'absolute', inset: 0, background: 'rgba(245,240,232,0.75)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <span style={{ background: '#c0392b', color: '#fff', padding: '3px 10px', borderRadius: '4px', fontSize: '0.7rem', fontWeight: 700, fontFamily: 'system-ui' }}>SOLD OUT</span>
                </div>
              )}
            </div>
            {/* Info */}
            <div style={{ padding: '10px 10px 12px' }}>
              <h3 style={{ margin: '0 0 3px', fontSize: '0.85rem', fontWeight: 800, color: '#1a1a1a', lineHeight: 1.3, letterSpacing: '0.02em' }}>
                {item.name.toUpperCase()}
              </h3>
              {item.description && (
                <p style={{ margin: '0 0 8px', fontSize: '0.72rem', color: '#9a8a78', lineHeight: 1.5, fontFamily: 'system-ui',
                  display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' } as React.CSSProperties}>
                  {item.description}
                </p>
              )}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '6px' }}>
                <span style={{ fontSize: '0.9rem', fontWeight: 800, color: '#1a1a1a', fontFamily: 'system-ui' }}>
                  ${Number(item.price).toFixed(2)}
                </span>
                {item.is_available && (
                  <button className="el-add-btn">＋ Add</button>
                )}
              </div>
            </div>
          </div>
        ))}
        {activeItems.length === 0 && (
          <div style={{ gridColumn: '1/-1', textAlign: 'center', padding: '40px 0', color: '#9a8a78', fontFamily: 'system-ui', fontSize: '0.9rem' }}>
            No items found.
          </div>
        )}
      </div>

      {/* ── Bottom nav ── */}
      {categories.length > 0 && (
        <div style={{ position: 'fixed', bottom: 0, left: 0, right: 0, background: accent, padding: '8px 8px 12px', display: 'flex', gap: '4px', zIndex: 50, boxShadow: '0 -2px 16px rgba(0,0,0,0.15)' }}>
          <button className={`el-bottom-tab${activeCategory === 'all' ? ' active' : ''}`}
            onClick={() => setActiveCategory('all')}
            style={{ color: activeCategory === 'all' ? '#fff' : 'rgba(255,255,255,0.6)' }}>
            <span style={{ fontSize: '1.1rem' }}>🏠</span>
            <span style={{ fontSize: '0.6rem', fontFamily: 'system-ui', fontWeight: 700, letterSpacing: '0.04em' }}>HOME</span>
          </button>
          {categories.slice(0, 4).map((cat, i) => {
            const active = activeCategory === cat.id;
            return (
              <button key={cat.id} className={`el-bottom-tab${active ? ' active' : ''}`}
                onClick={() => setActiveCategory(cat.id)}
                style={{ color: active ? '#fff' : 'rgba(255,255,255,0.6)' }}>
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

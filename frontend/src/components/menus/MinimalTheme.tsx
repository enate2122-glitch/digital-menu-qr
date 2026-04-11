// Theme: Minimal — Clean white, blue accent, top nav bar
import { useState } from 'react';
import type { MenuData } from './types';

function optimizeImage(url: string | null, width = 400): string | null {
  if (!url) return null;
  if (url.includes('cloudinary.com')) return url.replace(/\/upload\//, `/upload/w_${width},q_auto,f_auto/`);
  return url;
}

const FOOD_ICONS = ['🍽️','🥗','🍖','🍜','🥩','🍕','🥘','🍣','🥞','🍔'];

export default function MinimalTheme({ data, activeCategory, setActiveCategory }: {
  data: MenuData; activeCategory: string; setActiveCategory: (id: string) => void;
}) {
  const { restaurant, categories } = data;
  const accent = restaurant.primary_color || '#2563eb';
  const [search, setSearch] = useState('');
  const [menuOpen, setMenuOpen] = useState(false);

  const allItems = categories.flatMap(c => c.items);
  const baseItems = activeCategory === 'all' ? allItems : categories.find(c => c.id === activeCategory)?.items ?? [];
  const activeItems = search.trim()
    ? baseItems.filter(i => i.name.toLowerCase().includes(search.toLowerCase()) || i.description?.toLowerCase().includes(search.toLowerCase()))
    : baseItems;

  const activeCatName = activeCategory === 'all' ? 'All Items' : (categories.find(c => c.id === activeCategory)?.name ?? '');

  return (
    <div style={{ minHeight: '100vh', background: '#ffffff', fontFamily: 'system-ui, sans-serif', color: '#1a1a1a', paddingBottom: '80px' }}>
      <style>{`
        .min-add-btn { background: ${accent}; color: #fff; border: none; border-radius: 20px; padding: 5px 12px; font-size: 0.78rem; font-weight: 700; cursor: pointer; display: flex; align-items: center; gap: 4px; white-space: nowrap; }
        .min-add-btn:hover { opacity: 0.85; }
        .min-card { background: #fff; border-radius: 14px; overflow: hidden; box-shadow: 0 1px 4px rgba(0,0,0,0.08), 0 4px 16px rgba(0,0,0,0.06); transition: all 0.2s; }
        .min-card:hover { box-shadow: 0 4px 20px rgba(0,0,0,0.12); transform: translateY(-1px); }
        .min-pill { cursor: pointer; border-radius: 20px; padding: 5px 14px; font-size: 0.75rem; font-weight: 700; border: 1.5px solid; transition: all 0.15s; white-space: nowrap; }
        .min-search { width: 100%; padding: 9px 14px 9px 36px; border: 1.5px solid #e5e7eb; border-radius: 24px; background: #f9fafb; font-size: 0.85rem; color: #1a1a1a; outline: none; }
        .min-search:focus { border-color: ${accent}; background: #fff; }
        .min-tab { display: flex; flex-direction: column; align-items: center; gap: 2px; padding: 6px 8px; cursor: pointer; border-radius: 10px; transition: all 0.15s; flex: 1; border: none; background: none; }
        .min-tab.active { background: ${accent}18; }
        .min-drawer { position: fixed; top: 0; left: 0; bottom: 0; width: 240px; background: #fff; z-index: 200; box-shadow: 4px 0 24px rgba(0,0,0,0.12); padding: 24px 0; transform: translateX(-100%); transition: transform 0.25s; }
        .min-drawer.open { transform: translateX(0); }
        .min-overlay { position: fixed; inset: 0; background: rgba(0,0,0,0.3); z-index: 199; }
      `}</style>

      {/* Drawer overlay */}
      {menuOpen && <div className="min-overlay" onClick={() => setMenuOpen(false)} />}

      {/* Side drawer */}
      <div className={`min-drawer${menuOpen ? ' open' : ''}`}>
        <div style={{ padding: '0 20px 20px', borderBottom: '1px solid #f0f0f0', marginBottom: '12px' }}>
          {restaurant.logo_url && (
            <img src={optimizeImage(restaurant.logo_url, 128)!} alt="logo"
              style={{ width: '48px', height: '48px', borderRadius: '50%', objectFit: 'cover', border: `2px solid ${accent}`, marginBottom: '10px' }} />
          )}
          <div style={{ fontWeight: 800, fontSize: '1rem', color: '#1a1a1a' }}>{restaurant.name}</div>
          {restaurant.address && <div style={{ fontSize: '0.72rem', color: '#9ca3af', marginTop: '2px' }}>{restaurant.address}</div>}
        </div>
        {[{ id: 'all', name: 'All Items' }, ...categories].map(cat => (
          <button key={cat.id} onClick={() => { setActiveCategory(cat.id); setMenuOpen(false); }}
            style={{ width: '100%', padding: '12px 20px', border: 'none', background: activeCategory === cat.id ? `${accent}12` : 'transparent', color: activeCategory === cat.id ? accent : '#374151', fontWeight: activeCategory === cat.id ? 700 : 500, fontSize: '0.9rem', textAlign: 'left', cursor: 'pointer', borderLeft: activeCategory === cat.id ? `3px solid ${accent}` : '3px solid transparent' }}>
            {cat.name}
          </button>
        ))}
      </div>

      {/* ── Top nav ── */}
      <div style={{ background: '#fff', borderBottom: '1px solid #f0f0f0', padding: '0 16px', position: 'sticky', top: 0, zIndex: 100, boxShadow: '0 1px 8px rgba(0,0,0,0.06)' }}>
        {restaurant.cover_image_url && (
          <div style={{ height: '140px', margin: '0 -16px', overflow: 'hidden', position: 'relative' }}>
            <img src={optimizeImage(restaurant.cover_image_url, 800)!} alt="cover" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to bottom, transparent 50%, rgba(255,255,255,0.95) 100%)' }} />
          </div>
        )}
        <div style={{ display: 'flex', alignItems: 'center', height: '56px', gap: '12px' }}>
          <button onClick={() => setMenuOpen(true)} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '4px', color: '#374151', fontSize: '1.2rem' }}>☰</button>
          <div style={{ flex: 1, textAlign: 'center' }}>
            <div style={{ fontWeight: 800, fontSize: '1.1rem', color: '#1a1a1a', letterSpacing: '0.04em' }}>{restaurant.name.toUpperCase()}</div>
            {restaurant.address && <div style={{ fontSize: '0.65rem', color: '#9ca3af', letterSpacing: '0.06em' }}>{restaurant.address}</div>}
          </div>
          <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: `${accent}15`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1rem', cursor: 'pointer' }}>
            {restaurant.phone
              ? <a href={`tel:${restaurant.phone}`} style={{ textDecoration: 'none', fontSize: '1rem' }}>📞</a>
              : '👤'}
          </div>
        </div>
      </div>

      {/* ── Search ── */}
      <div style={{ padding: '12px 16px 0' }}>
        <div style={{ position: 'relative' }}>
          <span style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', fontSize: '0.85rem', color: '#9ca3af', pointerEvents: 'none' }}>🔍</span>
          <input className="min-search" placeholder="Search menu…" value={search} onChange={e => setSearch(e.target.value)} />
        </div>
      </div>

      {/* ── Category pills ── */}
      <div style={{ overflowX: 'auto', padding: '12px 16px', scrollbarWidth: 'none' }}>
        <div style={{ display: 'flex', gap: '8px', minWidth: 'max-content' }}>
          {[{ id: 'all', name: 'All' }, ...categories].map(cat => {
            const active = activeCategory === cat.id;
            return (
              <button key={cat.id} className="min-pill"
                style={{ background: active ? accent : '#fff', color: active ? '#fff' : '#6b7280', borderColor: active ? accent : '#e5e7eb' }}
                onClick={() => setActiveCategory(cat.id)}>
                {cat.name.toUpperCase()}
              </button>
            );
          })}
        </div>
      </div>

      {/* ── Section title ── */}
      <div style={{ padding: '4px 16px 12px' }}>
        <h2 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#1a1a1a', margin: 0 }}>{activeCatName.toUpperCase()}</h2>
      </div>

      {/* ── 2-column grid ── */}
      <div style={{ padding: '0 12px', display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '12px', maxWidth: '700px', margin: '0 auto' }}>
        {activeItems.map((item, idx) => (
          <div key={item.id} className="min-card" style={{ opacity: item.is_available ? 1 : 0.6 }}>
            <div style={{ position: 'relative', height: '130px', background: '#f3f4f6' }}>
              {item.image_url
                ? <img src={optimizeImage(item.image_url, 400)!} alt={item.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                : <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '2.5rem' }}>{FOOD_ICONS[idx % FOOD_ICONS.length]}</div>
              }
              {!item.is_available && (
                <div style={{ position: 'absolute', inset: 0, background: 'rgba(255,255,255,0.75)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <span style={{ background: '#ef4444', color: '#fff', padding: '3px 10px', borderRadius: '4px', fontSize: '0.7rem', fontWeight: 700 }}>SOLD OUT</span>
                </div>
              )}
            </div>
            <div style={{ padding: '10px 10px 12px' }}>
              <h3 style={{ margin: '0 0 3px', fontSize: '0.85rem', fontWeight: 800, color: '#1a1a1a', lineHeight: 1.3 }}>
                {item.name.toUpperCase()}
              </h3>
              {item.description && (
                <p style={{ margin: '0 0 8px', fontSize: '0.72rem', color: '#6b7280', lineHeight: 1.5,
                  display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' } as React.CSSProperties}>
                  {item.description}
                </p>
              )}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '6px' }}>
                <span style={{ fontSize: '0.9rem', fontWeight: 800, color: accent }}>${Number(item.price).toFixed(2)}</span>
                {item.is_available && <button className="min-add-btn">＋ Add</button>}
              </div>
            </div>
          </div>
        ))}
        {activeItems.length === 0 && (
          <div style={{ gridColumn: '1/-1', textAlign: 'center', padding: '40px 0', color: '#9ca3af', fontSize: '0.9rem' }}>No items found.</div>
        )}
      </div>

      {/* ── Bottom nav ── */}
      {categories.length > 0 && (
        <div style={{ position: 'fixed', bottom: 0, left: 0, right: 0, background: '#fff', borderTop: '1px solid #f0f0f0', padding: '8px 8px 12px', display: 'flex', gap: '4px', zIndex: 50, boxShadow: '0 -2px 12px rgba(0,0,0,0.06)' }}>
          <button className={`min-tab${activeCategory === 'all' ? ' active' : ''}`} onClick={() => setActiveCategory('all')}
            style={{ color: activeCategory === 'all' ? accent : '#9ca3af' }}>
            <span style={{ fontSize: '1.1rem' }}>🏠</span>
            <span style={{ fontSize: '0.6rem', fontWeight: 700 }}>HOME</span>
          </button>
          {categories.slice(0, 4).map((cat, i) => {
            const active = activeCategory === cat.id;
            return (
              <button key={cat.id} className={`min-tab${active ? ' active' : ''}`} onClick={() => setActiveCategory(cat.id)}
                style={{ color: active ? accent : '#9ca3af' }}>
                <span style={{ fontSize: '1.1rem' }}>{FOOD_ICONS[(i + 1) % FOOD_ICONS.length]}</span>
                <span style={{ fontSize: '0.6rem', fontWeight: 700, maxWidth: '52px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
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

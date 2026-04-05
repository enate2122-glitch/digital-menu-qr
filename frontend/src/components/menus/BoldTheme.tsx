// Theme: Bold Street Food (vibrant, high contrast, fun)
import type { MenuData } from './types';

export default function BoldTheme({ data, activeCategory, setActiveCategory }: {
  data: MenuData; activeCategory: string; setActiveCategory: (id: string) => void;
}) {
  const { restaurant, categories } = data;
  const accent = restaurant.primary_color || '#ff3d00';
  const allItems = categories.flatMap(c => c.items);
  const activeItems = activeCategory === 'all' ? allItems : categories.find(c => c.id === activeCategory)?.items ?? [];

  return (
    <div style={{ minHeight: '100vh', background: '#111', fontFamily: 'system-ui, sans-serif' }}>
      {/* Header */}
      <div style={{ background: accent, padding: '24px 20px', display: 'flex', alignItems: 'center', gap: '16px' }}>
        {restaurant.logo_url
          ? <img src={restaurant.logo_url} alt="logo" style={{ width: '56px', height: '56px', borderRadius: '8px', objectFit: 'cover', border: '3px solid rgba(255,255,255,0.3)', flexShrink: 0 }} />
          : <div style={{ width: '56px', height: '56px', borderRadius: '8px', background: 'rgba(0,0,0,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.8rem', flexShrink: 0 }}>🍔</div>}
        <div>
          <h1 style={{ color: '#fff', fontSize: 'clamp(1.4rem, 5vw, 2rem)', fontWeight: 900, margin: '0 0 2px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{restaurant.name}</h1>
          {restaurant.address && <p style={{ color: 'rgba(255,255,255,0.8)', fontSize: '0.78rem', margin: 0 }}>📍 {restaurant.address}</p>}
        </div>
      </div>
      {/* Tabs */}
      <div style={{ background: '#1a1a1a', overflowX: 'auto', padding: '0 16px' }}>
        <div style={{ display: 'flex', gap: '4px', minWidth: 'max-content', padding: '10px 0' }}>
          {[{ id: 'all', name: 'All' }, ...categories].map(cat => (
            <button key={cat.id} onClick={() => setActiveCategory(cat.id)}
              style={{ padding: '8px 16px', border: 'none', cursor: 'pointer', fontSize: '0.8rem', fontWeight: 800, background: activeCategory === cat.id ? accent : '#2a2a2a', color: '#fff', borderRadius: '6px', textTransform: 'uppercase', letterSpacing: '0.05em', transition: 'all 0.15s', whiteSpace: 'nowrap' }}>
              {cat.name}
            </button>
          ))}
        </div>
      </div>
      {/* Grid */}
      <div style={{ maxWidth: '900px', margin: '0 auto', padding: '20px 16px', display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '14px' }}>
        {activeItems.map(item => (
          <div key={item.id} style={{ background: '#1a1a1a', borderRadius: '10px', overflow: 'hidden', border: `2px solid ${item.is_available ? '#2a2a2a' : '#333'}`, opacity: item.is_available ? 1 : 0.5, position: 'relative' }}>
            <div style={{ position: 'relative', height: '170px' }}>
              {item.image_url ? <img src={item.image_url} alt={item.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                : <div style={{ width: '100%', height: '100%', background: '#2a2a2a', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '3rem' }}>🍔</div>}
              <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, background: 'linear-gradient(transparent, rgba(0,0,0,0.8))', padding: '20px 12px 10px' }}>
                <span style={{ background: accent, color: '#fff', padding: '4px 10px', borderRadius: '4px', fontSize: '0.9rem', fontWeight: 900 }}>${Number(item.price).toFixed(2)}</span>
              </div>
              {!item.is_available && <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.7)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><span style={{ background: accent, color: '#fff', padding: '6px 16px', fontWeight: 900, fontSize: '0.85rem', letterSpacing: '0.1em', borderRadius: '4px' }}>SOLD OUT</span></div>}
            </div>
            <div style={{ padding: '12px' }}>
              <h3 style={{ margin: '0 0 4px', fontSize: '0.95rem', fontWeight: 800, color: '#fff', textTransform: 'uppercase', letterSpacing: '0.03em' }}>{item.name}</h3>
              {item.description && <p style={{ margin: 0, fontSize: '0.75rem', color: '#666', lineHeight: 1.5 }}>{item.description}</p>}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

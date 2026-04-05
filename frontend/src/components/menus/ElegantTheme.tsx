// Theme: Elegant (cream/beige, serif fonts, luxury feel)
import type { MenuData } from './types';

export default function ElegantTheme({ data, activeCategory, setActiveCategory }: {
  data: MenuData; activeCategory: string; setActiveCategory: (id: string) => void;
}) {
  const { restaurant, categories } = data;
  const accent = restaurant.primary_color || '#8b6914';
  const allItems = categories.flatMap(c => c.items);
  const activeItems = activeCategory === 'all' ? allItems : categories.find(c => c.id === activeCategory)?.items ?? [];

  return (
    <div style={{ minHeight: '100vh', background: '#fdf8f0', fontFamily: 'Georgia, serif', color: '#2c1810' }}>
      {/* Header */}
      <div style={{ position: 'relative', minHeight: '240px', display: 'flex', alignItems: 'flex-end' }}>
        {restaurant.cover_image_url
          ? <img src={restaurant.cover_image_url} alt="cover" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }} />
          : <div style={{ position: 'absolute', inset: 0, background: `linear-gradient(135deg, #fdf8f0, ${accent}22)` }} />
        }
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to bottom, rgba(253,248,240,0.2) 0%, rgba(253,248,240,0.92) 100%)' }} />
        <div style={{ position: 'relative', width: '100%', textAlign: 'center', padding: '28px 20px' }}>
          {restaurant.logo_url
            ? <img src={restaurant.logo_url} alt="logo" style={{ width: '72px', height: '72px', borderRadius: '50%', objectFit: 'cover', border: `3px solid ${accent}`, marginBottom: '12px', display: 'block', margin: '0 auto 12px' }} />
            : <div style={{ fontSize: '2.5rem', marginBottom: '8px' }}>🍽️</div>}
          <div style={{ fontSize: '0.7rem', letterSpacing: '0.3em', color: accent, marginBottom: '6px', fontFamily: 'system-ui', fontWeight: 600 }}>— WELCOME TO —</div>
          <h1 style={{ fontSize: 'clamp(1.8rem, 6vw, 3rem)', fontWeight: 700, margin: '0 0 8px', color: '#2c1810', letterSpacing: '0.05em' }}>{restaurant.name}</h1>
          <div style={{ display: 'flex', justifyContent: 'center', flexWrap: 'wrap', gap: '16px', marginBottom: '12px', fontFamily: 'system-ui' }}>
            {restaurant.address && <span style={{ color: '#9a7a5a', fontSize: '0.8rem' }}>📍 {restaurant.address}</span>}
            {restaurant.phone && <a href={`tel:${restaurant.phone}`} style={{ color: accent, fontSize: '0.8rem', textDecoration: 'none', fontWeight: 600 }}>📞 {restaurant.phone}</a>}
          </div>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '12px' }}>
            <div style={{ height: '1px', width: '60px', background: accent }} />
            <span style={{ color: accent, fontSize: '1rem' }}>✦</span>
            <div style={{ height: '1px', width: '60px', background: accent }} />
          </div>
        </div>
      </div>
      {/* Tabs */}
      <div style={{ overflowX: 'auto', padding: '16px 20px 0', textAlign: 'center' }}>
        <div style={{ display: 'inline-flex', gap: '8px', minWidth: 'max-content' }}>
          {[{ id: 'all', name: 'All' }, ...categories].map(cat => (
            <button key={cat.id} onClick={() => setActiveCategory(cat.id)}
              style={{ padding: '7px 18px', border: `1px solid ${activeCategory === cat.id ? accent : '#d4b896'}`, cursor: 'pointer', fontSize: '0.78rem', fontWeight: 600, background: activeCategory === cat.id ? accent : 'transparent', color: activeCategory === cat.id ? '#fff' : '#9a7a5a', borderRadius: '4px', fontFamily: 'system-ui', letterSpacing: '0.05em', transition: 'all 0.2s' }}>
              {cat.name.toUpperCase()}
            </button>
          ))}
        </div>
      </div>
      {/* Grid */}
      <div style={{ maxWidth: '860px', margin: '0 auto', padding: '28px 20px', display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: '20px' }}>
        {activeItems.map(item => (
          <div key={item.id} style={{ background: '#fff', borderRadius: '4px', overflow: 'hidden', boxShadow: '0 2px 12px rgba(44,24,16,0.08)', border: `1px solid #e8d5b7`, opacity: item.is_available ? 1 : 0.55 }}>
            {item.image_url && <img src={item.image_url} alt={item.name} style={{ width: '100%', height: '160px', objectFit: 'cover' }} />}
            <div style={{ padding: '16px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '8px', marginBottom: '6px' }}>
                <h3 style={{ margin: 0, fontSize: '1rem', fontWeight: 700, color: '#2c1810' }}>{item.name}</h3>
                <span style={{ color: accent, fontWeight: 700, fontSize: '0.95rem', flexShrink: 0, fontFamily: 'system-ui' }}>${Number(item.price).toFixed(2)}</span>
              </div>
              {item.description && <p style={{ margin: '0 0 8px', fontSize: '0.8rem', color: '#9a7a5a', lineHeight: 1.6, fontFamily: 'system-ui' }}>{item.description}</p>}
              {!item.is_available && <span style={{ display: 'inline-block', background: '#fdf0e0', color: accent, padding: '2px 8px', border: `1px solid ${accent}`, fontSize: '0.7rem', fontWeight: 700, letterSpacing: '0.1em' }}>SOLD OUT</span>}
              <div style={{ marginTop: '10px', height: '1px', background: '#e8d5b7' }} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

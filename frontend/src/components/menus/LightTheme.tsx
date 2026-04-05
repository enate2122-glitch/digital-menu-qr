// Theme: Light Clean (white background, colorful accents)
import type { MenuData } from './types';

export default function LightTheme({ data, activeCategory, setActiveCategory }: {
  data: MenuData; activeCategory: string; setActiveCategory: (id: string) => void;
}) {
  const { restaurant, categories } = data;
  const accent = restaurant.primary_color || '#e85d26';
  const allItems = categories.flatMap(c => c.items);
  const activeItems = activeCategory === 'all' ? allItems : categories.find(c => c.id === activeCategory)?.items ?? [];

  return (
    <div style={{ minHeight: '100vh', background: '#fafafa', fontFamily: 'system-ui, sans-serif' }}>
      {/* Header */}
      <div style={{ position: 'relative', minHeight: '200px', display: 'flex', alignItems: 'flex-end' }}>
        {restaurant.cover_image_url
          ? <img src={restaurant.cover_image_url} alt="cover" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }} />
          : <div style={{ position: 'absolute', inset: 0, background: accent }} />
        }
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to bottom, rgba(0,0,0,0.1) 0%, rgba(0,0,0,0.65) 100%)' }} />
        <div style={{ position: 'relative', width: '100%', padding: '20px', textAlign: 'center' }}>
          {restaurant.logo_url
            ? <img src={restaurant.logo_url} alt="logo" style={{ width: '60px', height: '60px', borderRadius: '50%', objectFit: 'cover', border: '3px solid rgba(255,255,255,0.6)', marginBottom: '8px', display: 'block', margin: '0 auto 8px' }} />
            : <div style={{ fontSize: '2.5rem', marginBottom: '6px' }}>🍽️</div>}
          <h1 style={{ color: '#fff', fontSize: 'clamp(1.4rem, 5vw, 2rem)', fontWeight: 800, margin: '0 0 6px', textShadow: '0 2px 8px rgba(0,0,0,0.4)' }}>{restaurant.name}</h1>
          <div style={{ display: 'flex', justifyContent: 'center', flexWrap: 'wrap', gap: '12px' }}>
            {restaurant.address && <span style={{ color: 'rgba(255,255,255,0.9)', fontSize: '0.8rem' }}>📍 {restaurant.address}</span>}
            {restaurant.phone && <a href={`tel:${restaurant.phone}`} style={{ color: '#fff', fontSize: '0.8rem', textDecoration: 'none', fontWeight: 700, background: accent, padding: '2px 10px', borderRadius: '20px' }}>📞 {restaurant.phone}</a>}
          </div>
        </div>
      </div>
      {/* Tabs */}
      <div style={{ background: '#fff', boxShadow: '0 2px 8px rgba(0,0,0,0.06)', overflowX: 'auto', padding: '0 16px', position: 'sticky', top: 0, zIndex: 10 }}>
        <div style={{ display: 'flex', gap: '0', minWidth: 'max-content' }}>
          {[{ id: 'all', name: 'All' }, ...categories].map(cat => (
            <button key={cat.id} onClick={() => setActiveCategory(cat.id)}
              style={{ padding: '14px 18px', border: 'none', cursor: 'pointer', fontSize: '0.85rem', fontWeight: 600, background: 'transparent', color: activeCategory === cat.id ? accent : '#888', borderBottom: activeCategory === cat.id ? `3px solid ${accent}` : '3px solid transparent', transition: 'all 0.2s', whiteSpace: 'nowrap' }}>
              {cat.name}
            </button>
          ))}
        </div>
      </div>
      {/* List */}
      <div style={{ maxWidth: '700px', margin: '0 auto', padding: '20px 16px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
        {activeItems.map(item => (
          <div key={item.id} style={{ background: '#fff', borderRadius: '12px', boxShadow: '0 1px 6px rgba(0,0,0,0.07)', display: 'flex', overflow: 'hidden', opacity: item.is_available ? 1 : 0.55 }}>
            {item.image_url && <img src={item.image_url} alt={item.name} style={{ width: '100px', height: '100px', objectFit: 'cover', flexShrink: 0 }} />}
            <div style={{ padding: '14px', flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '8px' }}>
                <h3 style={{ margin: '0 0 4px', fontSize: '0.95rem', fontWeight: 700, color: '#1a1a1a' }}>{item.name}</h3>
                <span style={{ color: accent, fontWeight: 800, fontSize: '0.95rem', flexShrink: 0 }}>${Number(item.price).toFixed(2)}</span>
              </div>
              {item.description && <p style={{ margin: 0, fontSize: '0.78rem', color: '#888', lineHeight: 1.5 }}>{item.description}</p>}
              {!item.is_available && <span style={{ marginTop: '6px', display: 'inline-block', background: '#fee2e2', color: '#dc2626', padding: '2px 8px', borderRadius: '4px', fontSize: '0.72rem', fontWeight: 700 }}>SOLD OUT</span>}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

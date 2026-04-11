// Theme: Dark Fine Dining (gold on dark)
import type { MenuData } from './types';

function optimizeImage(url: string | null, width = 400): string | null {
  if (!url) return null;
  if (url.includes('cloudinary.com')) {
    // Insert transformation after /upload/
    return url.replace(/\/upload\//, `/upload/w_${width},q_auto,f_auto/`);
  }
  return url;
}

export default function DarkTheme({ data, activeCategory, setActiveCategory }: {
  data: MenuData; activeCategory: string; setActiveCategory: (id: string) => void;
}) {
  const { restaurant, categories } = data;
  const accent = restaurant.primary_color || '#c9a84c';
  const allItems = categories.flatMap(c => c.items);
  const activeItems = activeCategory === 'all' ? allItems : categories.find(c => c.id === activeCategory)?.items ?? [];

  return (
    <div style={{ minHeight: '100vh', background: '#0d0d1a', fontFamily: 'system-ui, sans-serif' }}>
      {/* Header */}
      <div style={{ position: 'relative', minHeight: '220px', display: 'flex', alignItems: 'flex-end' }}>
        {/* Cover image */}
        {restaurant.cover_image_url
          ? <img src={optimizeImage(restaurant.cover_image_url, 800)!} alt="cover" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }} />
          : <div style={{ position: 'absolute', inset: 0, background: `linear-gradient(135deg, #0d0d1a 0%, ${accent}33 100%)` }} />
        }
        {/* Overlay */}
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to bottom, rgba(13,13,26,0.3) 0%, rgba(13,13,26,0.85) 100%)' }} />
        {/* Content */}
        <div style={{ position: 'relative', width: '100%', padding: '24px 20px', textAlign: 'center' }}>
          {restaurant.logo_url
            ? <img src={optimizeImage(restaurant.logo_url, 128)!} alt="logo" style={{ width: '64px', height: '64px', borderRadius: '50%', objectFit: 'cover', border: `3px solid ${accent}`, marginBottom: '10px', display: 'block', margin: '0 auto 10px' }} />
            : <div style={{ width: '64px', height: '64px', borderRadius: '50%', background: accent, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.5rem', marginBottom: '10px' }}>🍽️</div>
          }
          <h1 style={{ color: '#fff', fontSize: 'clamp(1.6rem, 6vw, 2.4rem)', fontWeight: 800, margin: '0 0 6px', fontFamily: 'Georgia, serif', textShadow: '0 2px 8px rgba(0,0,0,0.5)' }}>{restaurant.name}</h1>
          <div style={{ display: 'flex', justifyContent: 'center', flexWrap: 'wrap', gap: '12px', marginTop: '6px' }}>
            {restaurant.address && <span style={{ color: 'rgba(255,255,255,0.8)', fontSize: '0.8rem' }}>📍 {restaurant.address}</span>}
            {restaurant.phone && <a href={`tel:${restaurant.phone}`} style={{ color: accent, fontSize: '0.8rem', textDecoration: 'none', fontWeight: 600 }}>📞 {restaurant.phone}</a>}
          </div>
          <div style={{ width: '40px', height: '2px', background: accent, margin: '12px auto 0', borderRadius: '2px' }} />
        </div>
      </div>
      {/* Tabs */}
      <div style={{ overflowX: 'auto', borderBottom: '1px solid #1e1e3a', padding: '0 16px' }}>
        <div style={{ display: 'flex', gap: '4px', minWidth: 'max-content', padding: '12px 0' }}>
          {[{ id: 'all', name: 'All' }, ...categories].map(cat => (
            <button key={cat.id} onClick={() => setActiveCategory(cat.id)}
              style={{ padding: '7px 16px', borderRadius: '20px', border: 'none', cursor: 'pointer', fontSize: '0.8rem', fontWeight: 600, background: activeCategory === cat.id ? accent : '#1a1a3a', color: activeCategory === cat.id ? '#0d0d1a' : '#888', transition: 'all 0.2s' }}>
              {cat.name}
            </button>
          ))}
        </div>
      </div>
      {/* Grid */}
      <div style={{ maxWidth: '900px', margin: '0 auto', padding: '24px 16px', display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '16px' }}>
        {activeItems.map(item => (
          <div key={item.id} style={{ background: '#13132a', borderRadius: '14px', overflow: 'hidden', border: '1px solid #1e1e3a', opacity: item.is_available ? 1 : 0.55 }}>
            <div style={{ position: 'relative', height: '180px' }}>
              {item.image_url ? <img src={optimizeImage(item.image_url, 400)!} alt={item.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                : <div style={{ width: '100%', height: '100%', background: '#1e1e3a', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '2.5rem' }}>🍽️</div>}
              {!item.is_available && <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.6)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><span style={{ color: '#fff', fontWeight: 700, border: '2px solid #fff', padding: '3px 10px', borderRadius: '4px', fontSize: '0.8rem', letterSpacing: '0.1em' }}>SOLD OUT</span></div>}
            </div>
            <div style={{ padding: '14px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '8px', marginBottom: '6px' }}>
                <h3 style={{ margin: 0, fontSize: '0.95rem', fontWeight: 700, color: '#f0f0f0' }}>{item.name}</h3>
                <span style={{ color: accent, fontWeight: 700, fontSize: '1rem', flexShrink: 0 }}>${Number(item.price).toFixed(2)}</span>
              </div>
              {item.description && <p style={{ margin: 0, fontSize: '0.78rem', color: '#666', lineHeight: 1.5 }}>{item.description}</p>}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

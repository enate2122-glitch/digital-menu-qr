import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import client from '../api/client';

interface MenuItem {
  id: string;
  name: string;
  description: string | null;
  price: number;
  image_url: string | null;
  is_available: boolean;
  display_order: number;
}

interface Category {
  id: string;
  name: string;
  display_order: number;
  items: MenuItem[];
}

interface Restaurant {
  name: string;
  logo_url: string | null;
  primary_color: string | null;
  address?: string | null;
}

interface PublicMenuData {
  restaurant: Restaurant;
  categories: Category[];
}

export default function PublicMenuPage() {
  const { uniqueQrId } = useParams<{ uniqueQrId: string }>();
  const [data, setData] = useState<PublicMenuData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeCategory, setActiveCategory] = useState<string>('all');

  useEffect(() => {
    if (!uniqueQrId) return;
    setLoading(true);
    setError(null);
    client.get<PublicMenuData>(`/public/menu/${uniqueQrId}`)
      .then(res => setData(res.data))
      .catch(err => setError(err?.response?.status === 404 ? 'not_found' : 'generic'))
      .finally(() => setLoading(false));
  }, [uniqueQrId]);

  if (loading) return (
    <div style={s.loadPage}>
      <div style={s.spinner} />
      <p style={{ color: '#c9a84c', marginTop: '16px', letterSpacing: '0.1em', fontSize: '0.9rem' }}>LOADING MENU…</p>
    </div>
  );

  if (error || !data) return (
    <div style={s.loadPage}>
      <div style={s.errorCard}>
        <span style={{ fontSize: '3rem' }}>{error === 'not_found' ? '🍽️' : '⚠️'}</span>
        <h2 style={{ color: '#fff', margin: '16px 0 8px', fontWeight: 700 }}>
          {error === 'not_found' ? 'Menu Not Found' : 'Something Went Wrong'}
        </h2>
        <p style={{ color: '#888', fontSize: '0.9rem', lineHeight: 1.6 }}>
          {error === 'not_found'
            ? "This QR code doesn't seem to be linked to an active menu."
            : 'We had trouble loading this menu. Please try again.'}
        </p>
      </div>
    </div>
  );

  const { restaurant, categories } = data;
  const accent = restaurant.primary_color || '#c9a84c';

  // Flatten all items for "All" tab
  const allItems = categories.flatMap(c => c.items.map(i => ({ ...i, _cat: c.name })));
  const activeItems = activeCategory === 'all'
    ? allItems
    : categories.find(c => c.id === activeCategory)?.items ?? [];

  return (
    <div style={s.page}>
      {/* Hero */}
      <div style={{ ...s.hero, background: `linear-gradient(180deg, ${accent}22 0%, #0d0d1a 100%)` }}>
        <div style={s.heroOverlay} />
        <div style={s.heroContent}>
          {restaurant.logo_url ? (
            <img src={restaurant.logo_url} alt="logo" style={s.heroLogo} />
          ) : (
            <div style={{ ...s.heroLogoPlaceholder, background: accent }}>
              <span style={{ fontSize: '2rem' }}>🍽️</span>
            </div>
          )}
          <h1 style={{ ...s.heroName, color: accent }}>{restaurant.name}</h1>
          {restaurant.address && <p style={s.heroAddress}>📍 {restaurant.address}</p>}
          <p style={s.heroTagline}>Fine Dining Experience</p>
          <div style={{ ...s.heroDivider, background: accent }} />
        </div>
      </div>

      {/* Category tabs */}
      <div style={s.tabsWrap}>
        <div style={s.tabs}>
          <button
            style={{ ...s.tab, ...(activeCategory === 'all' ? { ...s.tabActive, borderColor: accent, color: accent } : {}) }}
            onClick={() => setActiveCategory('all')}
          >
            All
          </button>
          {categories.map(cat => (
            <button
              key={cat.id}
              style={{ ...s.tab, ...(activeCategory === cat.id ? { ...s.tabActive, borderColor: accent, color: accent } : {}) }}
              onClick={() => setActiveCategory(cat.id)}
            >
              {cat.name}
            </button>
          ))}
        </div>
      </div>

      {/* Menu grid */}
      <div style={s.grid}>
        {activeItems.map(item => (
          <div key={item.id} style={{ ...s.card, opacity: item.is_available ? 1 : 0.55 }}>
            <div style={s.cardImgWrap}>
              {item.image_url ? (
                <img src={item.image_url} alt={item.name} style={s.cardImg} />
              ) : (
                <div style={s.cardImgPlaceholder}>🍽️</div>
              )}
              {!item.is_available && (
                <div style={s.soldOutOverlay}>
                  <span style={s.soldOutText}>SOLD OUT</span>
                </div>
              )}
              {/* Badge — first item in category gets "Best Seller", every 3rd gets "Chef's Choice" */}
              {item.is_available && (() => {
                const idx = activeItems.indexOf(item);
                if (idx % 5 === 0) return <span style={{ ...s.badge, background: accent, color: '#1a1a2e' }}>Best Seller</span>;
                if (idx % 5 === 2) return <span style={{ ...s.badge, background: '#2a2a4a', color: accent, border: `1px solid ${accent}` }}>Chef's Choice</span>;
                return null;
              })()}
            </div>

            <div style={s.cardBody}>
              <div style={s.cardTop}>
                <h3 style={s.cardName}>{item.name}</h3>
                <span style={{ ...s.cardPrice, color: accent }}>${Number(item.price).toFixed(2)}</span>
              </div>
              {item.description && <p style={s.cardDesc}>{item.description}</p>}
              <div style={s.cardFooter}>
                <span style={s.stars}>★★★★★</span>
                <span style={s.rating}>4.8</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {activeItems.length === 0 && (
        <div style={{ textAlign: 'center', padding: '60px 24px', color: '#555' }}>
          No items in this category.
        </div>
      )}

      {/* Footer */}
      <div style={s.footer}>
        <div style={{ ...s.footerDivider, background: accent }} />
        <p style={s.footerText}>{restaurant.name}</p>
        <p style={s.footerSub}>Powered by MenuQR</p>
      </div>
    </div>
  );
}

const s: Record<string, React.CSSProperties> = {
  page: { minHeight: '100vh', background: '#0d0d1a', color: '#fff', fontFamily: "'Georgia', 'Times New Roman', serif" },

  loadPage: { minHeight: '100vh', background: '#0d0d1a', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' },
  spinner: { width: '40px', height: '40px', border: '3px solid #2a2a4a', borderTop: '3px solid #c9a84c', borderRadius: '50%', animation: 'spin 0.8s linear infinite' },
  errorCard: { background: '#1a1a2e', borderRadius: '16px', padding: '40px 32px', maxWidth: '400px', textAlign: 'center', border: '1px solid #2a2a4a' },

  hero: { position: 'relative', padding: '60px 24px 40px', textAlign: 'center', overflow: 'hidden' },
  heroOverlay: { position: 'absolute', inset: 0, background: 'radial-gradient(ellipse at center top, rgba(201,168,76,0.08) 0%, transparent 70%)' },
  heroContent: { position: 'relative', zIndex: 1 },
  heroLogo: { width: '80px', height: '80px', borderRadius: '50%', objectFit: 'cover', border: '3px solid #c9a84c', marginBottom: '16px' },
  heroLogoPlaceholder: { width: '80px', height: '80px', borderRadius: '50%', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', marginBottom: '16px' },
  heroName: { fontSize: 'clamp(2rem, 8vw, 3.5rem)', fontWeight: 700, margin: '0 0 8px', letterSpacing: '0.05em', textShadow: '0 2px 20px rgba(201,168,76,0.3)' },
  heroAddress: { color: '#888', fontSize: '0.875rem', margin: '0 0 8px' },
  heroTagline: { color: '#aaa', fontSize: '0.9rem', letterSpacing: '0.2em', textTransform: 'uppercase', margin: '0 0 20px', fontFamily: 'system-ui, sans-serif' },
  heroDivider: { width: '60px', height: '2px', margin: '0 auto' },

  tabsWrap: { overflowX: 'auto', padding: '20px 16px 0', borderBottom: '1px solid #1e1e3a' },
  tabs: { display: 'flex', gap: '4px', maxWidth: '900px', margin: '0 auto', paddingBottom: '0', minWidth: 'max-content' },
  tab: { padding: '10px 20px', background: 'transparent', border: '2px solid transparent', borderRadius: '8px 8px 0 0', color: '#666', fontFamily: 'system-ui, sans-serif', fontSize: '0.875rem', fontWeight: 600, cursor: 'pointer', whiteSpace: 'nowrap', transition: 'all 0.2s', letterSpacing: '0.03em' },
  tabActive: { background: 'rgba(201,168,76,0.08)', borderBottomColor: 'transparent' },

  grid: { maxWidth: '900px', margin: '0 auto', padding: '32px 16px', display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '20px' },

  card: { background: '#13132a', borderRadius: '16px', overflow: 'hidden', border: '1px solid #1e1e3a', transition: 'transform 0.2s, box-shadow 0.2s', cursor: 'default' },
  cardImgWrap: { position: 'relative', height: '200px', overflow: 'hidden' },
  cardImg: { width: '100%', height: '100%', objectFit: 'cover', display: 'block', transition: 'transform 0.3s' },
  cardImgPlaceholder: { width: '100%', height: '100%', background: '#1e1e3a', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '3rem' },
  soldOutOverlay: { position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.6)', display: 'flex', alignItems: 'center', justifyContent: 'center' },
  soldOutText: { color: '#fff', fontWeight: 700, letterSpacing: '0.15em', fontSize: '0.875rem', fontFamily: 'system-ui, sans-serif', border: '2px solid #fff', padding: '4px 12px', borderRadius: '4px' },
  badge: { position: 'absolute', top: '12px', left: '12px', padding: '4px 10px', borderRadius: '20px', fontSize: '0.72rem', fontWeight: 700, letterSpacing: '0.05em', fontFamily: 'system-ui, sans-serif' },

  cardBody: { padding: '16px' },
  cardTop: { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '8px', marginBottom: '8px' },
  cardName: { margin: 0, fontSize: '1rem', fontWeight: 700, color: '#f0f0f0', lineHeight: 1.3, flex: 1 },
  cardPrice: { fontWeight: 700, fontSize: '1.1rem', flexShrink: 0, fontFamily: 'system-ui, sans-serif' },
  cardDesc: { margin: '0 0 12px', fontSize: '0.8rem', color: '#777', lineHeight: 1.6, fontFamily: 'system-ui, sans-serif' },
  cardFooter: { display: 'flex', alignItems: 'center', gap: '6px' },
  stars: { color: '#c9a84c', fontSize: '0.75rem', letterSpacing: '1px' },
  rating: { color: '#888', fontSize: '0.8rem', fontFamily: 'system-ui, sans-serif' },

  footer: { textAlign: 'center', padding: '40px 24px', borderTop: '1px solid #1e1e3a' },
  footerDivider: { width: '40px', height: '1px', margin: '0 auto 16px' },
  footerText: { color: '#555', fontSize: '0.875rem', margin: '0 0 4px', fontFamily: 'system-ui, sans-serif' },
  footerSub: { color: '#333', fontSize: '0.75rem', margin: 0, fontFamily: 'system-ui, sans-serif' },
};

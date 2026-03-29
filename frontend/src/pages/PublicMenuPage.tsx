import { useEffect, useState, useRef } from 'react';
import { useParams } from 'react-router-dom';
import client from '../api/client';

interface MenuItem {
  id: number;
  name: string;
  description: string | null;
  price: number;
  image_url: string | null;
  is_available: boolean;
  display_order: number;
}

interface Category {
  id: number;
  name: string;
  display_order: number;
  items: MenuItem[];
}

interface Restaurant {
  name: string;
  logo_url: string | null;
  primary_color: string | null;
}

interface PublicMenuData {
  restaurant: Restaurant;
  categories: Category[];
}

function hexToRgb(hex: string) {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return `${r}, ${g}, ${b}`;
}

export default function PublicMenuPage() {
  const { uniqueQrId } = useParams<{ uniqueQrId: string }>();
  const [data, setData] = useState<PublicMenuData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeCategory, setActiveCategory] = useState<number | null>(null);
  const navRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!uniqueQrId) return;
    setLoading(true);
    setError(null);
    client.get<PublicMenuData>(`/public/menu/${uniqueQrId}`)
      .then(res => {
        setData(res.data);
        if (res.data.categories.length > 0) setActiveCategory(res.data.categories[0].id);
      })
      .catch(err => setError(err?.response?.status === 404 ? 'not_found' : 'generic'))
      .finally(() => setLoading(false));
  }, [uniqueQrId]);

  // Scroll spy
  useEffect(() => {
    if (!data) return;
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const id = Number(entry.target.id.replace('cat-', ''));
          setActiveCategory(id);
        }
      });
    }, { rootMargin: '-40% 0px -55% 0px' });
    data.categories.forEach(cat => {
      const el = document.getElementById(`cat-${cat.id}`);
      if (el) observer.observe(el);
    });
    return () => observer.disconnect();
  }, [data]);

  function scrollToCategory(id: number) {
    const el = document.getElementById(`cat-${id}`);
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    setActiveCategory(id);
  }

  if (loading) {
    return (
      <div style={s.fullCenter}>
        <div style={s.spinner} />
        <p style={{ color: '#94a3b8', marginTop: '16px', fontSize: '0.9rem' }}>Loading menu…</p>
      </div>
    );
  }

  if (error || !data) {
    const isNotFound = error === 'not_found';
    return (
      <div style={{ ...s.fullCenter, background: '#f8fafc' }}>
        <div style={s.errorCard}>
          <div style={s.errorEmoji}>{isNotFound ? '🍽️' : '⚠️'}</div>
          <h1 style={s.errorTitle}>{isNotFound ? 'Menu Not Found' : 'Something Went Wrong'}</h1>
          <p style={s.errorText}>
            {isNotFound
              ? "This QR code doesn't seem to be linked to an active menu."
              : 'We had trouble loading this menu. Please try again.'}
          </p>
          {isNotFound && <p style={s.errorHint}>Ask the restaurant staff for assistance.</p>}
        </div>
      </div>
    );
  }

  const { restaurant, categories } = data;
  const color = restaurant.primary_color ?? '#2563eb';
  const rgb = color.startsWith('#') && color.length === 7 ? hexToRgb(color) : '37, 99, 235';

  return (
    <div style={{ ...s.page, '--brand': color, '--brand-rgb': rgb } as React.CSSProperties}>

      {/* Hero header */}
      <header style={{ ...s.header, background: `linear-gradient(160deg, ${color} 0%, ${color}cc 100%)` }}>
        <div style={s.headerInner}>
          {restaurant.logo_url ? (
            <img src={restaurant.logo_url} alt={restaurant.name} style={s.logo} />
          ) : (
            <div style={{ ...s.logoPlaceholder, background: 'rgba(255,255,255,0.2)' }}>
              {restaurant.name.slice(0, 2).toUpperCase()}
            </div>
          )}
          <div>
            <h1 style={s.restaurantName}>{restaurant.name}</h1>
            <p style={s.restaurantTagline}>Tap a category to explore our menu</p>
          </div>
        </div>
      </header>

      {/* Sticky category pills */}
      <div style={s.navWrap} ref={navRef}>
        <div style={s.navScroll}>
          {categories.map(cat => (
            <button
              key={cat.id}
              onClick={() => scrollToCategory(cat.id)}
              style={{
                ...s.navPill,
                ...(activeCategory === cat.id
                  ? { background: color, color: '#fff', boxShadow: `0 4px 12px rgba(${rgb}, 0.35)` }
                  : {}),
              }}
            >
              {cat.name}
            </button>
          ))}
        </div>
      </div>

      {/* Menu content */}
      <main style={s.main}>
        {categories.map(cat => {
          const sorted = [...cat.items].sort((a, b) => a.display_order - b.display_order);
          return (
            <section key={cat.id} id={`cat-${cat.id}`} style={s.section}>
              <div style={s.catHeader}>
                <h2 style={{ ...s.catTitle, color }}>{cat.name}</h2>
                <span style={s.catCount}>{sorted.length} item{sorted.length !== 1 ? 's' : ''}</span>
              </div>

              <div style={s.itemsGrid}>
                {sorted.map(item => (
                  <div
                    key={item.id}
                    style={{ ...s.itemCard, ...(item.is_available ? {} : s.itemUnavailable) }}
                  >
                    {/* Image */}
                    {item.image_url ? (
                      <div style={s.imgWrap}>
                        <img src={item.image_url} alt={item.name} style={s.itemImg} />
                        {!item.is_available && <div style={s.soldOutOverlay}><span style={s.soldOutText}>Sold Out</span></div>}
                      </div>
                    ) : (
                      <div style={{ ...s.imgPlaceholder, background: `rgba(${rgb}, 0.08)` }}>
                        <span style={{ fontSize: '2rem' }}>🍽️</span>
                        {!item.is_available && <div style={s.soldOutOverlay}><span style={s.soldOutText}>Sold Out</span></div>}
                      </div>
                    )}

                    {/* Body */}
                    <div style={s.itemBody}>
                      <div style={s.itemTop}>
                        <h3 style={s.itemName}>{item.name}</h3>
                        <span style={{ ...s.itemPrice, color }}>${Number(item.price).toFixed(2)}</span>
                      </div>
                      {item.description && <p style={s.itemDesc}>{item.description}</p>}
                      {!item.is_available && (
                        <span style={s.soldOutBadge}>Currently unavailable</span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </section>
          );
        })}

        <div style={s.footer}>
          <p style={s.footerText}>Powered by <strong>MenuQR</strong></p>
        </div>
      </main>
    </div>
  );
}

const s: Record<string, React.CSSProperties> = {
  page: { minHeight: '100vh', background: '#f8fafc', fontFamily: "'Inter', system-ui, sans-serif" },

  fullCenter: { display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', background: '#fff' },
  spinner: { width: '40px', height: '40px', border: '3px solid #e2e8f0', borderTop: '3px solid #2563eb', borderRadius: '50%', animation: 'spin 0.8s linear infinite' },

  errorCard: { background: '#fff', borderRadius: '20px', boxShadow: '0 4px 24px rgba(0,0,0,0.08)', padding: '48px 32px', maxWidth: '400px', width: '90%', textAlign: 'center' },
  errorEmoji: { fontSize: '4rem', marginBottom: '16px' },
  errorTitle: { fontSize: '1.5rem', fontWeight: 800, color: '#0f172a', margin: '0 0 10px' },
  errorText: { color: '#64748b', fontSize: '0.95rem', lineHeight: 1.6, margin: '0 0 8px' },
  errorHint: { color: '#94a3b8', fontSize: '0.8rem', margin: 0 },

  header: { padding: '32px 20px 40px', color: '#fff' },
  headerInner: { maxWidth: '680px', margin: '0 auto', display: 'flex', alignItems: 'center', gap: '16px' },
  logo: { width: '72px', height: '72px', borderRadius: '16px', objectFit: 'cover', border: '3px solid rgba(255,255,255,0.3)', flexShrink: 0, boxShadow: '0 4px 16px rgba(0,0,0,0.15)' },
  logoPlaceholder: { width: '72px', height: '72px', borderRadius: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.5rem', fontWeight: 800, color: '#fff', flexShrink: 0, border: '3px solid rgba(255,255,255,0.3)' },
  restaurantName: { margin: 0, fontSize: 'clamp(1.4rem, 5vw, 2rem)', fontWeight: 900, color: '#fff', lineHeight: 1.2, textShadow: '0 1px 4px rgba(0,0,0,0.15)' },
  restaurantTagline: { margin: '4px 0 0', fontSize: '0.85rem', color: 'rgba(255,255,255,0.75)' },

  navWrap: { position: 'sticky', top: 0, zIndex: 20, background: 'rgba(255,255,255,0.95)', backdropFilter: 'blur(12px)', borderBottom: '1px solid #f1f5f9', boxShadow: '0 2px 8px rgba(0,0,0,0.04)' },
  navScroll: { display: 'flex', gap: '8px', padding: '12px 16px', overflowX: 'auto', maxWidth: '680px', margin: '0 auto', scrollbarWidth: 'none' as const },
  navPill: { flexShrink: 0, padding: '8px 18px', borderRadius: '24px', border: 'none', background: '#f1f5f9', color: '#475569', fontSize: '0.875rem', fontWeight: 600, cursor: 'pointer', transition: 'all 0.2s', whiteSpace: 'nowrap' as const },

  main: { maxWidth: '680px', margin: '0 auto', padding: '24px 16px 48px' },

  section: { marginBottom: '40px', scrollMarginTop: '70px' },
  catHeader: { display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px', paddingBottom: '10px', borderBottom: '2px solid #f1f5f9' },
  catTitle: { margin: 0, fontSize: 'clamp(1.1rem, 4vw, 1.4rem)', fontWeight: 800 },
  catCount: { fontSize: '0.8rem', color: '#94a3b8', fontWeight: 500 },

  itemsGrid: { display: 'flex', flexDirection: 'column', gap: '12px' },

  itemCard: { background: '#fff', borderRadius: '16px', overflow: 'hidden', boxShadow: '0 1px 6px rgba(0,0,0,0.06)', display: 'flex', flexDirection: 'row', minHeight: '100px', transition: 'box-shadow 0.2s' },
  itemUnavailable: { opacity: 0.55 },

  imgWrap: { position: 'relative', width: '110px', flexShrink: 0 },
  itemImg: { width: '110px', height: '100%', objectFit: 'cover', display: 'block', minHeight: '100px' },
  imgPlaceholder: { width: '110px', flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative', minHeight: '100px' },

  soldOutOverlay: { position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.45)', display: 'flex', alignItems: 'center', justifyContent: 'center' },
  soldOutText: { color: '#fff', fontWeight: 800, fontSize: '0.7rem', textTransform: 'uppercase', letterSpacing: '0.08em', background: 'rgba(0,0,0,0.5)', padding: '3px 8px', borderRadius: '4px' },

  itemBody: { padding: '14px 16px', display: 'flex', flexDirection: 'column', gap: '6px', flex: 1, justifyContent: 'center' },
  itemTop: { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '8px' },
  itemName: { margin: 0, fontSize: '0.95rem', fontWeight: 700, color: '#0f172a', lineHeight: 1.3, flex: 1 },
  itemPrice: { fontWeight: 800, fontSize: '1rem', flexShrink: 0 },
  itemDesc: { margin: 0, fontSize: '0.8rem', color: '#64748b', lineHeight: 1.5 },
  soldOutBadge: { display: 'inline-block', background: '#fee2e2', color: '#dc2626', fontSize: '0.7rem', fontWeight: 700, padding: '2px 8px', borderRadius: '20px', textTransform: 'uppercase', letterSpacing: '0.05em', alignSelf: 'flex-start' },

  footer: { textAlign: 'center', paddingTop: '24px', borderTop: '1px solid #f1f5f9', marginTop: '16px' },
  footerText: { color: '#cbd5e1', fontSize: '0.8rem', margin: 0 },
};

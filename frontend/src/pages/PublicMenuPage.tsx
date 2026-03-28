import { useEffect, useState } from 'react';
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

export default function PublicMenuPage() {
  const { uniqueQrId } = useParams<{ uniqueQrId: string }>();
  const [data, setData] = useState<PublicMenuData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!uniqueQrId) return;

    setLoading(true);
    setError(null);

    client
      .get<PublicMenuData>(`/public/menu/${uniqueQrId}`)
      .then((res) => {
        setData(res.data);
      })
      .catch((err) => {
        const status = err?.response?.status;
        if (status === 404) {
          setError('not_found');
        } else {
          setError('generic');
        }
      })
      .finally(() => {
        setLoading(false);
      });
  }, [uniqueQrId]);

  if (loading) {
    return (
      <div style={styles.loadingContainer}>
        <p style={styles.loadingText}>Loading menu…</p>
      </div>
    );
  }

  if (error || !data) {
    const isNotFound = error === 'not_found';
    return (
      <div style={styles.errorPage}>
        <div style={styles.errorCard}>
          <span style={styles.errorIcon}>{isNotFound ? '🍽️' : '⚠️'}</span>
          <h1 style={styles.errorHeading}>
            {isNotFound ? 'Menu Not Found' : 'Something Went Wrong'}
          </h1>
          <p style={styles.errorMessage}>
            {isNotFound
              ? "This QR code doesn't seem to be linked to an active menu."
              : 'We had trouble loading this menu. Please try again in a moment.'}
          </p>
          {isNotFound && (
            <p style={styles.errorHint}>
              If you believe this is a mistake, please ask the restaurant staff for assistance.
            </p>
          )}
        </div>
      </div>
    );
  }

  const { restaurant } = data;
  const headerBg = restaurant.primary_color ?? '#1a1a1a';

  return (
    <div style={styles.page}>
      {/* Restaurant header */}
      <header style={{ ...styles.header, backgroundColor: headerBg }}>
        <div style={styles.headerInner}>
          {restaurant.logo_url && (
            <img
              src={restaurant.logo_url}
              alt={`${restaurant.name} logo`}
              style={styles.logo}
            />
          )}
          <h1 style={styles.restaurantName}>{restaurant.name}</h1>
        </div>
      </header>

      {/* Category navigation bar */}
      <nav style={styles.navBar}>
        <div style={styles.navInner}>
          {data.categories.map((cat) => (
            <a key={cat.id} href={`#category-${cat.id}`} style={styles.navLink}>
              {cat.name}
            </a>
          ))}
        </div>
      </nav>

      {/* Categories and items */}
      <main style={styles.main}>
        {data.categories.map((cat) => {
          const sortedItems = [...cat.items].sort(
            (a, b) => a.display_order - b.display_order
          );
          return (
            <section key={cat.id} id={`category-${cat.id}`} style={styles.section}>
              <h2 style={styles.categoryHeading}>{cat.name}</h2>
              <div style={styles.itemsGrid}>
                {sortedItems.map((item) => (
                  <div
                    key={item.id}
                    style={{
                      ...styles.itemCard,
                      ...(!item.is_available ? styles.itemCardUnavailable : {}),
                    }}
                  >
                    <div style={styles.imageWrapper}>
                      {item.image_url && (
                        <img
                          src={item.image_url}
                          alt={item.name}
                          style={styles.itemImage}
                        />
                      )}
                      {!item.is_available && (
                        <span style={styles.soldOutBadge}>Sold Out</span>
                      )}
                    </div>
                    <div style={styles.itemBody}>
                      <p style={styles.itemName}>{item.name}</p>
                      {item.description && (
                        <p style={styles.itemDescription}>{item.description}</p>
                      )}
                      <p style={styles.itemPrice}>
                        {new Intl.NumberFormat(undefined, {
                          style: 'currency',
                          currency: 'USD',
                        }).format(item.price)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          );
        })}
      </main>
    </div>
  );
}

/* ─── Mobile-first styles (320px → 1280px) ─────────────────────────────── */
const styles: Record<string, React.CSSProperties> = {
  page: {
    minHeight: '100vh',
    backgroundColor: '#f5f5f5',
    fontFamily: 'system-ui, sans-serif',
  },
  header: {
    width: '100%',
    padding: '16px',
    boxSizing: 'border-box',
  },
  headerInner: {
    maxWidth: '800px',
    margin: '0 auto',
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
  },
  logo: {
    width: '56px',
    height: '56px',
    objectFit: 'cover',
    borderRadius: '8px',
    flexShrink: 0,
  },
  restaurantName: {
    margin: 0,
    fontSize: 'clamp(1.25rem, 5vw, 2rem)',
    fontWeight: 700,
    color: '#ffffff',
    lineHeight: 1.2,
    wordBreak: 'break-word',
  },
  main: {
    maxWidth: '800px',
    margin: '0 auto',
    padding: '16px',
    boxSizing: 'border-box',
  },
  navBar: {
    position: 'sticky',
    top: 0,
    zIndex: 10,
    backgroundColor: '#ffffff',
    borderBottom: '1px solid #e0e0e0',
    overflowX: 'auto',
  },
  navInner: {
    maxWidth: '800px',
    margin: '0 auto',
    display: 'flex',
    gap: '4px',
    padding: '8px 16px',
    whiteSpace: 'nowrap' as const,
  },
  navLink: {
    display: 'inline-block',
    padding: '6px 12px',
    borderRadius: '20px',
    backgroundColor: '#f0f0f0',
    color: '#333',
    textDecoration: 'none',
    fontSize: '0.875rem',
    fontWeight: 500,
    flexShrink: 0,
  },
  section: {
    marginBottom: '32px',
  },
  categoryHeading: {
    margin: '0 0 12px',
    fontSize: 'clamp(1.1rem, 4vw, 1.5rem)',
    fontWeight: 700,
    color: '#1a1a1a',
    borderBottom: '2px solid #e0e0e0',
    paddingBottom: '8px',
  },
  itemsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
    gap: '12px',
  },
  itemCard: {
    backgroundColor: '#ffffff',
    borderRadius: '10px',
    overflow: 'hidden',
    boxShadow: '0 1px 4px rgba(0,0,0,0.08)',
    display: 'flex',
    flexDirection: 'column' as const,
  },
  itemCardUnavailable: {
    opacity: 0.6,
  },
  imageWrapper: {
    position: 'relative' as const,
  },
  itemImage: {
    width: '100%',
    height: '160px',
    objectFit: 'cover' as const,
    display: 'block',
  },
  soldOutBadge: {
    position: 'absolute' as const,
    top: '8px',
    right: '8px',
    backgroundColor: '#e53e3e',
    color: '#ffffff',
    fontSize: '0.75rem',
    fontWeight: 700,
    padding: '3px 8px',
    borderRadius: '4px',
    textTransform: 'uppercase' as const,
    letterSpacing: '0.05em',
  },
  itemBody: {
    padding: '12px',
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '4px',
    flex: 1,
  },
  itemName: {
    margin: 0,
    fontSize: '1rem',
    fontWeight: 600,
    color: '#1a1a1a',
  },
  itemDescription: {
    margin: 0,
    fontSize: '0.875rem',
    color: '#666',
    lineHeight: 1.4,
  },
  itemPrice: {
    margin: '4px 0 0',
    fontSize: '1rem',
    fontWeight: 700,
    color: '#2c7a2c',
  },
  loadingContainer: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: '100vh',
    padding: '16px',
  },
  loadingText: {
    fontSize: '1rem',
    color: '#555',
  },
  errorPage: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: '100vh',
    padding: '16px',
    backgroundColor: '#f5f5f5',
    fontFamily: 'system-ui, sans-serif',
    boxSizing: 'border-box' as const,
  },
  errorCard: {
    backgroundColor: '#ffffff',
    borderRadius: '16px',
    boxShadow: '0 2px 12px rgba(0,0,0,0.1)',
    padding: '40px 32px',
    maxWidth: '480px',
    width: '100%',
    textAlign: 'center' as const,
  },
  errorIcon: {
    fontSize: 'clamp(3rem, 15vw, 5rem)',
    display: 'block',
    marginBottom: '16px',
    lineHeight: 1,
  },
  errorHeading: {
    margin: '0 0 12px',
    fontSize: 'clamp(1.4rem, 5vw, 1.75rem)',
    fontWeight: 700,
    color: '#1a1a1a',
  },
  errorMessage: {
    margin: '0 0 12px',
    fontSize: '1rem',
    color: '#555',
    lineHeight: 1.5,
  },
  errorHint: {
    margin: 0,
    fontSize: '0.875rem',
    color: '#888',
    lineHeight: 1.5,
  },
};

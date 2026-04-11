import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import client from '../api/client';
import type { MenuData } from '../components/menus/types';
import ElegantTheme from '../components/menus/ElegantTheme';
import OrganicTheme    from '../components/menus/OrganicTheme';
import NeomorphicTheme from '../components/menus/NeomorphicTheme';
import MinimalTheme    from '../components/menus/MinimalTheme';
import VintageTheme    from '../components/menus/VintageTheme';

export default function PublicMenuPage() {
  const { uniqueQrId } = useParams<{ uniqueQrId: string }>();
  const [data, setData] = useState<MenuData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeCategory, setActiveCategory] = useState('all');

  useEffect(() => {
    if (!uniqueQrId) return;
    setLoading(true);
    client.get<MenuData>(`/public/menu/${uniqueQrId}`)
      .then(res => setData(res.data))
      .catch(err => setError(err?.response?.status === 404 ? 'not_found' : 'generic'))
      .finally(() => setLoading(false));
  }, [uniqueQrId]);

  if (loading) return (
    <div style={{ minHeight: '100vh', background: '#0d0d1a', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '12px' }}>
      <div style={{ width: '36px', height: '36px', border: '3px solid #1e1e3a', borderTop: '3px solid #c9a84c', borderRadius: '50%', animation: 'spin 0.7s linear infinite' }} />
      <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
      <p style={{ color: '#c9a84c', fontSize: '0.8rem', letterSpacing: '0.1em' }}>LOADING MENU…</p>
    </div>
  );

  if (error || !data) return (
    <div style={{ minHeight: '100vh', background: '#0d0d1a', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px' }}>
      <div style={{ background: '#13132a', border: '1px solid #1e1e3a', borderRadius: '16px', padding: '40px 32px', maxWidth: '400px', textAlign: 'center' }}>
        <div style={{ fontSize: '3rem', marginBottom: '12px' }}>{error === 'not_found' ? '🍽️' : '⚠️'}</div>
        <h2 style={{ color: '#fff', margin: '0 0 8px', fontWeight: 700 }}>{error === 'not_found' ? 'Menu Not Found' : 'Something Went Wrong'}</h2>
        <p style={{ color: '#666', fontSize: '0.875rem', lineHeight: 1.6, margin: 0 }}>
          {error === 'not_found' ? "This QR code doesn't seem to be linked to an active menu." : 'Please try again in a moment.'}
        </p>
      </div>
    </div>
  );

  const theme = data.restaurant.menu_theme ?? 'dark';
  const props = { data, activeCategory, setActiveCategory };

  if (theme === 'organic')     return <OrganicTheme    {...props} />;
  if (theme === 'neomorphic')  return <NeomorphicTheme {...props} />;
  if (theme === 'minimal')     return <MinimalTheme    {...props} />;
  if (theme === 'vintage')     return <VintageTheme    {...props} />;
  return <ElegantTheme {...props} />;
}

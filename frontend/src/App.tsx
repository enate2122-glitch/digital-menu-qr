import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { lazy, Suspense } from 'react';

const HomePage      = lazy(() => import('./pages/HomePage'));
const FeaturesPage  = lazy(() => import('./pages/FeaturesPage'));
const FAQPage       = lazy(() => import('./pages/FAQPage'));
const BlogPage      = lazy(() => import('./pages/BlogPage'));
const ContactPage   = lazy(() => import('./pages/ContactPage'));
const LoginPage     = lazy(() => import('./pages/LoginPage'));
const SignupPage    = lazy(() => import('./pages/SignupPage'));
const AdminLayout   = lazy(() => import('./pages/AdminLayout'));
const PublicMenuPage = lazy(() => import('./pages/PublicMenuPage'));

function Loader() {
  return (
    <div style={{ minHeight: '100vh', background: '#0d0d1a', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: '12px' }}>
      <div style={{ width: '36px', height: '36px', border: '3px solid #1e1e3a', borderTop: '3px solid #c9a84c', borderRadius: '50%', animation: 'spin 0.7s linear infinite' }} />
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <Suspense fallback={<Loader />}>
        <Routes>
          <Route path="/"            element={<HomePage />} />
          <Route path="/features"    element={<FeaturesPage />} />
          <Route path="/faq"         element={<FAQPage />} />
          <Route path="/blog"        element={<BlogPage />} />
          <Route path="/contact"     element={<ContactPage />} />
          <Route path="/login"       element={<LoginPage />} />
          <Route path="/signup"      element={<SignupPage />} />
          <Route path="/admin/*"     element={<AdminLayout />} />
          <Route path="/menu/:uniqueQrId" element={<PublicMenuPage />} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
}

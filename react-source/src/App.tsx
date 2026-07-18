import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from './contexts/ThemeContext';
import { LanguageProvider } from './contexts/LanguageContext';
import { CartProvider } from './contexts/CartContext';
import { AuthProvider } from './contexts/AuthContext';
import { ToastProvider } from './contexts/ToastContext';
import ErrorBoundary from './components/ErrorBoundary';
import AdminGuard from './components/AdminGuard';
import AdminLayout from './components/admin/AdminLayout';
import PublicLayout from './layouts/PublicLayout';
import MemberNotice from './auth/MemberNotice';
import usePageTracking from './hooks/usePageTracking';
import './index.css';

const PageTracker = () => {
  usePageTracking();
  return null;
};

function App() {
  return (
    <ErrorBoundary>
    <ThemeProvider>
      <LanguageProvider>
        <AuthProvider>
          <ToastProvider>
          <CartProvider>
            <Router>
              <PageTracker />
              {/* 전 사이트 공통 안내 팝업(§3.3) — 안내만 담당, 차단은 MemberGate·RLS */}
              <MemberNotice />
              <div className="App">
                <Routes>
                  <Route path="/admin/*" element={<AdminGuard><AdminLayout /></AdminGuard>} />
                  <Route path="*" element={<PublicLayout />} />
                </Routes>
              </div>
            </Router>
          </CartProvider>
          </ToastProvider>
        </AuthProvider>
      </LanguageProvider>
    </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;

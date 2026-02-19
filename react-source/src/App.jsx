import { lazy, Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider } from './contexts/ThemeContext';
import { LanguageProvider } from './contexts/LanguageContext';
import { CartProvider } from './contexts/CartContext';
import { AuthProvider } from './contexts/AuthContext';
import { ToastProvider } from './contexts/ToastContext';
import AuthGuard from './components/AuthGuard';
import AdminGuard from './components/AdminGuard';
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import usePageTracking from './hooks/usePageTracking';
import './index.css';

const Home = lazy(() => import('./pages/Home'));
const Services = lazy(() => import('./pages/Services'));
const ServiceDetail = lazy(() => import('./pages/ServiceDetail'));
const Education = lazy(() => import('./pages/Education'));
const EducationCustom = lazy(() => import('./pages/EducationCustom'));
const Classroom = lazy(() => import('./pages/Classroom'));
const Consulting = lazy(() => import('./pages/Consulting'));
const ConsultingBusiness = lazy(() => import('./pages/ConsultingBusiness'));
const ConsultingUniversity = lazy(() => import('./pages/ConsultingUniversity'));
const ConsultingInstitution = lazy(() => import('./pages/ConsultingInstitution'));
const RnD = lazy(() => import('./pages/RnD'));
const Publishing = lazy(() => import('./pages/Publishing'));
const PublishingEbook = lazy(() => import('./pages/PublishingEbook'));
const PublishingPeriodical = lazy(() => import('./pages/PublishingPeriodical'));
const PublishingBook = lazy(() => import('./pages/PublishingBook'));
const PublishingMaterial = lazy(() => import('./pages/PublishingMaterial'));
const Portfolio = lazy(() => import('./pages/Portfolio'));
const About = lazy(() => import('./pages/About'));
const Blog = lazy(() => import('./pages/Blog'));
const BlogWrite = lazy(() => import('./pages/BlogWrite'));
const Board = lazy(() => import('./pages/Board'));
const BoardDetail = lazy(() => import('./pages/BoardDetail'));
const BoardWrite = lazy(() => import('./pages/BoardWrite'));
const BlogDetail = lazy(() => import('./pages/BlogDetail'));
const Gallery = lazy(() => import('./pages/Gallery'));
const GalleryWrite = lazy(() => import('./pages/GalleryWrite'));
const Contact = lazy(() => import('./pages/Contact'));
const CeoProfile = lazy(() => import('./pages/CeoProfile'));
const History = lazy(() => import('./pages/History'));
const Shop = lazy(() => import('./pages/Shop'));
const ProductWrite = lazy(() => import('./pages/ProductWrite'));
const Cart = lazy(() => import('./pages/Cart'));
const Checkout = lazy(() => import('./pages/Checkout'));
const OrderConfirmation = lazy(() => import('./pages/OrderConfirmation'));
const Login = lazy(() => import('./pages/Login'));
const ForgotPassword = lazy(() => import('./pages/ForgotPassword'));
const Register = lazy(() => import('./pages/Register'));
const MyPage = lazy(() => import('./pages/MyPage'));
const OrderHistory = lazy(() => import('./pages/OrderHistory'));

const Loading = () => (
  <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
    <div className="loading-spinner"></div>
  </div>
);

const PageTracker = () => {
  usePageTracking();
  return null;
};

function App() {
  return (
    <ThemeProvider>
      <LanguageProvider>
        <AuthProvider>
          <ToastProvider>
          <CartProvider>
            <Router>
              <PageTracker />
              <div className="App">
                <Navbar />
                <main>
                  <Suspense fallback={<Loading />}>
                    <Routes>
                      <Route path="/" element={<Home />} />
                      <Route path="/services" element={<Services />} />
                      <Route path="/services/:serviceType" element={<ServiceDetail />} />
                      <Route path="/rnd" element={<RnD />} />
                      <Route path="/consulting" element={<Consulting />} />
                      <Route path="/consulting/business" element={<ConsultingBusiness />} />
                      <Route path="/consulting/university" element={<ConsultingUniversity />} />
                      <Route path="/consulting/institution" element={<ConsultingInstitution />} />
                      <Route path="/education" element={<Education />} />
                      <Route path="/education/custom" element={<EducationCustom />} />
                      <Route path="/education/classroom" element={<Classroom />} />
                      <Route path="/publishing" element={<Publishing />} />
                      <Route path="/publishing/ebook" element={<PublishingEbook />} />
                      <Route path="/publishing/periodical" element={<PublishingPeriodical />} />
                      <Route path="/publishing/book" element={<PublishingBook />} />
                      <Route path="/publishing/material" element={<PublishingMaterial />} />
                      <Route path="/portfolio" element={<Portfolio />} />
                      <Route path="/about" element={<About />} />
                      <Route path="/about/ceo" element={<CeoProfile />} />
                      <Route path="/about/history" element={<History />} />
                      {/* Community */}
                      <Route path="/community/blog" element={<Blog />} />
                      <Route path="/community/blog/:postId" element={<BlogDetail />} />
                      <Route path="/community/blog/write" element={<AdminGuard><BlogWrite /></AdminGuard>} />
                      <Route path="/community/blog/edit/:id" element={<AdminGuard><BlogWrite /></AdminGuard>} />
                      <Route path="/community/board" element={<Board />} />
                      <Route path="/community/board/write" element={<AuthGuard><BoardWrite /></AuthGuard>} />
                      <Route path="/community/board/edit/:id" element={<AuthGuard><BoardWrite /></AuthGuard>} />
                      <Route path="/community/board/:postId" element={<BoardDetail />} />
                      <Route path="/community/gallery" element={<Gallery />} />
                      <Route path="/community/gallery/write" element={<AdminGuard><GalleryWrite /></AdminGuard>} />
                      <Route path="/community/gallery/edit/:id" element={<AdminGuard><GalleryWrite /></AdminGuard>} />
                      <Route path="/blog" element={<Navigate to="/community/blog" replace />} />
                      <Route path="/contact" element={<Contact />} />
                      {/* Shop */}
                      <Route path="/shop" element={<Shop />} />
                      <Route path="/shop/product/new" element={<AdminGuard><ProductWrite /></AdminGuard>} />
                      <Route path="/shop/product/edit/:id" element={<AdminGuard><ProductWrite /></AdminGuard>} />
                      <Route path="/cart" element={<Cart />} />
                      <Route path="/checkout" element={<Checkout />} />
                      <Route path="/order-confirmation" element={<OrderConfirmation />} />
                      {/* Auth */}
                      <Route path="/login" element={<Login />} />
                      <Route path="/forgot-password" element={<ForgotPassword />} />
                      <Route path="/register" element={<Register />} />
                      <Route path="/mypage" element={<AuthGuard><MyPage /></AuthGuard>} />
                      <Route path="/mypage/orders" element={<AuthGuard><OrderHistory /></AuthGuard>} />
                    </Routes>
                  </Suspense>
                </main>
                <Footer />
              </div>
            </Router>
          </CartProvider>
          </ToastProvider>
        </AuthProvider>
      </LanguageProvider>
    </ThemeProvider>
  );
}

export default App;

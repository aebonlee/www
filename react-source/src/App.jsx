import { lazy, Suspense } from 'react';
import { HashRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider } from './contexts/ThemeContext';
import { LanguageProvider } from './contexts/LanguageContext';
import { CartProvider } from './contexts/CartContext';
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
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
const Publishing = lazy(() => import('./pages/Publishing'));
const PublishingEbook = lazy(() => import('./pages/PublishingEbook'));
const PublishingPeriodical = lazy(() => import('./pages/PublishingPeriodical'));
const PublishingBook = lazy(() => import('./pages/PublishingBook'));
const Portfolio = lazy(() => import('./pages/Portfolio'));
const About = lazy(() => import('./pages/About'));
const Blog = lazy(() => import('./pages/Blog'));
const Board = lazy(() => import('./pages/Board'));
const Contact = lazy(() => import('./pages/Contact'));
const CeoProfile = lazy(() => import('./pages/CeoProfile'));
const Shop = lazy(() => import('./pages/Shop'));
const Cart = lazy(() => import('./pages/Cart'));
const Checkout = lazy(() => import('./pages/Checkout'));
const OrderConfirmation = lazy(() => import('./pages/OrderConfirmation'));

const Loading = () => (
  <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
    <div className="loading-spinner"></div>
  </div>
);

function App() {
  return (
    <ThemeProvider>
      <LanguageProvider>
        <CartProvider>
          <Router>
            <div className="App">
              <Navbar />
              <main>
                <Suspense fallback={<Loading />}>
                  <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/services" element={<Services />} />
                    <Route path="/services/:serviceType" element={<ServiceDetail />} />
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
                    <Route path="/portfolio" element={<Portfolio />} />
                    <Route path="/about" element={<About />} />
                    <Route path="/about/ceo" element={<CeoProfile />} />
                    <Route path="/community/blog" element={<Blog />} />
                    <Route path="/community/board" element={<Board />} />
                    <Route path="/blog" element={<Navigate to="/community/blog" replace />} />
                    <Route path="/contact" element={<Contact />} />
                    <Route path="/shop" element={<Shop />} />
                    <Route path="/cart" element={<Cart />} />
                    <Route path="/checkout" element={<Checkout />} />
                    <Route path="/order-confirmation" element={<OrderConfirmation />} />
                  </Routes>
                </Suspense>
              </main>
              <Footer />
            </div>
          </Router>
        </CartProvider>
      </LanguageProvider>
    </ThemeProvider>
  );
}

export default App;

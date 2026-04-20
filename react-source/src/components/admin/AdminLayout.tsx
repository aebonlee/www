import { useState, lazy, Suspense } from 'react';
import { Routes, Route } from 'react-router-dom';
import AdminSidebar from './AdminSidebar';
import AdminHeader from './AdminHeader';

const AdminDashboard = lazy(() => import('../../pages/admin/AdminDashboard'));
const AdminUsers = lazy(() => import('../../pages/admin/AdminUsers'));
const AdminBlog = lazy(() => import('../../pages/admin/AdminBlog'));
const AdminGallery = lazy(() => import('../../pages/admin/AdminGallery'));
const AdminBoard = lazy(() => import('../../pages/admin/AdminBoard'));
const AdminSyllabus = lazy(() => import('../../pages/admin/AdminSyllabus'));
const AdminProducts = lazy(() => import('../../pages/admin/AdminProducts'));
const AdminOrders = lazy(() => import('../../pages/admin/AdminOrders'));
const AdminSites = lazy(() => import('../../pages/admin/AdminSites'));
const AdminUserDetail = lazy(() => import('../../pages/admin/AdminUserDetail'));
const AdminLinks = lazy(() => import('../../pages/admin/AdminLinks'));
const AdminTrends = lazy(() => import('../../pages/admin/AdminTrends'));
const AdminSiteVisits = lazy(() => import('../../pages/admin/AdminSiteVisits'));

const Loading = () => (
  <div className="admin-loading">
    <div className="loading-spinner"></div>
  </div>
);

const AdminLayout = () => {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="admin-shell">
      <AdminSidebar
        collapsed={collapsed}
        onToggle={() => setCollapsed(!collapsed)}
        mobileOpen={mobileOpen}
        onMobileClose={() => setMobileOpen(false)}
      />
      <div className={`admin-main ${collapsed ? 'sidebar-collapsed' : ''}`}>
        <AdminHeader onMobileToggle={() => setMobileOpen(!mobileOpen)} />
        <div className="admin-content">
          <Suspense fallback={<Loading />}>
            <Routes>
              <Route index element={<AdminDashboard />} />
              <Route path="users" element={<AdminUsers />} />
              <Route path="users/:id" element={<AdminUserDetail />} />
              <Route path="blog" element={<AdminBlog />} />
              <Route path="gallery" element={<AdminGallery />} />
              <Route path="board" element={<AdminBoard />} />
              <Route path="syllabus" element={<AdminSyllabus />} />
              <Route path="products" element={<AdminProducts />} />
              <Route path="orders" element={<AdminOrders />} />
              <Route path="sites" element={<AdminSites />} />
              <Route path="links" element={<AdminLinks />} />
              <Route path="site-visits" element={<AdminSiteVisits />} />
              <Route path="trends" element={<AdminTrends />} />
            </Routes>
          </Suspense>
        </div>
      </div>
    </div>
  );
};

export default AdminLayout;

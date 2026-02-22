import { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import AdminDataTable from '../../components/admin/AdminDataTable';
import { getProducts, toggleSoldOut, updateProduct, deleteProduct } from '../../utils/productStorage';
import { useToast } from '../../contexts/ToastContext';

const CATEGORY_LABELS = { book: '도서', ebook: '전자출판', periodical: '간행물', course: '강좌' };

const AdminProducts = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const { showToast } = useToast();

  const load = async () => {
    setLoading(true);
    const data = await getProducts(true);
    setProducts(data);
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const handleToggleSoldOut = async (id, current) => {
    try {
      await toggleSoldOut(id, !current);
      showToast(current ? '판매중으로 변경되었습니다.' : '품절 처리되었습니다.', 'success');
      load();
    } catch {
      showToast('변경에 실패했습니다.', 'error');
    }
  };

  const handleDelete = async (id, title) => {
    if (!window.confirm(`"${title}" 상품을 삭제하시겠습니까?`)) return;
    try {
      await deleteProduct(id);
      showToast('삭제되었습니다.', 'success');
      load();
    } catch (err) {
      showToast('삭제 실패: ' + err.message, 'error');
    }
  };

  const handleToggleActive = async (id, current) => {
    try {
      await updateProduct(id, { isActive: !current });
      showToast(!current ? '상품이 활성화되었습니다.' : '상품이 비활성화되었습니다.', 'success');
      load();
    } catch {
      showToast('변경에 실패했습니다.', 'error');
    }
  };

  const categories = useMemo(() => {
    const cats = [...new Set(products.map((p) => p.category).filter(Boolean))];
    return cats;
  }, [products]);

  const filtered = useMemo(() => {
    if (filter === 'all') return products;
    return products.filter((p) => p.category === filter);
  }, [products, filter]);

  const columns = [
    { key: 'id', label: 'ID', width: '70px' },
    {
      key: 'imageUrl',
      label: '이미지',
      width: '80px',
      render: (val) => val ? (
        <img src={val} alt="" style={{ width: 48, height: 36, objectFit: 'cover', borderRadius: 4 }} loading="lazy" onError={(e) => { e.target.style.display = 'none'; }} />
      ) : '-'
    },
    { key: 'title', label: '상품명', className: 'td-title' },
    {
      key: 'category',
      label: '카테고리',
      render: (val) => <span className="td-badge blue">{CATEGORY_LABELS[val] || val || '-'}</span>
    },
    {
      key: 'price',
      label: '가격',
      width: '100px',
      render: (val) => val != null ? `${Number(val).toLocaleString()}원` : '-'
    },
    {
      key: 'isSoldOut',
      label: '품절',
      width: '70px',
      render: (val, row) => (
        <button
          className={`admin-toggle ${val ? 'on' : ''}`}
          onClick={(e) => { e.stopPropagation(); handleToggleSoldOut(row.id, val); }}
          title={val ? '품절' : '판매중'}
        />
      )
    },
    {
      key: 'isActive',
      label: '활성',
      width: '70px',
      render: (val, row) => (
        <button
          className={`admin-toggle ${val ? 'on' : ''}`}
          onClick={(e) => { e.stopPropagation(); handleToggleActive(row.id, val); }}
          title={val ? '활성' : '비활성'}
        />
      )
    }
  ];

  const actions = (row) => (
    <div className="admin-row-actions">
      <Link to={`/shop/product/edit/${row.id}`} className="admin-row-btn">수정</Link>
      <button className="admin-row-btn danger" onClick={() => handleDelete(row.id, row.title)}>삭제</button>
    </div>
  );

  return (
    <>
      <div className="admin-page-header">
        <h2>상품 관리</h2>
        <Link to="/shop/product/new" className="admin-add-btn">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
          상품 등록
        </Link>
      </div>
      <div className="admin-filter-tabs">
        <button className={`admin-filter-tab ${filter === 'all' ? 'active' : ''}`} onClick={() => setFilter('all')}>
          전체<span className="admin-filter-count">({products.length})</span>
        </button>
        {categories.map((cat) => {
          const count = products.filter((p) => p.category === cat).length;
          return (
            <button key={cat} className={`admin-filter-tab ${filter === cat ? 'active' : ''}`} onClick={() => setFilter(cat)}>
              {CATEGORY_LABELS[cat] || cat}<span className="admin-filter-count">({count})</span>
            </button>
          );
        })}
      </div>
      <AdminDataTable
        columns={columns}
        data={filtered}
        loading={loading}
        searchKeys={['title', 'category']}
        actions={actions}
      />
    </>
  );
};

export default AdminProducts;

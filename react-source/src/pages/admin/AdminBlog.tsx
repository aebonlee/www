import { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import AdminDataTable from '../../components/admin/AdminDataTable';
import { getBlogPosts, deleteBlogPost } from '../../utils/boardStorage';
import { useToast } from '../../contexts/ToastContext';

const AdminBlog = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const { showToast } = useToast();

  const load = async () => {
    setLoading(true);
    const data = await getBlogPosts();
    setPosts(data);
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const handleDelete = async (id, title) => {
    if (!window.confirm(`"${title}" — 정말 삭제하시겠습니까?`)) return;
    try {
      await deleteBlogPost(id);
      showToast('삭제되었습니다.', 'success');
      load();
    } catch (err: any) {
      showToast('삭제 실패: ' + err.message, 'error');
    }
  };

  // Extract unique categories
  const categories = useMemo(() => {
    const cats = [...new Set(posts.map((p) => p.category).filter(Boolean))];
    return cats.sort();
  }, [posts]);

  const filtered = useMemo(() => {
    if (filter === 'all') return posts;
    return posts.filter((p) => p.category === filter);
  }, [posts, filter]);

  const columns = [
    { key: 'id', label: 'ID', width: '70px' },
    { key: 'title', label: '제목', className: 'td-title' },
    {
      key: 'category',
      label: '카테고리',
      render: (val) => <span className="td-badge blue">{val || '-'}</span>
    },
    { key: 'date', label: '작성일', width: '110px' }
  ];

  const actions = (row) => (
    <div className="admin-row-actions">
      <Link to={`/community/blog/edit/${row.id}`} className="admin-row-btn">수정</Link>
      <button className="admin-row-btn danger" onClick={() => handleDelete(row.id, row.title)}>삭제</button>
    </div>
  );

  return (
    <>
      <div className="admin-page-header">
        <h2>블로그 관리</h2>
        <Link to="/community/blog/write" className="admin-add-btn">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
          새 글 작성
        </Link>
      </div>
      {categories.length > 0 && (
        <div className="admin-filter-tabs">
          <button className={`admin-filter-tab ${filter === 'all' ? 'active' : ''}`} onClick={() => setFilter('all')}>
            전체<span className="admin-filter-count">({posts.length})</span>
          </button>
          {categories.map((cat) => {
            const count = posts.filter((p) => p.category === cat).length;
            return (
              <button key={cat} className={`admin-filter-tab ${filter === cat ? 'active' : ''}`} onClick={() => setFilter(cat)}>
                {cat}<span className="admin-filter-count">({count})</span>
              </button>
            );
          })}
        </div>
      )}
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

export default AdminBlog;

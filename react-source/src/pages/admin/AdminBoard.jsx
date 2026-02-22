import { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import AdminDataTable from '../../components/admin/AdminDataTable';
import { getBoardPosts, deleteBoardPost } from '../../utils/boardStorage';
import { useToast } from '../../contexts/ToastContext';

const CATEGORY_LABELS = { notice: '공지', free: '자유', qna: 'Q&A' };
const CATEGORY_COLORS = { notice: 'red', free: 'blue', qna: 'yellow' };

const AdminBoard = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const { showToast } = useToast();

  const load = async () => {
    setLoading(true);
    const data = await getBoardPosts();
    setPosts(data);
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const handleDelete = async (id) => {
    if (!window.confirm('정말 삭제하시겠습니까?')) return;
    const ok = await deleteBoardPost(id);
    if (ok) {
      showToast('게시글이 삭제되었습니다.', 'success');
      load();
    } else {
      showToast('삭제에 실패했습니다.', 'error');
    }
  };

  const categories = useMemo(() => {
    const cats = [...new Set(posts.map((p) => p.category).filter(Boolean))];
    return cats;
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
      render: (val) => (
        <span className={`td-badge ${CATEGORY_COLORS[val] || 'gray'}`}>
          {CATEGORY_LABELS[val] || val || '-'}
        </span>
      )
    },
    { key: 'author', label: '작성자', width: '100px' },
    { key: 'views', label: '조회수', width: '80px' },
    { key: 'date', label: '작성일', width: '110px' }
  ];

  const actions = (row) => (
    <div className="admin-row-actions">
      <Link to={`/community/board/edit/${row.id}`} className="admin-row-btn">수정</Link>
      <button className="admin-row-btn danger" onClick={() => handleDelete(row.id)}>삭제</button>
    </div>
  );

  return (
    <>
      <div className="admin-page-header">
        <h2>게시판 관리</h2>
      </div>
      <div className="admin-filter-tabs">
        <button className={`admin-filter-tab ${filter === 'all' ? 'active' : ''}`} onClick={() => setFilter('all')}>
          전체<span className="admin-filter-count">({posts.length})</span>
        </button>
        {categories.map((cat) => {
          const count = posts.filter((p) => p.category === cat).length;
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
        searchKeys={['title', 'author', 'category']}
        actions={actions}
      />
    </>
  );
};

export default AdminBoard;

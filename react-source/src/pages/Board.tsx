import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useLanguage } from '../contexts/LanguageContext';
import { useAuth } from '../contexts/AuthContext';
import { getBoardPosts, deleteBoardPost } from '../utils/boardStorage';
import Pagination from '../components/Pagination';
import useAOS from '../hooks/useAOS';
import SEOHead from '../components/SEOHead';

const POSTS_PER_PAGE = 20;

const Board = () => {
  const { t } = useLanguage();
  const { isLoggedIn, isAdmin } = useAuth();
  const navigate = useNavigate();
  const [activeFilter, setActiveFilter] = useState('all');
  const [posts, setPosts] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  useAOS();

  const handleEdit = (e, postId) => {
    e.preventDefault();
    e.stopPropagation();
    navigate(`/community/board/edit/${postId}`);
  };

  const handleDeletePost = async (e, postId) => {
    e.preventDefault();
    e.stopPropagation();
    if (!window.confirm(t('community.deleteConfirm') || '삭제하시겠습니까?')) return;
    try {
      await deleteBoardPost(postId);
      setPosts((prev) => prev.filter((p) => p.id !== postId));
    } catch (err: any) {
      console.error('Delete error:', err);
    }
  };

  useEffect(() => {
    (async () => {
      const data = await getBoardPosts();
      setPosts(data.sort((a, b) => b.id - a.id));
    })();
  }, []);

  const filters = [
    { key: 'all', label: t('community.all') },
    { key: 'notice', label: t('community.notice') },
    { key: 'free', label: t('community.free') },
    { key: 'qna', label: t('community.qna') }
  ];

  const filteredPosts = activeFilter === 'all'
    ? posts
    : posts.filter(p => p.category === activeFilter);

  const totalPages = Math.ceil(filteredPosts.length / POSTS_PER_PAGE);
  const paginatedPosts = filteredPosts.slice(
    (currentPage - 1) * POSTS_PER_PAGE,
    currentPage * POSTS_PER_PAGE
  );

  const handleFilterChange = (key) => {
    setActiveFilter(key);
    setCurrentPage(1);
  };

  const categoryLabel = (cat) => {
    switch (cat) {
      case 'notice': return t('community.notice');
      case 'free': return t('community.free');
      case 'qna': return t('community.qna');
      default: return cat;
    }
  };

  return (
    <>
      <SEOHead title="게시판" description="드림아이티비즈 커뮤니티 게시판" path="/community/board" />
      <section className="page-header">
        <div className="container">
          <h1 className="page-title">{t('community.boardTitle')}</h1>
          <p className="page-description">{t('community.boardSubtitle')}</p>
        </div>
      </section>

      <section style={{ padding: '80px 0', background: 'var(--bg-white)' }}>
        <div className="container">
          <div className="board-container" data-aos="fade-up">
            <div className="board-filters">
              {filters.map((f) => (
                <button
                  key={f.key}
                  className={`board-filter-btn ${activeFilter === f.key ? 'active' : ''}`}
                  onClick={() => handleFilterChange(f.key)}
                >
                  {f.label}
                </button>
              ))}
            </div>

            {paginatedPosts.length > 0 ? (
              <table className="board-table">
                <thead>
                  <tr>
                    <th className="col-num">{t('community.number')}</th>
                    <th className="col-title">{t('community.postTitle')}</th>
                    <th className="col-author">{t('community.author')}</th>
                    <th className="col-date">{t('community.date')}</th>
                    <th className="col-views">{t('community.views')}</th>
                    {isAdmin && <th className="col-actions" style={{ width: '100px', textAlign: 'center' }}>관리</th>}
                  </tr>
                </thead>
                <tbody>
                  {paginatedPosts.map((post) => (
                    <tr key={post.id}>
                      <td className="col-num">{post.id}</td>
                      <td className="col-title">
                        <Link to={`/community/board/${post.id}`} className="board-post-link">
                          <span className={`board-category-badge ${post.category}`}>{categoryLabel(post.category)}</span>
                          {post.title}
                        </Link>
                      </td>
                      <td className="col-author">{post.author}</td>
                      <td className="col-date">{post.date}</td>
                      <td className="col-views">{post.views}</td>
                      {isAdmin && (
                        <td className="col-actions" style={{ textAlign: 'center' }}>
                          <div style={{ display: 'flex', gap: '4px', justifyContent: 'center' }}>
                            <button className="board-btn" onClick={(e) => handleEdit(e, post.id)} style={{ fontSize: '12px', padding: '3px 8px' }}>{t('community.edit') || '수정'}</button>
                            <button className="board-btn danger" onClick={(e) => handleDeletePost(e, post.id)} style={{ fontSize: '12px', padding: '3px 8px' }}>{t('community.delete') || '삭제'}</button>
                          </div>
                        </td>
                      )}
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <div className="board-empty">{t('community.noPost')}</div>
            )}

            {isLoggedIn && (
              <div className="board-actions">
                <Link to="/community/board/write" className="board-write-btn">{t('community.writePost')}</Link>
              </div>
            )}

            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={setCurrentPage}
            />
          </div>
        </div>
      </section>
    </>
  );
};

export default Board;

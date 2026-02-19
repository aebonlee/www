import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useLanguage } from '../contexts/LanguageContext';
import { useAuth } from '../contexts/AuthContext';
import { getSyllabusPosts, deleteSyllabusPost } from '../utils/boardStorage';
import Pagination from '../components/Pagination';
import useAOS from '../hooks/useAOS';
import SEOHead from '../components/SEOHead';

const POSTS_PER_PAGE = 20;

const Syllabus = () => {
  const { t } = useLanguage();
  const { isAdmin } = useAuth();
  const navigate = useNavigate();
  const [activeFilter, setActiveFilter] = useState('all');
  const [posts, setPosts] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  useAOS();

  useEffect(() => {
    (async () => {
      const data = await getSyllabusPosts();
      setPosts(data.sort((a, b) => b.id - a.id));
    })();
  }, []);

  const handleEdit = (e, postId) => {
    e.preventDefault();
    e.stopPropagation();
    navigate(`/education/syllabus/edit/${postId}`);
  };

  const handleDeletePost = async (e, postId) => {
    e.preventDefault();
    e.stopPropagation();
    if (!window.confirm(t('community.deleteConfirm') || '삭제하시겠습니까?')) return;
    try {
      await deleteSyllabusPost(postId);
      setPosts((prev) => prev.filter((p) => p.id !== postId));
    } catch (err) {
      console.error('Delete error:', err);
    }
  };

  const filters = [
    { key: 'all', label: t('community.all') },
    { key: 'gen_ai', label: t('education.catGenAi') },
    { key: 'automation', label: t('education.catAutomation') },
    { key: 'certificate', label: t('education.catCertificate') },
    { key: 'corporate', label: t('education.catCorporate') },
    { key: 'programming', label: t('education.catProgramming') },
    { key: 'university', label: t('education.catUniversity') },
    { key: 'etc', label: t('education.catEtc') }
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
      case 'gen_ai': return t('education.catGenAi');
      case 'automation': return t('education.catAutomation');
      case 'certificate': return t('education.catCertificate');
      case 'corporate': return t('education.catCorporate');
      case 'programming': return t('education.catProgramming');
      case 'university': return t('education.catUniversity');
      case 'etc': return t('education.catEtc');
      default: return cat;
    }
  };

  const statusBadge = (status) => {
    const isActive = status === 'active';
    return (
      <span style={{
        display: 'inline-block',
        padding: '2px 8px',
        borderRadius: '4px',
        fontSize: '12px',
        fontWeight: 600,
        color: '#fff',
        background: isActive ? '#00855A' : '#999'
      }}>
        {isActive ? t('education.statusActive') : t('education.statusInactive')}
      </span>
    );
  };

  return (
    <>
      <SEOHead title={t('education.syllabusTitle')} description={t('education.syllabusSubtitle')} path="/education/syllabus" />
      <section className="page-header">
        <div className="container">
          <h1 className="page-title">{t('education.syllabusTitle')}</h1>
          <p className="page-description">{t('education.syllabusSubtitle')}</p>
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
                    <th style={{ width: '80px', textAlign: 'center' }}>{t('education.statusActive')}</th>
                    <th style={{ width: '80px', textAlign: 'center' }}>{t('education.runCount')}</th>
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
                        <Link to={`/education/syllabus/${post.id}`} className="board-post-link">
                          <span className={`board-category-badge ${post.category}`}>{categoryLabel(post.category)}</span>
                          {post.title}
                        </Link>
                      </td>
                      <td style={{ textAlign: 'center' }}>{statusBadge(post.status)}</td>
                      <td style={{ textAlign: 'center' }}>{post.runCount || 0}</td>
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

            {isAdmin && (
              <div className="board-actions">
                <Link to="/education/syllabus/write" className="board-write-btn">{t('community.writePost')}</Link>
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

export default Syllabus;

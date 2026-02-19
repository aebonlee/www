import { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useLanguage } from '../contexts/LanguageContext';
import { useAuth } from '../contexts/AuthContext';
import { getSyllabusPost, deleteSyllabusPost, incrementSyllabusViews } from '../utils/boardStorage';

const SyllabusDetail = () => {
  const { postId } = useParams();
  const navigate = useNavigate();
  const { t } = useLanguage();
  const { isAdmin } = useAuth();
  const [post, setPost] = useState(null);

  useEffect(() => {
    (async () => {
      const found = await getSyllabusPost(postId);
      if (found) {
        await incrementSyllabusViews(postId);
        setPost({ ...found, views: (found.views || 0) + 1 });
      }
    })();
  }, [postId]);

  const categoryLabel = (cat) => {
    switch (cat) {
      case 'ai_basic': return t('education.aiBasic');
      case 'application': return t('education.application');
      case 'custom_etc': return t('education.customEtc');
      default: return cat;
    }
  };

  const handleDelete = async () => {
    if (window.confirm(t('community.deleteConfirm'))) {
      await deleteSyllabusPost(postId);
      navigate('/education/syllabus');
    }
  };

  if (!post) {
    return (
      <>
        <section className="page-header">
          <div className="container">
            <h1 className="page-title">{t('education.syllabusTitle')}</h1>
          </div>
        </section>
        <section style={{ padding: '80px 0', background: 'var(--bg-white)' }}>
          <div className="container" style={{ textAlign: 'center' }}>
            <p style={{ color: 'var(--text-light)', marginBottom: '24px' }}>{t('community.noPost')}</p>
            <Link to="/education/syllabus" className="board-btn primary">{t('community.backToList')}</Link>
          </div>
        </section>
      </>
    );
  }

  const isActive = post.status === 'active';

  return (
    <>
      <section className="page-header">
        <div className="container">
          <h1 className="page-title">{t('education.syllabusTitle')}</h1>
          <p className="page-description">{t('education.syllabusSubtitle')}</p>
        </div>
      </section>

      <section style={{ padding: '80px 0', background: 'var(--bg-white)' }}>
        <div className="container">
          <div className="board-detail">
            <div className="board-detail-header">
              <div style={{ display: 'flex', gap: '8px', marginBottom: '12px', flexWrap: 'wrap' }}>
                <span className={`board-category-badge ${post.category}`}>
                  {categoryLabel(post.category)}
                </span>
                <span style={{
                  display: 'inline-block',
                  padding: '2px 10px',
                  borderRadius: '4px',
                  fontSize: '12px',
                  fontWeight: 600,
                  color: '#fff',
                  background: isActive ? '#00855A' : '#999'
                }}>
                  {isActive ? t('education.statusActive') : t('education.statusInactive')}
                </span>
                <span style={{
                  display: 'inline-block',
                  padding: '2px 10px',
                  borderRadius: '4px',
                  fontSize: '12px',
                  fontWeight: 600,
                  color: 'var(--primary)',
                  background: 'var(--bg-light)'
                }}>
                  {t('education.runCount')}: {post.runCount || 0}
                </span>
              </div>
              <h2 className="board-detail-title">{post.title}</h2>
              <div className="board-detail-meta">
                <span>{t('community.author')}: {post.author}</span>
                <span>{t('community.date')}: {post.date}</span>
                <span>{t('community.views')}: {post.views}</span>
              </div>
            </div>
            <div className="board-detail-body" style={{ whiteSpace: 'pre-wrap' }}>
              {post.content}
            </div>
            <div className="board-detail-footer">
              <Link to="/education/syllabus" className="board-btn">{t('community.backToList')}</Link>
              {isAdmin && (
                <div className="board-detail-actions">
                  <Link to={`/education/syllabus/edit/${post.id}`} className="board-btn">{t('community.edit')}</Link>
                  <button className="board-btn danger" onClick={handleDelete}>{t('community.delete')}</button>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default SyllabusDetail;

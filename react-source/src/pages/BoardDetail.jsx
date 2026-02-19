import { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useLanguage } from '../contexts/LanguageContext';
import { useAuth } from '../contexts/AuthContext';
import { getBoardPost, deleteBoardPost, incrementBoardViews } from '../utils/boardStorage';

const BoardDetail = () => {
  const { postId } = useParams();
  const navigate = useNavigate();
  const { t } = useLanguage();
  const { user, isAdmin } = useAuth();
  const [post, setPost] = useState(null);

  useEffect(() => {
    (async () => {
      const found = await getBoardPost(postId);
      if (found) {
        await incrementBoardViews(postId);
        setPost({ ...found, views: (found.views || 0) + 1 });
      }
    })();
  }, [postId]);

  const categoryLabel = (cat) => {
    switch (cat) {
      case 'notice': return t('community.notice');
      case 'free': return t('community.free');
      case 'qna': return t('community.qna');
      default: return cat;
    }
  };

  const canEditDelete = isAdmin || (user && post?.authorId && user.id === post.authorId);

  const handleDelete = async () => {
    if (window.confirm(t('community.deleteConfirm'))) {
      await deleteBoardPost(postId);
      navigate('/community/board');
    }
  };

  if (!post) {
    return (
      <>
        <section className="page-header">
          <div className="container">
            <h1 className="page-title">{t('community.boardTitle')}</h1>
          </div>
        </section>
        <section style={{ padding: '80px 0', background: 'var(--bg-white)' }}>
          <div className="container" style={{ textAlign: 'center' }}>
            <p style={{ color: 'var(--text-light)', marginBottom: '24px' }}>{t('community.noPost')}</p>
            <Link to="/community/board" className="board-btn primary">{t('community.backToList')}</Link>
          </div>
        </section>
      </>
    );
  }

  return (
    <>
      <section className="page-header">
        <div className="container">
          <h1 className="page-title">{t('community.boardTitle')}</h1>
          <p className="page-description">{t('community.boardSubtitle')}</p>
        </div>
      </section>

      <section style={{ padding: '80px 0', background: 'var(--bg-white)' }}>
        <div className="container">
          <div className="board-detail">
            <div className="board-detail-header">
              <span className={`board-category-badge ${post.category}`}>
                {categoryLabel(post.category)}
              </span>
              <h2 className="board-detail-title">{post.title}</h2>
              <div className="board-detail-meta">
                <span>{t('community.author')}: {post.author}</span>
                <span>{t('community.date')}: {post.date}</span>
                <span>{t('community.views')}: {post.views}</span>
              </div>
            </div>
            <div className="board-detail-body">
              {post.content}
            </div>
            <div className="board-detail-footer">
              <Link to="/community/board" className="board-btn">{t('community.backToList')}</Link>
              {canEditDelete && (
                <div className="board-detail-actions">
                  <Link to={`/community/board/edit/${post.id}`} className="board-btn">{t('community.edit')}</Link>
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

export default BoardDetail;

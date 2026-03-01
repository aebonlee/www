import { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useLanguage } from '../contexts/LanguageContext';
import { useAuth } from '../contexts/AuthContext';
import { getBlogPost, deleteBlogPost } from '../utils/boardStorage';
import CommentSection from '../components/CommentSection';

const BlogDetail = () => {
  const { postId } = useParams();
  const navigate = useNavigate();
  const { t, language } = useLanguage();
  const { isAdmin } = useAuth();
  const [post, setPost] = useState(null);

  useEffect(() => {
    (async () => {
      setPost(await getBlogPost(postId));
    })();
  }, [postId]);

  const handleDelete = async () => {
    if (window.confirm(t('community.deleteConfirm'))) {
      await deleteBlogPost(postId);
      navigate('/community/blog');
    }
  };

  if (!post) {
    return (
      <>
        <section className="page-header">
          <div className="container">
            <h1 className="page-title">{t('community.blogTitle')}</h1>
          </div>
        </section>
        <section style={{ padding: '80px 0', background: 'var(--bg-white)' }}>
          <div className="container" style={{ textAlign: 'center' }}>
            <p style={{ color: 'var(--text-light)', marginBottom: '24px' }}>{t('community.noPost')}</p>
            <Link to="/community/blog" className="board-btn primary">{t('community.backToList')}</Link>
          </div>
        </section>
      </>
    );
  }

  const title = language === 'en' ? post.titleEn : post.title;
  const category = language === 'en' ? post.categoryEn : post.category;
  const excerpt = language === 'en' ? post.excerptEn : post.excerpt;
  const content = language === 'en' ? post.contentEn : post.content;

  return (
    <>
      <section className="page-header">
        <div className="container">
          <h1 className="page-title">{t('community.blogTitle')}</h1>
          <p className="page-description">{t('community.blogSubtitle')}</p>
        </div>
      </section>

      <section style={{ padding: '80px 0', background: 'var(--bg-white)' }}>
        <div className="container">
          <div className="blog-detail">
            <div className="blog-detail-hero">
              {post.imageUrl ? (
                <img src={post.imageUrl} alt={title} loading="lazy" style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: 'var(--radius-md)' }} />
              ) : (
                <span>{post.icon}</span>
              )}
            </div>
            <div className="blog-detail-meta">
              <span className="blog-detail-category">{category}</span>
              <span className="blog-detail-date">{post.date}</span>
            </div>
            <h1 className="blog-detail-title">{title}</h1>
            <p className="blog-detail-excerpt">{excerpt}</p>
            <div className="blog-detail-content">{content}</div>
            <div className="blog-detail-footer">
              <Link to="/community/blog" className="board-btn">{t('community.backToList')}</Link>
              {isAdmin && (
                <div className="board-detail-actions">
                  <Link to={`/community/blog/edit/${post.id}`} className="board-btn">{t('community.edit')}</Link>
                  <button className="board-btn danger" onClick={handleDelete}>{t('community.delete')}</button>
                </div>
              )}
            </div>
            <CommentSection postId={postId} postType="blog" />
          </div>
        </div>
      </section>
    </>
  );
};

export default BlogDetail;

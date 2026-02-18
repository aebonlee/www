import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useLanguage } from '../contexts/LanguageContext';
import { getBlogPost } from '../utils/boardStorage';

const BlogDetail = () => {
  const { postId } = useParams();
  const { t, language } = useLanguage();
  const [post, setPost] = useState(null);

  useEffect(() => {
    setPost(getBlogPost(postId));
  }, [postId]);

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
              <span>{post.icon}</span>
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
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default BlogDetail;

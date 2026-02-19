import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../contexts/LanguageContext';
import { getBlogPosts } from '../utils/boardStorage';
import Pagination from '../components/Pagination';
import useAOS from '../hooks/useAOS';

const POSTS_PER_PAGE = 6;

const estimateReadTime = (text) => {
  if (!text) return 1;
  const len = text.replace(/\s+/g, '').length;
  if (len > 0 && /[\uAC00-\uD7AF]/.test(text)) {
    return Math.max(1, Math.ceil(len / 500));
  }
  return Math.max(1, Math.ceil(text.trim().split(/\s+/).length / 200));
};

const Blog = () => {
  const { t, language } = useLanguage();
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  useAOS();

  useEffect(() => {
    (async () => {
      try {
        const data = await getBlogPosts();
        setPosts(data.sort((a, b) => b.id - a.id));
      } catch (err) {
        console.error('Blog load error:', err);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const totalPages = Math.ceil(posts.length / POSTS_PER_PAGE);
  const paginatedPosts = posts.slice(
    (currentPage - 1) * POSTS_PER_PAGE,
    currentPage * POSTS_PER_PAGE
  );

  const featured = currentPage === 1 ? paginatedPosts[0] : null;
  const gridPosts = currentPage === 1 ? paginatedPosts.slice(1) : paginatedPosts;

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
          {loading ? (
            <div style={{ textAlign: 'center', padding: '60px 0', color: 'var(--text-light)' }}>
              {t('community.loading') || '로딩 중...'}
            </div>
          ) : posts.length === 0 ? (
            <div className="board-empty">{t('community.noPost')}</div>
          ) : (
          <>
          {featured && (
            <Link
              to={`/community/blog/${featured.id}`}
              className="blog-featured"
              data-aos="fade-up"
              style={{ textDecoration: 'none', color: 'inherit' }}
            >
              <div className="blog-featured-image">
                <span className="blog-image-icon">{featured.icon}</span>
              </div>
              <div className="blog-featured-content">
                <div className="blog-meta">
                  <span className="blog-category">
                    {language === 'en' ? featured.categoryEn : featured.category}
                  </span>
                  <span className="blog-date">{featured.date}</span>
                  <span className="blog-read-time">
                    {estimateReadTime(language === 'en' ? featured.contentEn : featured.content)} min read
                  </span>
                </div>
                <h2>{language === 'en' ? featured.titleEn : featured.title}</h2>
                <p>{language === 'en' ? featured.excerptEn : featured.excerpt}</p>
                <span className="blog-link">{t('community.readMore')} →</span>
              </div>
            </Link>
          )}

          <div className="blog-grid">
            {gridPosts.map((post, i) => (
              <Link
                to={`/community/blog/${post.id}`}
                key={post.id}
                className="blog-card"
                data-aos="fade-up"
                data-aos-delay={i * 50}
                style={{ textDecoration: 'none', color: 'inherit' }}
              >
                <div className="blog-image">
                  <span className="blog-image-icon">{post.icon}</span>
                </div>
                <div className="blog-content">
                  <div className="blog-meta">
                    <span className="blog-category">
                      {language === 'en' ? post.categoryEn : post.category}
                    </span>
                    <span className="blog-date">{post.date}</span>
                    <span className="blog-read-time">
                      {estimateReadTime(language === 'en' ? post.contentEn : post.content)} min read
                    </span>
                  </div>
                  <h3>{language === 'en' ? post.titleEn : post.title}</h3>
                  <p>{language === 'en' ? post.excerptEn : post.excerpt}</p>
                  <span className="blog-link">{t('community.readMore')} →</span>
                </div>
              </Link>
            ))}
          </div>
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
          />
          </>
          )}
        </div>
      </section>
    </>
  );
};

export default Blog;

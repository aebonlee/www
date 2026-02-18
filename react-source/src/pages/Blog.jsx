import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../contexts/LanguageContext';
import { getBlogPosts } from '../utils/boardStorage';
import Pagination from '../components/Pagination';
import useAOS from '../hooks/useAOS';

const POSTS_PER_PAGE = 6;

const Blog = () => {
  const { t, language } = useLanguage();
  const [posts, setPosts] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  useAOS();

  useEffect(() => {
    setPosts(getBlogPosts().sort((a, b) => b.id - a.id));
  }, []);

  const totalPages = Math.ceil(posts.length / POSTS_PER_PAGE);
  const paginatedPosts = posts.slice(
    (currentPage - 1) * POSTS_PER_PAGE,
    currentPage * POSTS_PER_PAGE
  );

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
          <div className="blog-grid">
            {paginatedPosts.map((post, i) => (
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
        </div>
      </section>
    </>
  );
};

export default Blog;

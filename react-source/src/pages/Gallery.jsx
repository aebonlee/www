import { useState, useEffect, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useLanguage } from '../contexts/LanguageContext';
import { useAuth } from '../contexts/AuthContext';
import { useToast } from '../contexts/ToastContext';
import { getGalleryItems, deleteGalleryItem } from '../utils/boardStorage';
import Pagination from '../components/Pagination';
import useAOS from '../hooks/useAOS';
import SEOHead from '../components/SEOHead';

const ITEMS_PER_PAGE = 8;

const GRADIENTS = [
  'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
  'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
  'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
  'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)',
  'linear-gradient(135deg, #fa709a 0%, #fee140 100%)',
  'linear-gradient(135deg, #a18cd1 0%, #fbc2eb 100%)',
  'linear-gradient(135deg, #fccb90 0%, #d57eeb 100%)',
  'linear-gradient(135deg, #89f7fe 0%, #66a6ff 100%)',
];

const Gallery = () => {
  const { t, language } = useLanguage();
  const { isAdmin } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [lightboxItem, setLightboxItem] = useState(null);
  useAOS();

  useEffect(() => {
    (async () => {
      try {
        const data = await getGalleryItems();
        setItems(data.sort((a, b) => b.id - a.id));
      } catch (err) {
        console.error('Gallery load error:', err);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const filters = [
    { key: 'all', label: t('community.all') },
    { key: 'project', label: t('community.galleryProject') },
    { key: 'office', label: t('community.galleryOffice') },
    { key: 'event', label: t('community.galleryEvent') },
    { key: 'education', label: t('community.galleryEducation') }
  ];

  const getCategoryLabel = (key) => {
    const found = filters.find((f) => f.key === key);
    return found ? found.label : key;
  };

  const filteredItems = activeFilter === 'all'
    ? items
    : items.filter((item) => item.category === activeFilter);

  const totalPages = Math.ceil(filteredItems.length / ITEMS_PER_PAGE);
  const paginatedItems = filteredItems.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const handleFilterChange = (key) => {
    setActiveFilter(key);
    setCurrentPage(1);
  };

  const filteredForLightbox = filteredItems;

  const openLightbox = (item) => setLightboxItem(item);
  const closeLightbox = () => setLightboxItem(null);

  const navigateLightbox = useCallback((dir) => {
    if (!lightboxItem) return;
    const idx = filteredForLightbox.findIndex((i) => i.id === lightboxItem.id);
    const next = idx + dir;
    if (next >= 0 && next < filteredForLightbox.length) {
      setLightboxItem(filteredForLightbox[next]);
    }
  }, [lightboxItem, filteredForLightbox]);

  useEffect(() => {
    if (!lightboxItem) return;
    const handleKey = (e) => {
      if (e.key === 'Escape') closeLightbox();
      if (e.key === 'ArrowLeft') navigateLightbox(-1);
      if (e.key === 'ArrowRight') navigateLightbox(1);
    };
    window.addEventListener('keydown', handleKey);
    document.body.style.overflow = 'hidden';
    return () => {
      window.removeEventListener('keydown', handleKey);
      document.body.style.overflow = '';
    };
  }, [lightboxItem, navigateLightbox]);

  const handleDelete = async (e, item) => {
    e.stopPropagation();
    const title = language === 'en' ? item.titleEn : item.title;
    if (!window.confirm(`"${title}" — ${t('community.confirmDelete') || '삭제하시겠습니까?'}`)) return;
    try {
      await deleteGalleryItem(item.id);
      setItems((prev) => prev.filter((i) => i.id !== item.id));
      if (lightboxItem?.id === item.id) closeLightbox();
    } catch (err) {
      console.error('Delete error:', err);
      showToast(t('community.deleteError') || '삭제에 실패했습니다.', 'error');
    }
  };

  const handleEdit = (e, item) => {
    e.stopPropagation();
    navigate(`/community/gallery/edit/${item.id}`);
  };

  const getGradient = (id) => GRADIENTS[(id - 1) % GRADIENTS.length];

  const lightboxIdx = lightboxItem
    ? filteredForLightbox.findIndex((i) => i.id === lightboxItem.id)
    : -1;

  return (
    <>
      <SEOHead title="갤러리" description="드림아이티비즈 갤러리 - 프로젝트 사진 및 활동 기록" path="/community/gallery" />
      <section className="page-header">
        <div className="container">
          <h1 className="page-title">{t('community.galleryTitle')}</h1>
          <p className="page-description">{t('community.gallerySubtitle')}</p>
        </div>
      </section>

      <section style={{ padding: '80px 0', background: 'var(--bg-white)' }}>
        <div className="container">
          {isAdmin && (
            <div className="board-actions" style={{ marginBottom: '24px' }}>
              <Link to="/community/gallery/write" className="board-write-btn">{t('auth.uploadImage')}</Link>
            </div>
          )}
          <div className="gallery-filters" data-aos="fade-up">
            {filters.map((f) => (
              <button
                key={f.key}
                className={`gallery-filter-btn ${activeFilter === f.key ? 'active' : ''}`}
                onClick={() => handleFilterChange(f.key)}
              >
                {f.label}
              </button>
            ))}
          </div>

          {loading ? (
            <div style={{ textAlign: 'center', padding: '60px 0', color: 'var(--text-light)' }}>
              {t('community.loading') || '로딩 중...'}
            </div>
          ) : filteredItems.length === 0 ? (
            <div className="board-empty">{t('community.noPost')}</div>
          ) : (
          <>
          <div className="gallery-grid">
            {paginatedItems.map((item, i) => (
              <div
                key={item.id}
                className="gallery-card"
                data-aos="fade-up"
                data-aos-delay={i * 50}
                onClick={() => openLightbox(item)}
              >
                <div className="gallery-thumb">
                  {item.imageUrl ? (
                    <img
                      src={item.imageUrl}
                      alt={language === 'en' ? item.titleEn : item.title}
                      className="gallery-thumb-image"
                    />
                  ) : (
                    <div
                      className="gallery-thumb-gradient"
                      style={{ background: getGradient(item.id) }}
                    >
                      <span className="gallery-thumb-label">
                        {language === 'en' ? item.titleEn : item.title}
                      </span>
                    </div>
                  )}
                  <div className="gallery-overlay">
                    <span className="gallery-overlay-icon">+</span>
                  </div>
                </div>
                <div className="gallery-info">
                  <span className="gallery-category-badge">{getCategoryLabel(item.category)}</span>
                  <h4>{language === 'en' ? item.titleEn : item.title}</h4>
                  {(language === 'en' ? item.descriptionEn : item.description) && (
                    <p className="gallery-desc">
                      {language === 'en' ? item.descriptionEn : item.description}
                    </p>
                  )}
                  <span className="gallery-date">{item.date}</span>
                  {isAdmin && (
                    <div className="gallery-admin-actions">
                      <button className="gallery-admin-btn edit" onClick={(e) => handleEdit(e, item)} title={t('community.edit') || '수정'}>
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
                      </button>
                      <button className="gallery-admin-btn delete" onClick={(e) => handleDelete(e, item)} title={t('community.delete') || '삭제'}>
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>
                      </button>
                    </div>
                  )}
                </div>
              </div>
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

      {lightboxItem && (
        <div className="lightbox-overlay" onClick={closeLightbox}>
          <div className="lightbox-content" onClick={(e) => e.stopPropagation()}>
            <button className="lightbox-close" onClick={closeLightbox}>×</button>
            <div
              className="lightbox-image"
              style={lightboxItem.imageUrl ? {} : { background: getGradient(lightboxItem.id) }}
            >
              {lightboxItem.imageUrl ? (
                <img src={lightboxItem.imageUrl} alt={language === 'en' ? lightboxItem.titleEn : lightboxItem.title} style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
              ) : (
                language === 'en' ? lightboxItem.titleEn : lightboxItem.title
              )}
            </div>
            <div className="lightbox-body">
              <h3>{language === 'en' ? lightboxItem.titleEn : lightboxItem.title}</h3>
              <p>{language === 'en' ? lightboxItem.descriptionEn : lightboxItem.description}</p>
              <div className="lightbox-date">{lightboxItem.date}</div>
              {isAdmin && (
                <div className="lightbox-admin-actions">
                  <Link to={`/community/gallery/edit/${lightboxItem.id}`} className="lightbox-admin-btn edit">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="14" height="14"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
                    {t('community.edit') || '수정'}
                  </Link>
                  <button onClick={(e) => handleDelete(e, lightboxItem)} className="lightbox-admin-btn delete">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="14" height="14"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>
                    {t('community.delete') || '삭제'}
                  </button>
                </div>
              )}
            </div>
            {lightboxIdx > 0 && (
              <button
                className="lightbox-nav prev"
                onClick={() => navigateLightbox(-1)}
              >
                ‹
              </button>
            )}
            {lightboxIdx < filteredForLightbox.length - 1 && (
              <button
                className="lightbox-nav next"
                onClick={() => navigateLightbox(1)}
              >
                ›
              </button>
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default Gallery;

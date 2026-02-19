import { useState, useEffect, useCallback } from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { getGalleryItems } from '../utils/boardStorage';
import Pagination from '../components/Pagination';
import useAOS from '../hooks/useAOS';

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
  const [items, setItems] = useState([]);
  const [activeFilter, setActiveFilter] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [lightboxItem, setLightboxItem] = useState(null);
  useAOS();

  useEffect(() => {
    (async () => {
      const data = await getGalleryItems();
      setItems(data.sort((a, b) => b.id - a.id));
    })();
  }, []);

  const filters = [
    { key: 'all', label: t('community.all') },
    { key: 'project', label: t('community.galleryProject') },
    { key: 'office', label: t('community.galleryOffice') },
    { key: 'event', label: t('community.galleryEvent') },
    { key: 'education', label: t('community.galleryEducation') }
  ];

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

  const getGradient = (id) => GRADIENTS[(id - 1) % GRADIENTS.length];

  const lightboxIdx = lightboxItem
    ? filteredForLightbox.findIndex((i) => i.id === lightboxItem.id)
    : -1;

  return (
    <>
      <section className="page-header">
        <div className="container">
          <h1 className="page-title">{t('community.galleryTitle')}</h1>
          <p className="page-description">{t('community.gallerySubtitle')}</p>
        </div>
      </section>

      <section style={{ padding: '80px 0', background: 'var(--bg-white)' }}>
        <div className="container">
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
                  <div
                    className="gallery-thumb-gradient"
                    style={{ background: getGradient(item.id) }}
                  >
                    <span className="gallery-thumb-label">
                      {language === 'en' ? item.titleEn : item.title}
                    </span>
                  </div>
                  <div className="gallery-overlay">
                    <span className="gallery-overlay-icon">+</span>
                  </div>
                </div>
                <div className="gallery-info">
                  <span className="gallery-category-badge">{item.category}</span>
                  <h4>{language === 'en' ? item.titleEn : item.title}</h4>
                  <p className="gallery-desc">
                    {language === 'en' ? item.descriptionEn : item.description}
                  </p>
                  <span className="gallery-date">{item.date}</span>
                </div>
              </div>
            ))}
          </div>

          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
          />
        </div>
      </section>

      {lightboxItem && (
        <div className="lightbox-overlay" onClick={closeLightbox}>
          <div className="lightbox-content" onClick={(e) => e.stopPropagation()}>
            <button className="lightbox-close" onClick={closeLightbox}>×</button>
            <div
              className="lightbox-image"
              style={{ background: getGradient(lightboxItem.id) }}
            >
              {language === 'en' ? lightboxItem.titleEn : lightboxItem.title}
            </div>
            <div className="lightbox-body">
              <h3>{language === 'en' ? lightboxItem.titleEn : lightboxItem.title}</h3>
              <p>{language === 'en' ? lightboxItem.descriptionEn : lightboxItem.description}</p>
              <div className="lightbox-date">{lightboxItem.date}</div>
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

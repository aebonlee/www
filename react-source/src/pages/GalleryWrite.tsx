import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useLanguage } from '../contexts/LanguageContext';
import { useAuth } from '../contexts/AuthContext';
import { getGalleryItem, createGalleryItem, updateGalleryItem } from '../utils/boardStorage';
import ImageUpload from '../components/ImageUpload';

const GalleryWrite = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { t } = useLanguage();
  const { user } = useAuth();
  const isEdit = Boolean(id);

  const [form, setForm] = useState({
    category: 'project',
    title: '',
    titleEn: '',
    description: '',
    descriptionEn: '',
    imageUrl: ''
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isEdit) {
      (async () => {
        const item = await getGalleryItem(id);
        if (item) {
          setForm({
            category: item.category || 'project',
            title: item.title || '',
            titleEn: item.titleEn || '',
            description: item.description || '',
            descriptionEn: item.descriptionEn || '',
            imageUrl: item.imageUrl || ''
          });
        }
      })();
    }
  }, [id, isEdit]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.title.trim()) return;
    setLoading(true);

    const itemData = {
      category: form.category,
      title: form.title.trim(),
      titleEn: form.titleEn.trim(),
      description: form.description.trim(),
      descriptionEn: form.descriptionEn.trim(),
      imageUrl: form.imageUrl,
      authorId: user?.id
    };

    try {
      if (isEdit) {
        await updateGalleryItem(id, itemData);
      } else {
        await createGalleryItem(itemData);
      }
      navigate('/community/gallery');
    } catch (err: any) {
      console.error('Gallery save error:', err);
    } finally {
      setLoading(false);
    }
  };

  const categories = [
    { key: 'project', label: t('community.galleryProject') },
    { key: 'office', label: t('community.galleryOffice') },
    { key: 'event', label: t('community.galleryEvent') },
    { key: 'education', label: t('community.galleryEducation') }
  ];

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
          <div className="board-write">
            <h2>{isEdit ? t('community.editPost') : t('community.newPost')}</h2>
            <form onSubmit={handleSubmit}>
              <div className="board-form-group">
                <label>{t('community.category')}</label>
                <select name="category" value={form.category} onChange={handleChange}>
                  {categories.map(c => (
                    <option key={c.key} value={c.key}>{c.label}</option>
                  ))}
                </select>
              </div>
              <div className="board-form-row">
                <div className="board-form-group">
                  <label>{t('community.postTitle')}</label>
                  <input
                    type="text"
                    name="title"
                    value={form.title}
                    onChange={handleChange}
                    placeholder={t('community.titlePlaceholder')}
                    required
                  />
                </div>
                <div className="board-form-group">
                  <label>{t('community.postTitle')} (EN)</label>
                  <input
                    type="text"
                    name="titleEn"
                    value={form.titleEn}
                    onChange={handleChange}
                    placeholder="Title in English"
                  />
                </div>
              </div>
              <div className="board-form-row">
                <div className="board-form-group">
                  <label>{t('community.content')}</label>
                  <textarea
                    name="description"
                    value={form.description}
                    onChange={handleChange}
                    placeholder={t('community.contentPlaceholder')}
                  />
                </div>
                <div className="board-form-group">
                  <label>{t('community.content')} (EN)</label>
                  <textarea
                    name="descriptionEn"
                    value={form.descriptionEn}
                    onChange={handleChange}
                    placeholder="Description in English"
                  />
                </div>
              </div>
              <div className="board-form-group">
                <label>{t('auth.uploadImage')}</label>
                <ImageUpload
                  value={form.imageUrl}
                  onChange={(url) => setForm({ ...form, imageUrl: url })}
                  folder="gallery"
                />
              </div>
              <div className="board-form-actions">
                <Link to="/community/gallery" className="board-btn">{t('community.cancel')}</Link>
                <button type="submit" className="board-btn primary" disabled={loading}>
                  {isEdit ? t('community.update') : t('community.submit')}
                </button>
              </div>
            </form>
          </div>
        </div>
      </section>
    </>
  );
};

export default GalleryWrite;

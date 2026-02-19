import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useLanguage } from '../contexts/LanguageContext';
import { useAuth } from '../contexts/AuthContext';
import { getBlogPost, createBlogPost, updateBlogPost } from '../utils/boardStorage';

const BlogWrite = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { t } = useLanguage();
  const { user } = useAuth();
  const isEdit = Boolean(id);

  const [form, setForm] = useState({
    category: 'IT 트렌드',
    categoryEn: 'IT Trends',
    title: '',
    titleEn: '',
    excerpt: '',
    excerptEn: '',
    content: '',
    contentEn: '',
    icon: '💻',
    imageUrl: ''
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isEdit) {
      (async () => {
        const post = await getBlogPost(id);
        if (post) {
          setForm({
            category: post.category || '',
            categoryEn: post.categoryEn || '',
            title: post.title || '',
            titleEn: post.titleEn || '',
            excerpt: post.excerpt || '',
            excerptEn: post.excerptEn || '',
            content: post.content || '',
            contentEn: post.contentEn || '',
            icon: post.icon || '💻',
            imageUrl: post.imageUrl || ''
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
    if (!form.title.trim() || !form.content.trim()) return;
    setLoading(true);

    const postData = {
      category: form.category.trim(),
      categoryEn: form.categoryEn.trim(),
      title: form.title.trim(),
      titleEn: form.titleEn.trim(),
      excerpt: form.excerpt.trim(),
      excerptEn: form.excerptEn.trim(),
      content: form.content.trim(),
      contentEn: form.contentEn.trim(),
      icon: form.icon,
      imageUrl: form.imageUrl.trim(),
      authorId: user?.id
    };

    try {
      if (isEdit) {
        await updateBlogPost(id, postData);
        navigate(`/community/blog/${id}`);
      } else {
        const newPost = await createBlogPost(postData);
        navigate(`/community/blog/${newPost.id}`);
      }
    } catch (err) {
      console.error('Blog save error:', err);
    } finally {
      setLoading(false);
    }
  };

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
          <div className="board-write">
            <h2>{isEdit ? t('community.editPost') : t('community.newPost')}</h2>
            <form onSubmit={handleSubmit}>
              <div className="board-form-row">
                <div className="board-form-group">
                  <label>{t('community.category')}</label>
                  <input
                    type="text"
                    name="category"
                    value={form.category}
                    onChange={handleChange}
                    placeholder="카테고리"
                    required
                  />
                </div>
                <div className="board-form-group">
                  <label>{t('community.category')} (EN)</label>
                  <input
                    type="text"
                    name="categoryEn"
                    value={form.categoryEn}
                    onChange={handleChange}
                    placeholder="Category"
                  />
                </div>
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
                  <label>요약 (Excerpt)</label>
                  <input
                    type="text"
                    name="excerpt"
                    value={form.excerpt}
                    onChange={handleChange}
                    placeholder="글 요약"
                  />
                </div>
                <div className="board-form-group">
                  <label>Excerpt (EN)</label>
                  <input
                    type="text"
                    name="excerptEn"
                    value={form.excerptEn}
                    onChange={handleChange}
                    placeholder="Summary in English"
                  />
                </div>
              </div>
              <div className="board-form-row">
                <div className="board-form-group">
                  <label>아이콘 (Emoji)</label>
                  <input
                    type="text"
                    name="icon"
                    value={form.icon}
                    onChange={handleChange}
                    placeholder="💻"
                  />
                </div>
                <div className="board-form-group">
                  <label>이미지 URL</label>
                  <input
                    type="text"
                    name="imageUrl"
                    value={form.imageUrl}
                    onChange={handleChange}
                    placeholder="https://..."
                  />
                </div>
              </div>
              <div className="board-form-group">
                <label>{t('community.content')}</label>
                <textarea
                  name="content"
                  value={form.content}
                  onChange={handleChange}
                  placeholder={t('community.contentPlaceholder')}
                  required
                  style={{ minHeight: '200px' }}
                />
              </div>
              <div className="board-form-group">
                <label>{t('community.content')} (EN)</label>
                <textarea
                  name="contentEn"
                  value={form.contentEn}
                  onChange={handleChange}
                  placeholder="Content in English"
                  style={{ minHeight: '200px' }}
                />
              </div>
              <div className="board-form-actions">
                <Link to="/community/blog" className="board-btn">{t('community.cancel')}</Link>
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

export default BlogWrite;

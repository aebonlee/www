import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useLanguage } from '../contexts/LanguageContext';
import { useAuth } from '../contexts/AuthContext';
import { getSyllabusPost, createSyllabusPost, updateSyllabusPost } from '../utils/boardStorage';

const SyllabusWrite = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { t } = useLanguage();
  const { user, profile, isLoggedIn } = useAuth();
  const isEdit = Boolean(id);

  const [form, setForm] = useState({
    category: 'gen_ai',
    title: '',
    content: '',
    author: '',
    status: 'active',
    runCount: 0
  });

  useEffect(() => {
    if (!isEdit && profile) {
      setForm(prev => ({ ...prev, author: profile.display_name || '' }));
    }
  }, [isEdit, profile]);

  useEffect(() => {
    if (isEdit) {
      (async () => {
        const post = await getSyllabusPost(id);
        if (post) {
          setForm({
            category: post.category,
            title: post.title,
            content: post.content,
            author: post.author,
            status: post.status || 'active',
            runCount: post.runCount || 0
          });
        }
      })();
    }
  }, [id, isEdit]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: name === 'runCount' ? Number(value) : value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.title.trim() || !form.content.trim()) return;

    if (isEdit) {
      await updateSyllabusPost(id, {
        category: form.category,
        title: form.title.trim(),
        content: form.content.trim(),
        author: form.author.trim(),
        status: form.status,
        runCount: form.runCount
      });
      navigate(`/education/syllabus/${id}`);
    } else {
      const newPost = await createSyllabusPost({
        category: form.category,
        title: form.title.trim(),
        content: form.content.trim(),
        author: form.author.trim(),
        authorId: user?.id,
        status: form.status,
        runCount: form.runCount
      });
      navigate(`/education/syllabus/${newPost.id}`);
    }
  };

  if (!isLoggedIn) {
    navigate('/login', { state: { from: { pathname: '/education/syllabus/write' } } });
    return null;
  }

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
          <div className="board-write">
            <h2>{isEdit ? t('community.editPost') : t('community.newPost')}</h2>
            <form onSubmit={handleSubmit}>
              <div className="board-form-row">
                <div className="board-form-group">
                  <label>{t('community.category')}</label>
                  <select name="category" value={form.category} onChange={handleChange}>
                    <option value="gen_ai">{t('education.catGenAi')}</option>
                    <option value="automation">{t('education.catAutomation')}</option>
                    <option value="certificate">{t('education.catCertificate')}</option>
                    <option value="corporate">{t('education.catCorporate')}</option>
                    <option value="programming">{t('education.catProgramming')}</option>
                    <option value="university">{t('education.catUniversity')}</option>
                    <option value="etc">{t('education.catEtc')}</option>
                  </select>
                </div>
                <div className="board-form-group">
                  <label>{t('education.statusActive')}/{t('education.statusInactive')}</label>
                  <select name="status" value={form.status} onChange={handleChange}>
                    <option value="active">{t('education.statusActive')}</option>
                    <option value="inactive">{t('education.statusInactive')}</option>
                  </select>
                </div>
              </div>
              <div className="board-form-row">
                <div className="board-form-group">
                  <label>{t('education.runCount')}</label>
                  <input
                    type="number"
                    name="runCount"
                    value={form.runCount}
                    onChange={handleChange}
                    min="0"
                  />
                </div>
                <div className="board-form-group">
                  <label>{t('community.author')}</label>
                  <input
                    type="text"
                    name="author"
                    value={form.author}
                    onChange={handleChange}
                    placeholder={t('community.authorPlaceholder')}
                    required
                  />
                </div>
              </div>
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
                <label>{t('community.content')}</label>
                <textarea
                  name="content"
                  value={form.content}
                  onChange={handleChange}
                  placeholder={t('community.contentPlaceholder')}
                  required
                />
              </div>
              <div className="board-form-actions">
                <Link to="/education/syllabus" className="board-btn">{t('community.cancel')}</Link>
                <button type="submit" className="board-btn primary">
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

export default SyllabusWrite;

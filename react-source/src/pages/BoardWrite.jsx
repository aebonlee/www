import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useLanguage } from '../contexts/LanguageContext';
import { getBoardPost, createBoardPost, updateBoardPost } from '../utils/boardStorage';

const BoardWrite = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { t } = useLanguage();
  const isEdit = Boolean(id);

  const [form, setForm] = useState({
    category: 'free',
    title: '',
    author: '',
    content: ''
  });

  useEffect(() => {
    if (isEdit) {
      const post = getBoardPost(id);
      if (post) {
        setForm({
          category: post.category,
          title: post.title,
          author: post.author,
          content: post.content
        });
      }
    }
  }, [id, isEdit]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.title.trim() || !form.content.trim() || !form.author.trim()) return;

    if (isEdit) {
      updateBoardPost(id, {
        category: form.category,
        title: form.title.trim(),
        author: form.author.trim(),
        content: form.content.trim()
      });
      navigate(`/community/board/${id}`);
    } else {
      const newPost = createBoardPost({
        category: form.category,
        title: form.title.trim(),
        content: form.content.trim(),
        author: form.author.trim()
      });
      navigate(`/community/board/${newPost.id}`);
    }
  };

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
          <div className="board-write">
            <h2>{isEdit ? t('community.editPost') : t('community.newPost')}</h2>
            <form onSubmit={handleSubmit}>
              <div className="board-form-row">
                <div className="board-form-group">
                  <label>{t('community.category')}</label>
                  <select name="category" value={form.category} onChange={handleChange}>
                    <option value="notice">{t('community.notice')}</option>
                    <option value="free">{t('community.free')}</option>
                    <option value="qna">{t('community.qna')}</option>
                  </select>
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
                <Link to="/community/board" className="board-btn">{t('community.cancel')}</Link>
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

export default BoardWrite;

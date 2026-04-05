import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useLanguage } from '../contexts/LanguageContext';
import { getProduct, createProduct, updateProduct } from '../utils/productStorage';
import ImageUpload from '../components/ImageUpload';

const ProductWrite = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { t } = useLanguage();
  const isEdit = Boolean(id);

  const [form, setForm] = useState({
    slug: '',
    category: 'book',
    title: '',
    titleEn: '',
    description: '',
    descriptionEn: '',
    price: 0,
    imageUrl: '',
    sortOrder: 0
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (isEdit) {
      (async () => {
        const product = await getProduct(id);
        if (product) {
          setForm({
            slug: product.slug || '',
            category: product.category || 'book',
            title: product.title || '',
            titleEn: product.titleEn || '',
            description: product.description || '',
            descriptionEn: product.descriptionEn || '',
            price: product.price || 0,
            imageUrl: product.imageUrl || '',
            sortOrder: product.sortOrder || 0
          });
        }
      })();
    }
  }, [id, isEdit]);

  const handleChange = (e) => {
    const { name, value, type } = e.target;
    setForm({ ...form, [name]: type === 'number' ? Number(value) : value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.title.trim() || !form.slug.trim()) return;
    setLoading(true);
    setError('');

    try {
      if (isEdit) {
        await updateProduct(id, form);
      } else {
        await createProduct(form);
      }
      navigate('/shop');
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const categories = [
    { key: 'book', label: t('shop.book') },
    { key: 'ebook', label: t('shop.ebook') },
    { key: 'periodical', label: t('shop.periodical') },
    { key: 'course', label: t('shop.course') }
  ];

  return (
    <>
      <section className="page-header">
        <div className="container">
          <h1 className="page-title">{isEdit ? t('auth.editProduct') : t('auth.addProduct')}</h1>
        </div>
      </section>

      <section style={{ padding: '80px 0', background: 'var(--bg-white)' }}>
        <div className="container">
          <div className="board-write">
            <form onSubmit={handleSubmit}>
              <div className="board-form-row">
                <div className="board-form-group">
                  <label>{t('auth.productSlug')}</label>
                  <input
                    type="text"
                    name="slug"
                    value={form.slug}
                    onChange={handleChange}
                    placeholder="ebook-001"
                    required
                  />
                </div>
                <div className="board-form-group">
                  <label>{t('auth.productCategory')}</label>
                  <select name="category" value={form.category} onChange={handleChange}>
                    {categories.map(c => (
                      <option key={c.key} value={c.key}>{c.label}</option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="board-form-row">
                <div className="board-form-group">
                  <label>{t('auth.productTitle')}</label>
                  <input
                    type="text"
                    name="title"
                    value={form.title}
                    onChange={handleChange}
                    placeholder="상품명"
                    required
                  />
                </div>
                <div className="board-form-group">
                  <label>{t('auth.productTitleEn')}</label>
                  <input
                    type="text"
                    name="titleEn"
                    value={form.titleEn}
                    onChange={handleChange}
                    placeholder="Product Title"
                  />
                </div>
              </div>
              <div className="board-form-group">
                <label>{t('auth.productDesc')}</label>
                <textarea
                  name="description"
                  value={form.description}
                  onChange={handleChange}
                  placeholder="상품 설명"
                />
              </div>
              <div className="board-form-group">
                <label>{t('auth.productDescEn')}</label>
                <textarea
                  name="descriptionEn"
                  value={form.descriptionEn}
                  onChange={handleChange}
                  placeholder="Description"
                />
              </div>
              <div className="board-form-row">
                <div className="board-form-group">
                  <label>{t('auth.productPrice')} (KRW)</label>
                  <input
                    type="number"
                    name="price"
                    value={form.price}
                    onChange={handleChange}
                    min={0}
                    required
                  />
                </div>
                <div className="board-form-group">
                  <label>{t('auth.sortOrder')}</label>
                  <input
                    type="number"
                    name="sortOrder"
                    value={form.sortOrder}
                    onChange={handleChange}
                  />
                </div>
              </div>
              <div className="board-form-group">
                <label>{t('auth.productImage')}</label>
                <ImageUpload
                  value={form.imageUrl}
                  onChange={(url) => setForm({ ...form, imageUrl: url })}
                  folder="products"
                />
              </div>

              {error && <div className="checkout-error">{error}</div>}

              <div className="board-form-actions">
                <Link to="/shop" className="board-btn">{t('community.cancel')}</Link>
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

export default ProductWrite;

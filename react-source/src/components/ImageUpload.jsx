import { useState, useRef } from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { uploadImage } from '../utils/storage';

const ImageUpload = ({ value, onChange, folder = 'uploads' }) => {
  const { t } = useLanguage();
  const [uploading, setUploading] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const fileRef = useRef(null);

  const handleFile = async (file) => {
    if (!file || !file.type.startsWith('image/')) return;
    setUploading(true);
    try {
      const url = await uploadImage(file, folder);
      onChange(url);
    } catch (err) {
      console.error('Upload error:', err);
      alert(err.message);
    } finally {
      setUploading(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files[0];
    if (file) handleFile(file);
  };

  const handleInputChange = (e) => {
    const file = e.target.files[0];
    if (file) handleFile(file);
  };

  return (
    <div className="image-upload-wrapper">
      {value ? (
        <div className="image-upload-preview">
          <img src={value} alt="Preview" />
          <button
            type="button"
            className="image-upload-remove"
            onClick={() => onChange('')}
          >
            {t('auth.removeImage')}
          </button>
        </div>
      ) : (
        <div
          className={`image-upload-zone ${dragOver ? 'drag-over' : ''}`}
          onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
          onDragLeave={() => setDragOver(false)}
          onDrop={handleDrop}
          onClick={() => fileRef.current?.click()}
        >
          {uploading ? (
            <span className="image-upload-status">{t('auth.uploading')}</span>
          ) : (
            <>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="32" height="32">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                <polyline points="17 8 12 3 7 8" />
                <line x1="12" y1="3" x2="12" y2="15" />
              </svg>
              <span>{t('auth.dragOrClick')}</span>
            </>
          )}
          <input
            ref={fileRef}
            type="file"
            accept="image/*"
            onChange={handleInputChange}
            style={{ display: 'none' }}
          />
        </div>
      )}
    </div>
  );
};

export default ImageUpload;

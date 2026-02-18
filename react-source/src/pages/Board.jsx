import { useState } from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import useAOS from '../hooks/useAOS';

const Board = () => {
  const { t } = useLanguage();
  const [activeFilter, setActiveFilter] = useState('all');
  useAOS();

  const filters = [
    { key: 'all', label: t('community.all') },
    { key: 'notice', label: t('community.notice') },
    { key: 'free', label: t('community.free') },
    { key: 'qna', label: t('community.qna') }
  ];

  const samplePosts = [
    { id: 5, category: 'notice', title: '드림아이티비즈 커뮤니티 게시판 오픈 안내', author: '관리자', date: '2026-02-18', views: 42 },
    { id: 4, category: 'notice', title: '2026년 상반기 교육 일정 안내', author: '관리자', date: '2026-02-15', views: 38 },
    { id: 3, category: 'free', title: 'React 19 새로운 기능 정리', author: '김개발', date: '2026-02-14', views: 25 },
    { id: 2, category: 'qna', title: '웹호스팅 SSL 인증서 설정 관련 질문', author: '이호스팅', date: '2026-02-12', views: 18 },
    { id: 1, category: 'free', title: '맞춤 강의 후기 - Python 데이터 분석 과정', author: '박수강', date: '2026-02-10', views: 31 }
  ];

  const filteredPosts = activeFilter === 'all'
    ? samplePosts
    : samplePosts.filter(p => p.category === activeFilter);

  const categoryLabel = (cat) => {
    switch (cat) {
      case 'notice': return t('community.notice');
      case 'free': return t('community.free');
      case 'qna': return t('community.qna');
      default: return cat;
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
          <div className="board-container" data-aos="fade-up">
            <div className="board-filters">
              {filters.map((f) => (
                <button
                  key={f.key}
                  className={`board-filter-btn ${activeFilter === f.key ? 'active' : ''}`}
                  onClick={() => setActiveFilter(f.key)}
                >
                  {f.label}
                </button>
              ))}
            </div>

            {filteredPosts.length > 0 ? (
              <table className="board-table">
                <thead>
                  <tr>
                    <th className="col-num">{t('community.number')}</th>
                    <th className="col-title">{t('community.postTitle')}</th>
                    <th className="col-author">{t('community.author')}</th>
                    <th className="col-date">{t('community.date')}</th>
                    <th className="col-views">{t('community.views')}</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredPosts.map((post) => (
                    <tr key={post.id}>
                      <td className="col-num">{post.id}</td>
                      <td className="col-title">
                        <a href="#!">
                          <span className={`board-category-badge ${post.category}`}>{categoryLabel(post.category)}</span>
                          {post.title}
                        </a>
                      </td>
                      <td className="col-author">{post.author}</td>
                      <td className="col-date">{post.date}</td>
                      <td className="col-views">{post.views}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <div className="board-empty">{t('community.noPost')}</div>
            )}

            <div className="board-actions">
              <button className="board-write-btn">{t('community.writePost')}</button>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default Board;

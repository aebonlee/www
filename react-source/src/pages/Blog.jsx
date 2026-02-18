const Blog = () => {
  const posts = [
    {
      title: '2024 웹 개발 트렌드',
      date: '2024.01.15',
      category: 'IT 트렌드',
      excerpt: '2024년 주목해야 할 웹 개발 기술과 트렌드를 소개합니다.'
    },
    {
      title: 'React 성능 최적화 기법',
      date: '2024.01.10',
      category: '기술',
      excerpt: 'React 애플리케이션의 성능을 향상시키는 다양한 방법들을 알아봅니다.'
    },
    {
      title: 'UI/UX 디자인의 중요성',
      date: '2024.01.05',
      category: '디자인',
      excerpt: '사용자 경험을 개선하는 UI/UX 디자인 원칙을 소개합니다.'
    },
    {
      title: '클라우드 서비스 비교',
      date: '2023.12.28',
      category: '호스팅',
      excerpt: 'AWS, Azure, GCP 등 주요 클라우드 서비스를 비교 분석합니다.'
    },
    {
      title: 'IT 컨설팅 성공 사례',
      date: '2023.12.20',
      category: '컨설팅',
      excerpt: '드림아이티비즈의 IT 컨설팅 성공 사례를 공유합니다.'
    },
    {
      title: '효과적인 IT 교육 방법',
      date: '2023.12.15',
      category: '교육',
      excerpt: '기업 맞춤 IT 교육의 효과적인 방법론을 소개합니다.'
    }
  ];

  return (
    <>
      <section className="page-header">
        <div className="container">
          <h1 className="page-title">블로그</h1>
          <p className="page-description">IT 트렌드, 기술 소식, 그리고 드림아이티비즈의 이야기를 공유합니다</p>
        </div>
      </section>

      <section style={{ padding: '80px 0', background: 'var(--bg-white)' }}>
        <div className="container">
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '32px' }}>
            {posts.map((post, index) => (
              <article key={index} className="portfolio-card" data-aos="fade-up" data-aos-delay={index * 50}>
                <div className="portfolio-image">
                  <div className="image-placeholder"></div>
                </div>
                <div className="portfolio-content">
                  <div className="portfolio-tag">{post.category}</div>
                  <h3>{post.title}</h3>
                  <p style={{ fontSize: '12px', color: 'var(--text-secondary)', marginBottom: '8px' }}>
                    {post.date}
                  </p>
                  <p>{post.excerpt}</p>
                  <a href="#" className="detail-link">자세히 보기 →</a>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>
    </>
  );
};

export default Blog;

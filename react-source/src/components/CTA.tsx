import { Link } from 'react-router-dom';

const CTA = ({ title = '프로젝트를 시작할 준비가 되셨나요?', subtitle = '드림아이티비즈와 함께 비즈니스의 미래를 만들어가세요', buttonText = '무료 상담 신청', to = '/contact' }) => {
  return (
    <section className="cta-section">
      <div className="container">
        <div className="cta-content" data-aos="fade-up">
          <h2>{title}</h2>
          <p>{subtitle}</p>
          <Link to={to} className="btn btn-primary-large">
            {buttonText}
          </Link>
        </div>
      </div>
    </section>
  );
};

export default CTA;

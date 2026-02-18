import { useState, useEffect, useCallback, useRef } from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../contexts/LanguageContext';
import HeroBackground from './HeroBackground';
import ScrollIndicator from './ScrollIndicator';

const SLIDE_COUNT = 5;
const AUTO_PLAY_MS = 5000;
const SWIPE_THRESHOLD = 50;

const CTA_LINKS = [
  ['/services', '/contact'],
  ['/services', null],
  ['/rnd', '/consulting'],
  ['/education', null],
  ['/publishing', '/shop'],
];

const HeroCarousel = () => {
  const { t } = useLanguage();
  const [current, setCurrent] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const directionRef = useRef(1); // 1 = forward, -1 = backward (ping-pong)
  const touchStartX = useRef(0);
  const heroRef = useRef(null);

  const slides = t('heroSlides') || [];

  const goTo = useCallback((idx) => {
    setCurrent(((idx % SLIDE_COUNT) + SLIDE_COUNT) % SLIDE_COUNT);
  }, []);

  // Ping-pong auto-advance: 0→1→2→3→4→3→2→1→0→1→...
  const autoNext = useCallback(() => {
    setCurrent((prev) => {
      if (prev >= SLIDE_COUNT - 1) directionRef.current = -1;
      if (prev <= 0) directionRef.current = 1;
      return prev + directionRef.current;
    });
  }, []);

  const next = useCallback(() => goTo(current + 1), [current, goTo]);
  const prev = useCallback(() => goTo(current - 1), [current, goTo]);

  // Auto-play (ping-pong)
  useEffect(() => {
    if (isPaused) return;
    const id = setInterval(autoNext, AUTO_PLAY_MS);
    return () => clearInterval(id);
  }, [isPaused, autoNext]);

  // Keyboard navigation
  useEffect(() => {
    const handler = (e) => {
      if (e.key === 'ArrowLeft') prev();
      if (e.key === 'ArrowRight') next();
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [next, prev]);

  // Touch handlers
  const onTouchStart = (e) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const onTouchEnd = (e) => {
    const dx = e.changedTouches[0].clientX - touchStartX.current;
    if (Math.abs(dx) > SWIPE_THRESHOLD) {
      dx < 0 ? next() : prev();
    }
  };

  return (
    <section
      className="hero"
      id="home"
      ref={heroRef}
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      onTouchStart={onTouchStart}
      onTouchEnd={onTouchEnd}
    >
      {/* Carousel track */}
      <div className="carousel-viewport">
        <div
          className="carousel-track"
          style={{ transform: `translateX(-${current * 100}%)` }}
        >
          {Array.from({ length: SLIDE_COUNT }, (_, i) => (
            <div key={i} className="carousel-slide">
              <HeroBackground slideIndex={i} isActive={i === current} />
            </div>
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="container">
        <div className="hero-content">
          {slides[current] && (
            <>
              <h2 className="hero-title">
                <span className="title-line">{slides[current].line1}</span>
                <span className="title-line">
                  {slides[current].line2}{' '}
                  <span className="highlight">{slides[current].highlight}</span>
                  {slides[current].line3}
                </span>
                {slides[current].line4 && (
                  <span className="title-line">{slides[current].line4}</span>
                )}
              </h2>
              <p className="hero-description">
                {slides[current].description.split('\n').map((line, i) => (
                  <span key={i}>
                    {line}
                    {i === 0 && <br />}
                  </span>
                ))}
              </p>
              <div className="hero-buttons">
                {CTA_LINKS[current]?.[0] && (
                  <Link to={CTA_LINKS[current][0]} className="btn btn-primary">
                    {slides[current].cta1}
                  </Link>
                )}
                {CTA_LINKS[current]?.[1] && slides[current].cta2 && (
                  <Link to={CTA_LINKS[current][1]} className="btn btn-secondary">
                    {slides[current].cta2}
                  </Link>
                )}
              </div>
            </>
          )}
        </div>
      </div>

      {/* Arrows */}
      <button
        className="carousel-arrow carousel-arrow--prev"
        onClick={prev}
        aria-label="Previous slide"
      >
        ‹
      </button>
      <button
        className="carousel-arrow carousel-arrow--next"
        onClick={next}
        aria-label="Next slide"
      >
        ›
      </button>

      {/* Dots */}
      <div className="carousel-dots">
        {Array.from({ length: SLIDE_COUNT }, (_, i) => (
          <button
            key={i}
            className={`carousel-dot${i === current ? ' active' : ''}`}
            onClick={() => goTo(i)}
            aria-label={`Go to slide ${i + 1}`}
          />
        ))}
      </div>

      <ScrollIndicator />
    </section>
  );
};

export default HeroCarousel;

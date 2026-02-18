import { useMemo } from 'react';

/* ── Floating Particles ── */
const ParticlesBg = ({ isActive }) => {
  const items = useMemo(() =>
    Array.from({ length: 30 }, (_, i) => ({
      id: i,
      left: `${Math.random() * 100}%`,
      top: `${Math.random() * 100}%`,
      delay: `${Math.random() * 15}s`,
      duration: `${15 + Math.random() * 30}s`,
      size: `${3 + Math.random() * 3}px`,
    })), []);

  return (
    <div className="hero-bg-effect particles-bg">
      {items.map((p) => (
        <span
          key={p.id}
          className="particle"
          style={{
            left: p.left,
            top: p.top,
            width: p.size,
            height: p.size,
            animationDelay: p.delay,
            '--duration': p.duration,
            animationPlayState: isActive ? 'running' : 'paused',
          }}
        />
      ))}
    </div>
  );
};

/* ── Geometric Shapes ── */
const GeometricBg = ({ isActive }) => {
  const shapes = useMemo(() =>
    Array.from({ length: 12 }, (_, i) => ({
      id: i,
      left: `${Math.random() * 90 + 5}%`,
      top: `${Math.random() * 90 + 5}%`,
      size: `${20 + Math.random() * 40}px`,
      delay: `${Math.random() * 10}s`,
      duration: `${10 + Math.random() * 10}s`,
      type: ['triangle', 'square', 'hexagon'][i % 3],
      rotation: Math.floor(Math.random() * 360),
    })), []);

  return (
    <div className="hero-bg-effect geometric-bg">
      {shapes.map((s) => (
        <span
          key={s.id}
          className={`geo-shape geo-${s.type}`}
          style={{
            left: s.left,
            top: s.top,
            width: s.size,
            height: s.size,
            animationDelay: s.delay,
            animationDuration: s.duration,
            '--start-rotation': `${s.rotation}deg`,
            animationPlayState: isActive ? 'running' : 'paused',
          }}
        />
      ))}
    </div>
  );
};

/* Geometric + Particles 두 가지만 슬라이드별 교차 적용 */
const backgrounds = [GeometricBg, ParticlesBg, GeometricBg, ParticlesBg, GeometricBg];

const HeroBackground = ({ slideIndex, isActive }) => {
  const Bg = backgrounds[slideIndex];
  return Bg ? <Bg isActive={isActive} /> : null;
};

export default HeroBackground;

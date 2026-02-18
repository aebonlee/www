import { useMemo } from 'react';

const Particles = ({ count = 30 }) => {
  const particles = useMemo(() => {
    return Array.from({ length: count }, (_, i) => ({
      id: i,
      left: `${Math.random() * 100}%`,
      top: `${Math.random() * 100}%`,
      delay: `${Math.random() * 15}s`,
      duration: `${15 + Math.random() * 30}s`,
      size: `${3 + Math.random() * 3}px`,
    }));
  }, [count]);

  return (
    <div className="particles">
      {particles.map((p) => (
        <div
          key={p.id}
          className="particle"
          style={{
            left: p.left,
            top: p.top,
            width: p.size,
            height: p.size,
            animationDelay: p.delay,
            '--duration': p.duration,
          }}
        />
      ))}
    </div>
  );
};

export default Particles;

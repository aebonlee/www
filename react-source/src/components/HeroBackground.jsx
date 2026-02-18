import { useMemo } from 'react';

/* ── Slide 0 (Blue): Floating Particles ── */
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

/* ── Slide 1 (Red): Matrix Code Rain — red/pink tones ── */
const MatrixBg = ({ isActive }) => {
  const cols = useMemo(() =>
    Array.from({ length: 24 }, (_, i) => ({
      id: i,
      left: `${(i / 24) * 100 + Math.random() * 2}%`,
      delay: `${Math.random() * 5}s`,
      duration: `${3 + Math.random() * 4}s`,
      chars: Array.from({ length: 8 + Math.floor(Math.random() * 8) }, () =>
        String.fromCharCode(0x30A0 + Math.floor(Math.random() * 96))
      ).join('\n'),
    })), []);

  return (
    <div className="hero-bg-effect matrix-bg">
      {cols.map((c) => (
        <span
          key={c.id}
          className="matrix-col"
          style={{
            left: c.left,
            animationDelay: c.delay,
            animationDuration: c.duration,
            animationPlayState: isActive ? 'running' : 'paused',
          }}
        >
          {c.chars}
        </span>
      ))}
    </div>
  );
};

/* ── Slide 2 (Green): Network Nodes — emerald/teal tones ── */
const NetworkBg = ({ isActive }) => {
  const nodes = useMemo(() =>
    Array.from({ length: 18 }, (_, i) => ({
      id: i,
      cx: Math.random() * 100,
      cy: Math.random() * 100,
      r: 2 + Math.random() * 3,
      delay: `${Math.random() * 6}s`,
      duration: `${8 + Math.random() * 8}s`,
    })), []);

  const lines = useMemo(() => {
    const l = [];
    for (let i = 0; i < nodes.length; i++) {
      for (let j = i + 1; j < nodes.length; j++) {
        const dx = nodes[i].cx - nodes[j].cx;
        const dy = nodes[i].cy - nodes[j].cy;
        if (Math.sqrt(dx * dx + dy * dy) < 35) {
          l.push({ id: `${i}-${j}`, x1: nodes[i].cx, y1: nodes[i].cy, x2: nodes[j].cx, y2: nodes[j].cy });
        }
      }
    }
    return l;
  }, [nodes]);

  return (
    <div className="hero-bg-effect network-bg">
      <svg viewBox="0 0 100 100" preserveAspectRatio="none" style={{ width: '100%', height: '100%' }}>
        {lines.map((ln) => (
          <line
            key={ln.id}
            x1={`${ln.x1}%`} y1={`${ln.y1}%`}
            x2={`${ln.x2}%`} y2={`${ln.y2}%`}
            stroke="rgba(100,230,170,0.15)"
            strokeWidth="0.15"
          />
        ))}
        {nodes.map((n) => (
          <circle
            key={n.id}
            cx={`${n.cx}%`} cy={`${n.cy}%`} r={n.r}
            fill="rgba(100,230,170,0.3)"
            className="network-node"
            style={{
              animationDelay: n.delay,
              animationDuration: n.duration,
              animationPlayState: isActive ? 'running' : 'paused',
            }}
          />
        ))}
      </svg>
    </div>
  );
};

/* ── Slide 3 (Purple): Rising Orbs — violet/magenta tones ── */
const OrbsBg = ({ isActive }) => {
  const orbs = useMemo(() =>
    Array.from({ length: 16 }, (_, i) => ({
      id: i,
      left: `${Math.random() * 100}%`,
      size: `${6 + Math.random() * 14}px`,
      delay: `${Math.random() * 8}s`,
      duration: `${6 + Math.random() * 6}s`,
      hue: 270 + Math.floor(Math.random() * 40),
    })), []);

  return (
    <div className="hero-bg-effect orbs-bg">
      {orbs.map((o) => (
        <span
          key={o.id}
          className="orb"
          style={{
            left: o.left,
            width: o.size,
            height: o.size,
            animationDelay: o.delay,
            animationDuration: o.duration,
            background: `radial-gradient(circle, hsla(${o.hue},80%,70%,0.6), hsla(${o.hue},80%,70%,0))`,
            animationPlayState: isActive ? 'running' : 'paused',
          }}
        />
      ))}
    </div>
  );
};

/* ── Slide 4 (Orange): Geometric Shapes — amber/gold tones ── */
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

const backgrounds = [ParticlesBg, MatrixBg, NetworkBg, OrbsBg, GeometricBg];

const HeroBackground = ({ slideIndex, isActive }) => {
  const Bg = backgrounds[slideIndex];
  return Bg ? <Bg isActive={isActive} /> : null;
};

export default HeroBackground;

import React, { useState, useEffect, useRef } from 'react';
import { RefreshCw } from 'lucide-react';

export default function GlitchText({ children, className = '', ...props }) {
  const [display, setDisplay] = useState('');
  const [triggered, setTriggered] = useState(false);
  const [retrigger, setRetrigger] = useState(0);
  const ref = useRef(null);
  const text = typeof children === 'string' ? children : '';

  useEffect(() => {
    const node = ref.current;
    if (!node || !text) return;
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting && !triggered) setTriggered(true); },
      { threshold: 0.3 }
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, [text, triggered]);

  useEffect(() => {
    if (!triggered || !text) return;
    const chars = text.split('');

    // Glitch bursts — timings doubled from original
    const glitchPhases = [
      { at: 0, duration: 120 },
      { at: 200, duration: 160 },
      { at: 440, duration: 100 },
      { at: 640, duration: 140 },
    ];

    const timeouts = [];

    glitchPhases.forEach(({ at, duration }) => {
      const t = setTimeout(() => {
        const scrambled = chars.map((ch) => {
          if (ch === ' ' || ch === '\n') return ch;
          if (Math.random() > 0.5) return ch;
          const offset = Math.floor(Math.random() * 5) - 2;
          return String.fromCharCode(Math.max(32, ch.charCodeAt(0) + offset));
        });
        setDisplay(scrambled.join(''));

        setTimeout(() => {
          setDisplay(text);
        }, duration);
      }, at);
      timeouts.push(t);
    });

    const finalTimeout = setTimeout(() => setDisplay(text), 840); // doubled from 420
    timeouts.push(finalTimeout);

    return () => timeouts.forEach(clearTimeout);
  }, [triggered, text, retrigger]);

  if (!text) return <span ref={ref} className={className} {...props}>{children}</span>;

  const lines = (display || text).split('\n');
  return (
    <span ref={ref} className={className} {...props} style={{ position: 'relative', display: 'inline-block' }}>
      {lines.map((line, i) => (
        <React.Fragment key={i}>
          <span>{line}</span>
          {triggered && display !== text && display && (
            <span style={{ position: 'absolute', top: '2px', left: '2px', color: 'rgba(255,50,50,0.4)', pointerEvents: 'none', userSelect: 'none' }}>{line}</span>
          )}
          {i < lines.length - 1 && <br />}
        </React.Fragment>
      ))}
      <button
        onClick={(e) => { e.stopPropagation(); setRetrigger((n) => n + 1); }}
        className="absolute -top-8 right-0 p-1 rounded hover:bg-white/10 transition-colors text-white/40 hover:text-white"
        title="Replay animation"
      >
        <RefreshCw className="w-3.5 h-3.5" />
      </button>
    </span>
  );
}
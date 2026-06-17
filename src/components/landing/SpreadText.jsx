import React, { useState, useEffect, useRef } from 'react';
import { RefreshCw } from 'lucide-react';

export default function SpreadText({ children, className = '', ...props }) {
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
    let revealed = Array(chars.length).fill(false);

    // Scan from middle outward
    const totalDuration = 1800;
    const start = performance.now();
    let frame;

    const getRevealRange = (progress) => {
      const total = chars.length;
      const half = total / 2;
      const spread = progress * half;
      return {
        from: Math.max(0, Math.floor(half - spread)),
        to: Math.min(total - 1, Math.floor(half + spread)),
      };
    };

    const animate = (now) => {
      const elapsed = now - start;
      const progress = Math.min(elapsed / totalDuration, 1);

      const { from, to } = getRevealRange(progress);
      const result = chars.map((ch, i) => {
        if (ch === ' ' || ch === '\n') return ch;
        if (i >= from && i <= to) {
          revealed[i] = true;
          return chars[i];
        }
        return '\u00A0';
      });

      setDisplay(result.join(''));

      if (progress < 1) {
        frame = requestAnimationFrame(animate);
      } else {
        setDisplay(text);
      }
    };

    const t = setTimeout(() => {
      frame = requestAnimationFrame(animate);
    }, 100);

    return () => {
      clearTimeout(t);
      if (frame) cancelAnimationFrame(frame);
    };
  }, [triggered, text, retrigger]);

  if (!text) return <span ref={ref} className={className} {...props}>{children}</span>;

  const lines = display.split('\n');
  return (
    <span ref={ref} className={className} {...props} style={{ position: 'relative', display: 'inline-block' }}>
      {lines.map((line, i) => (
        <React.Fragment key={i}>
          <span>{line}</span>
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
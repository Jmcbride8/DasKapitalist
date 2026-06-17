import React, { useState, useEffect, useRef } from 'react';
import { RefreshCw } from 'lucide-react';

const CHARS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%&';

export default function SplitFlapText({ children, className = '', ...props }) {
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
    const final = text.split('');
    let locked = Array(final.length).fill(false);

    const duration = 2400; // doubled from 1200
    const totalFrames = 24;
    const frameInterval = duration / totalFrames;

    let frame = 0;
    const timer = setInterval(() => {
      frame++;
      const progress = frame / totalFrames;
      const lockCount = Math.floor(progress * final.length * 1.3);

      const current = final.map((ch, i) => {
        if (ch === ' ' || ch === '\n') return ch;
        if (locked[i]) return final[i];
        if (i < lockCount && Math.random() > 0.3) {
          locked[i] = true;
          return final[i];
        }
        return CHARS[Math.floor(Math.random() * CHARS.length)];
      });

      setDisplay(current.join(''));

      if (frame >= totalFrames) {
        setDisplay(text);
        clearInterval(timer);
      }
    }, frameInterval);

    return () => clearInterval(timer);
  }, [triggered, text, retrigger]);

  if (!text) return <span ref={ref} className={className} {...props}>{children}</span>;

  const lines = display.split('\n');
  return (
    <span ref={ref} className={className} {...props} style={{ position: 'relative', display: 'inline-block' }}>
      {lines.map((line, i) => (
        <React.Fragment key={i}>
          {line.split('').map((ch, j) => (
            <span key={j} className="inline-block" style={{ minWidth: ch === ' ' ? '0.3em' : '0.6em', textAlign: 'center', transition: 'transform 0.05s' }}>{ch}</span>
          ))}
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
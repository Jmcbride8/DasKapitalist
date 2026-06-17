import React, { useState, useEffect, useRef } from 'react';

const CHARS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%&';

export default function SplitFlapText({ children, className = '', ...props }) {
  const [display, setDisplay] = useState('');
  const [triggered, setTriggered] = useState(false);
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

    const duration = 1200;
    const totalFrames = 24;
    const frameInterval = duration / totalFrames;

    let frame = 0;
    const timer = setInterval(() => {
      frame++;
      const progress = frame / totalFrames;
      // Characters lock in a staggered wave left-to-right
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
  }, [triggered, text]);

  if (!text) return <span ref={ref} className={className} {...props}>{children}</span>;

  const lines = display.split('\n');
  return (
    <span ref={ref} className={className} {...props}>
      {lines.map((line, i) => (
        <React.Fragment key={i}>
          {line.split('').map((ch, j) => (
            <span key={j} className="inline-block" style={{ minWidth: ch === ' ' ? '0.3em' : '0.6em', textAlign: 'center', transition: 'transform 0.05s' }}>{ch}</span>
          ))}
          {i < lines.length - 1 && <br />}
        </React.Fragment>
      ))}
    </span>
  );
}
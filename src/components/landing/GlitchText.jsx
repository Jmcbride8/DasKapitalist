import React, { useState, useEffect, useRef } from 'react';

export default function GlitchText({ children, className = '', ...props }) {
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
    const chars = text.split('');

    // Phase 1: Brief glitch bursts (200ms)
    const glitchPhases = [
      { at: 0, duration: 60 },
      { at: 100, duration: 80 },
      { at: 220, duration: 50 },
      { at: 320, duration: 70 },
    ];

    const timeouts = [];

    glitchPhases.forEach(({ at, duration }) => {
      const t = setTimeout(() => {
        const scrambled = chars.map((ch) => {
          if (ch === ' ' || ch === '\n') return ch;
          if (Math.random() > 0.5) return ch;
          // Shift to a random nearby character
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

    // Final resolve after all glitches
    const finalTimeout = setTimeout(() => setDisplay(text), 420);
    timeouts.push(finalTimeout);

    return () => timeouts.forEach(clearTimeout);
  }, [triggered, text]);

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
    </span>
  );
}
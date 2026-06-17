import React, { useState, useEffect, useRef } from 'react';

export default function TickerText({ children, className = '', ...props }) {
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
    let revealed = Array(chars.length).fill(false);
    setDisplay(chars.map((ch) => (ch === ' ' || ch === '\n' ? ch : '\u00A0')).join(''));

    const duration = 600;
    const delay = duration / chars.length;

    chars.forEach((ch, i) => {
      const timeout = delay * i;
      setTimeout(() => {
        revealed[i] = true;
        setDisplay(chars.map((c, j) => {
          if (c === ' ' || c === '\n') return c;
          return revealed[j] ? c : '\u00A0';
        }).join(''));
      }, timeout);
    });

    return () => {};
  }, [triggered, text]);

  if (!text) return <span ref={ref} className={className} {...props}>{children}</span>;

  const lines = display.split('\n');
  return (
    <span ref={ref} className={className} {...props}>
      {lines.map((line, i) => (
        <React.Fragment key={i}>
          <span className="inline-block" style={{ borderRight: !display || display.replace(/\u00A0/g, '').length < text.replace(/\s/g, '').length ? '2px solid currentColor' : '2px solid transparent', animation: !display ? 'blink 0.8s step-end infinite' : 'none' }}>{line}</span>
          {i < lines.length - 1 && <br />}
        </React.Fragment>
      ))}
    </span>
  );
}
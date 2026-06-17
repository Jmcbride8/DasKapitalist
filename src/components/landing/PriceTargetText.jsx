import React, { useState, useEffect, useRef } from 'react';
export default function PriceTargetText({ children, className = '', ...props }) {
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
    let locked = Array(chars.length).fill(false);

    const totalDuration = 2400;
    const ticks = 30;
    const interval = totalDuration / ticks;
    let tick = 0;

    const digits = '0123456789';
    const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';

    const timer = setInterval(() => {
      tick++;
      const progress = tick / ticks;
      const lockTarget = Math.floor(progress * chars.length * 1.1);

      const current = chars.map((ch, i) => {
        if (ch === ' ' || ch === '\n') return ch;
        if (locked[i]) return chars[i];
        if (i < lockTarget) {
          locked[i] = true;
          return chars[i];
        }
        // Prioritize number-like cycling for digits, alpha for letters
        if (/[0-9]/.test(ch)) return digits[Math.floor(Math.random() * 10)];
        if (/[A-Za-z]/.test(ch)) return alphabet[Math.floor(Math.random() * 26)];
        return ch;
      });

      setDisplay(current.join(''));

      if (tick >= ticks) {
        setDisplay(text);
        clearInterval(timer);
      }
    }, interval);

    return () => clearInterval(timer);
  }, [triggered, text, retrigger]);

  if (!text) return <span ref={ref} className={className} {...props}>{children}</span>;

  const lines = display.split('\n');
  return (
    <span ref={ref} className={className} {...props} style={{ position: 'relative', display: 'inline-block' }}>
      {lines.map((line, i) => (
        <React.Fragment key={i}>
          {line}
          {i < lines.length - 1 && <br />}
        </React.Fragment>
      ))}
    </span>
  );
}
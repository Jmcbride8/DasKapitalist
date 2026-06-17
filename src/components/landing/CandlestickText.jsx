import React, { useState, useEffect, useRef } from 'react';
import { RefreshCw } from 'lucide-react';

export default function CandlestickText({ children, className = '', ...props }) {
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
    const pairCount = Math.ceil(chars.length / 2);

    const totalDuration = 2200;
    const pairDelay = totalDuration / pairCount;

    // Build pairs: each pair of chars appears together with a wick/shadow effect
    const timeouts = [];

    chars.forEach((ch, i) => {
      if (ch === ' ' || ch === '\n') return;

      // "Wick" phase: a thin placeholder appears briefly
      const wickT = setTimeout(() => {
        setDisplay((prev) => {
          const arr = prev ? prev.split('') : Array(chars.length).fill('\u00A0');
          arr[i] = '|';
          return arr.join('');
        });
      }, (i / 2) * pairDelay);

      // "Body" phase: the real character snaps in
      const bodyT = setTimeout(() => {
        setDisplay((prev) => {
          const arr = prev ? prev.split('') : Array(chars.length).fill('\u00A0');
          arr[i] = chars[i];
          return arr.join('');
        });
      }, (i / 2) * pairDelay + 120);

      timeouts.push(wickT, bodyT);
    });

    // Always preserve spaces/newlines
    setDisplay(chars.map((ch) => (ch === ' ' || ch === '\n' ? ch : '\u00A0')).join(''));

    const finalT = setTimeout(() => setDisplay(text), totalDuration + 200);
    timeouts.push(finalT);

    return () => timeouts.forEach(clearTimeout);
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
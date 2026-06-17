import React, { useState, useEffect, useRef } from 'react';
import { RefreshCw } from 'lucide-react';

export default function TypewriterText({ children, className = '', ...props }) {
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
    setDisplay('');

    let i = 0;
    const chars = text.split('');
    const baseDelay = 60; // ms per character
    const timeouts = [];

    const type = () => {
      if (i <= chars.length) {
        setDisplay(chars.slice(0, i).join(''));
        i++;
        // Variable speed: faster through spaces, pause at punctuation
        const ch = chars[i - 1] || '';
        const delay = ch === ' ' ? baseDelay * 0.3 : ch === '.' || ch === '\n' ? baseDelay * 4 : baseDelay;
        const t = setTimeout(type, delay);
        timeouts.push(t);
      }
    };

    const startT = setTimeout(type, 200);
    timeouts.push(startT);

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
      {display !== text && (
        <span className="inline-block w-[3px] h-[1em] bg-current align-middle ml-0.5" style={{ animation: 'blink 0.7s step-end infinite' }} />
      )}
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
import React, { useState, useEffect, useRef } from 'react';
import { RefreshCw } from 'lucide-react';

export default function OdometerText({ children, className = '', ...props }) {
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
    const duration = 1800; // doubled from 900
    const totalSteps = 20;

    let step = 0;
    const stepInterval = duration / totalSteps;

    const timer = setInterval(() => {
      step++;
      const progress = Math.min(step / totalSteps, 1);
      const current = chars.map((ch) => {
        if (ch === ' ' || ch === '\n') return ch;
        if (progress >= 1) return ch;
        const offset = Math.floor((1 - progress) * 10);
        const code = ch.charCodeAt(0);
        const rolled = String.fromCharCode(((code - 65 + offset) % 26) + 65);
        return rolled;
      });
      setDisplay(current.join(''));
      if (step >= totalSteps) {
        setDisplay(text);
        clearInterval(timer);
      }
    }, stepInterval);

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
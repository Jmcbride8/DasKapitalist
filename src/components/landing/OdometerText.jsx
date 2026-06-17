import React, { useState, useEffect, useRef } from 'react';

export default function OdometerText({ children, className = '', ...props }) {
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
    const duration = 900;
    const totalSteps = 20;

    let step = 0;
    const stepInterval = duration / totalSteps;

    const timer = setInterval(() => {
      step++;
      const progress = Math.min(step / totalSteps, 1);
      const current = chars.map((ch) => {
        if (ch === ' ' || ch === '\n') return ch;
        if (progress >= 1) return ch;
        // Each char rolls upward to its target
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
  }, [triggered, text]);

  if (!text) return <span ref={ref} className={className} {...props}>{children}</span>;

  const lines = display.split('\n');
  return (
    <span ref={ref} className={className} {...props}>
      {lines.map((line, i) => (
        <React.Fragment key={i}>
          {line}
          {i < lines.length - 1 && <br />}
        </React.Fragment>
      ))}
    </span>
  );
}
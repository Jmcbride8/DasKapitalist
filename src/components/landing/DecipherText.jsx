import React, { useState, useEffect, useRef } from 'react';

const CHARS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()_+-=[]{}|;:,.<>?/';

export default function DecipherText({ children, className = '', ...props }) {
  const [display, setDisplay] = useState('');
  const [triggered, setTriggered] = useState(false);
  const ref = useRef(null);

  const text = typeof children === 'string' ? children : '';

  useEffect(() => {
    const node = ref.current;
    if (!node || !text) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !triggered) {
          setTriggered(true);
        }
      },
      { threshold: 0.3 }
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, [text, triggered]);

  useEffect(() => {
    if (!triggered || !text) return;

    const final = text.split('');
    let current = final.map((ch) => (ch === ' ' || ch === '\n' ? ch : CHARS[Math.floor(Math.random() * CHARS.length)]));
    setDisplay(current.join(''));

    const duration = 800;
    const totalSteps = 15;
    const stepInterval = duration / totalSteps;
    let step = 0;

    const timer = setInterval(() => {
      step++;
      const progress = step / totalSteps;
      const revealCount = Math.floor(progress * final.length);

      current = final.map((ch, i) => {
        if (ch === ' ' || ch === '\n') return ch;
        if (i < revealCount) return final[i];
        return CHARS[Math.floor(Math.random() * CHARS.length)];
      });

      setDisplay(current.join(''));

      if (step >= totalSteps) {
        setDisplay(text);
        clearInterval(timer);
      }
    }, stepInterval);

    return () => clearInterval(timer);
  }, [triggered, text]);

  if (!text) {
    return <span ref={ref} className={className} {...props}>{children}</span>;
  }

  // Split on <br /> to preserve line breaks
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
import React, { useState, useEffect, useRef } from 'react';
export default function PulseText({ children, className = '', ...props }) {
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
    if (!triggered) return;
    if (retrigger > 0) {
      const t = setTimeout(() => setTriggered(false), 50);
      return () => clearTimeout(t);
    }
  }, [retrigger]);

  if (!text) return <span ref={ref} className={className} {...props}>{children}</span>;

  const lines = text.split('\n');

  return (
    <span ref={ref} className={className} {...props} style={{ position: 'relative', display: 'inline-block' }}>
      {lines.map((line, li) => (
        <React.Fragment key={li}>
          <span className="inline-block overflow-hidden align-top">
            {line.split(' ').map((word, wi) => (
              <span
                key={wi}
                className="inline-block"
                style={{
                  transform: triggered ? 'scale(1)' : 'scale(0.3)',
                  opacity: triggered ? 1 : 0,
                  filter: triggered ? 'blur(0px)' : 'blur(8px)',
                  transition: `transform 1.4s cubic-bezier(0.34, 1.56, 0.64, 1), opacity 0.6s ease, filter 1.2s ease`,
                  transitionDelay: triggered ? `${wi * 0.1}s` : '0s',
                  marginRight: '0.25em',
                }}
              >
                {word}
              </span>
            ))}
          </span>
          {li < lines.length - 1 && <br />}
        </React.Fragment>
      ))}
    </span>
  );
}
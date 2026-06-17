import React, { useState, useEffect, useRef } from 'react';
export default function StaggerText({ children, className = '', ...props }) {
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
    // Force re-trigger: briefly reset triggered, wait for observer to fire again
    if (retrigger > 0) {
      const t = setTimeout(() => setTriggered(false), 50);
      return () => clearTimeout(t);
    }
  }, [retrigger]);

  const lines = text.split('\n');

  if (!text) return <span ref={ref} className={className} {...props}>{children}</span>;

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
                  transform: triggered ? 'translateY(0)' : 'translateY(110%)',
                  opacity: triggered ? 1 : 0,
                  transition: `transform 1.2s cubic-bezier(0.22, 0.61, 0.36, 1), opacity 0.8s ease`,
                  transitionDelay: triggered ? `${wi * 0.12}s` : '0s',
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
import React, { useState, useEffect, useRef } from 'react';

export default function StaggerText({ children, className = '', ...props }) {
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

  // Split text into words, preserving line breaks
  const lines = text.split('\n');

  if (!text) return <span ref={ref} className={className} {...props}>{children}</span>;

  return (
    <span ref={ref} className={className} {...props}>
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
                  transition: `transform 0.6s cubic-bezier(0.22, 0.61, 0.36, 1), opacity 0.4s ease`,
                  transitionDelay: triggered ? `${wi * 0.06}s` : '0s',
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
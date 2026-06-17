import React, { useState, useEffect, useRef } from 'react';
export default function CircuitBreakText({ children, className = '', ...props }) {
  const [display, setDisplay] = useState('');
  const [triggered, setTriggered] = useState(false);
  const [retrigger, setRetrigger] = useState(0);
  const [visible, setVisible] = useState(true);
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

    // Phase 1: Flash on
    setDisplay(text);
    setVisible(true);

    const timeouts = [];

    // Phase 2: Brief halt (text vanishes)
    const haltT = setTimeout(() => {
      setVisible(false);
    }, 500);
    timeouts.push(haltT);

    // Phase 3: Resume (text returns with full reveal)
    const resumeT = setTimeout(() => {
      setVisible(true);
    }, 1100);
    timeouts.push(resumeT);

    // Phase 4: Second brief flicker
    const flickerT = setTimeout(() => {
      setVisible(false);
    }, 1200);
    timeouts.push(flickerT);

    const flickerEndT = setTimeout(() => {
      setVisible(true);
    }, 1350);
    timeouts.push(flickerEndT);

    return () => timeouts.forEach(clearTimeout);
  }, [triggered, text, retrigger]);

  if (!text) return <span ref={ref} className={className} {...props}>{children}</span>;

  const renderText = triggered ? (display || text) : text;
  const lines = renderText.split('\n');

  return (
    <span ref={ref} className={className} {...props} style={{ position: 'relative', display: 'inline-block' }}>
      <span style={{
        opacity: triggered && !visible ? 0 : 1,
        transition: 'opacity 0.08s ease',
      }}>
        {lines.map((line, i) => (
          <React.Fragment key={i}>
            {line}
            {i < lines.length - 1 && <br />}
          </React.Fragment>
        ))}
      </span>
    </span>
  );
}
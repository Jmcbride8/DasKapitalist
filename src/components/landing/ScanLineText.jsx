import React, { useState, useEffect, useRef } from 'react';
export default function ScanLineText({ children, className = '', ...props }) {
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

    const lines = text.split('\n');
    const totalDuration = 2000;
    let start = performance.now();

    let frame;
    const animate = (now) => {
      const elapsed = now - start;
      const progress = Math.min(elapsed / totalDuration, 1);

      // Scanline reveals line by line, then characters within each line
      const result = lines.map((line, li) => {
        // Each line starts revealing after a portion of the total progress
        const lineStart = li / lines.length * 0.4;
        const lineEnd = Math.min(1, (li + 1) / lines.length * 0.7 + 0.3);
        const lineProgress = Math.max(0, Math.min(1, (progress - lineStart) / (lineEnd - lineStart)));

        // Within the line, characters reveal left to right
        const charCount = Math.floor(lineProgress * line.length);
        return line.split('').map((ch, ci) => {
          if (ci < charCount) return ch;
          return '\u00A0';
        }).join('');
      });

      setDisplay(result.join('\n'));

      if (progress < 1) {
        frame = requestAnimationFrame(animate);
      } else {
        setDisplay(text);
      }
    };

    // Brief delay before scan starts
    const t = setTimeout(() => {
      start = performance.now();
      frame = requestAnimationFrame(animate);
    }, 150);

    return () => {
      clearTimeout(t);
      if (frame) cancelAnimationFrame(frame);
    };
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
"use client";

import React from "react";

type Props = React.HTMLAttributes<HTMLSpanElement> & {
  text: string;
  speed?: number; // ms per character
  startDelay?: number; // ms before typing starts
  showCaret?: boolean;
};

export default function TypingText({
  text,
  speed = 60,
  startDelay = 300,
  showCaret = true,
  className,
  ...rest
}: Props) {
  const [idx, setIdx] = React.useState(0);
  const [started, setStarted] = React.useState(false);

  React.useEffect(() => {
    const t = setTimeout(() => setStarted(true), startDelay);
    return () => clearTimeout(t);
  }, [startDelay]);

  React.useEffect(() => {
    if (!started) return;
    if (idx >= text.length) return;
    const it = setInterval(() => setIdx((v) => Math.min(text.length, v + 1)), speed);
    return () => clearInterval(it);
  }, [started, idx, text.length, speed]);

  const visible = text.slice(0, idx);

  return (
    <span className={className} {...rest}>
      <span>{visible}</span>
      {showCaret ? <span className="typing-caret" aria-hidden="true" /> : null}
    </span>
  );
}


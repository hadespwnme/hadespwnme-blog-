"use client";

import Link from "next/link";
import React from "react";

type Lang = "id" | "en";

type Line = {
  text: string;
  delayAfterMs?: number;
  link?: { href: string; start: number; end: number };
};

function usePrefersReducedMotion() {
  const [reduced, setReduced] = React.useState(false);

  React.useEffect(() => {
    const mq = window.matchMedia?.("(prefers-reduced-motion: reduce)");
    if (!mq) return;

    const onChange = () => setReduced(Boolean(mq.matches));
    onChange();
    mq.addEventListener?.("change", onChange);
    return () => mq.removeEventListener?.("change", onChange);
  }, []);

  return reduced;
}

function renderLine(line: Line, visibleChars: number) {
  const visible = line.text.slice(0, visibleChars);
  if (!line.link) return <>{visible}</>;

  const { href, start, end } = line.link;
  if (visibleChars <= start) return <>{visible}</>;

  const before = line.text.slice(0, start);
  const linkText = line.text.slice(start, Math.min(end, visibleChars));
  const after = visibleChars > end ? line.text.slice(end, visibleChars) : "";

  return (
    <>
      {before}
      <Link href={href} className="text-white border-b-2 border-current hover:opacity-80">
        {linkText}
      </Link>
      {after}
    </>
  );
}

function getLines(lang: Lang): Line[] {
  const homeWord = lang === "id" ? "beranda" : "home";
  const last = lang === "id"
    ? `Kembali ke ${homeWord} dan mulai lagi.`
    : `Go back ${homeWord} and start over.`;
  const linkStart = last.indexOf(homeWord);
  const linkEnd = linkStart + homeWord.length;

  return lang === "id"
    ? [
        { text: "Ups! Sepertinya kamu tersesat.", delayAfterMs: 1000 },
        { text: "Maaf ya.", delayAfterMs: 1000 },
        { text: "Aku coba bantu.", delayAfterMs: 1000 },
        { text: last, delayAfterMs: 0, link: { href: "/", start: linkStart, end: linkEnd } },
      ]
    : [
        { text: "Oops! It looks like you're lost.", delayAfterMs: 1000 },
        { text: "Sorry about that.", delayAfterMs: 1000 },
        { text: "Let me try and help.", delayAfterMs: 1000 },
        { text: last, delayAfterMs: 0, link: { href: "/", start: linkStart, end: linkEnd } },
      ];
}

export default function NotFoundTypewriter({ lang }: { lang: Lang }) {
  const lines = React.useMemo(() => getLines(lang), [lang]);
  const reducedMotion = usePrefersReducedMotion();
  const [hydrated, setHydrated] = React.useState(false);

  const [lineIndex, setLineIndex] = React.useState(0);
  const [charIndex, setCharIndex] = React.useState(0);
  const [done, setDone] = React.useState(false);

  React.useEffect(() => setHydrated(true), []);

  React.useEffect(() => {
    if (!hydrated) return;
    if (reducedMotion) return;
    if (done) return;

    const line = lines[lineIndex];
    if (!line) return;

    if (charIndex < line.text.length) {
      const t = window.setTimeout(() => setCharIndex((v) => Math.min(line.text.length, v + 1)), 18);
      return () => window.clearTimeout(t);
    }

    const wait = typeof line.delayAfterMs === "number" ? line.delayAfterMs : 900;
    const t = window.setTimeout(() => {
      if (lineIndex >= lines.length - 1) {
        setDone(true);
      } else {
        setLineIndex((v) => v + 1);
        setCharIndex(0);
      }
    }, wait);
    return () => window.clearTimeout(t);
  }, [hydrated, reducedMotion, done, lineIndex, charIndex, lines]);

  const fullStatic = (
    <div className="space-y-2 font-mono text-white/90 leading-relaxed">
      {lines.map((line) => (
        <p key={line.text}>
          {line.link ? renderLine(line, line.text.length) : line.text}
        </p>
      ))}
    </div>
  );

  if (!hydrated || reducedMotion) return fullStatic;

  return (
    <div className="font-mono text-white/90 leading-relaxed">
      <p className="sr-only">{lines.map((l) => l.text).join(" ")}</p>
      <div aria-hidden="true" className="space-y-2">
        {lines.map((line, i) => {
          if (i < lineIndex) {
            return <p key={line.text}>{renderLine(line, line.text.length)}</p>;
          }
          if (i > lineIndex) return null;
          return (
            <p key={line.text}>
              {renderLine(line, charIndex)}
              {!done ? <span className="typing-caret" aria-hidden="true" /> : null}
            </p>
          );
        })}
      </div>
    </div>
  );
}


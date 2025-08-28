"use client";

import React, { isValidElement, useMemo, useState } from "react";

type Props = { children?: React.ReactNode };

export default function CodeBlock({ children }: Props) {
  const codeEl = useMemo(() => {
    if (Array.isArray(children)) return children[0] ?? null;
    return children ?? null;
  }, [children]);

  const raw = isValidElement(codeEl) ? (codeEl.props as unknown as { children?: unknown }).children : codeEl;
  const text = useMemo(() => {
    const val = Array.isArray(raw) ? raw.join("") : String(raw ?? "");
    return val.replace(/\n$/, "");
  }, [raw]);

  const language: string | undefined = useMemo(() => {
    const cls: string | undefined = isValidElement(codeEl)
      ? (codeEl.props as unknown as { className?: string }).className
      : undefined;
    if (!cls) return undefined;
    const m = cls.match(/language-([a-z0-9#+-]+)/i);
    return m?.[1];
  }, [codeEl]);

  const [copied, setCopied] = useState(false);
  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 1200);
    } catch {}
  };

  return (
    <div className="rounded-md border border-black/10 dark:border-white/10 overflow-hidden bg-[#0b1020] text-[#eaeaff]">
      <div className="flex items-center justify-between px-3 py-2 bg-[#12182b] border-b border-white/10">
        <div className="flex items-center gap-1.5">
          <span className="w-3 h-3 rounded-full bg-red-400" />
          <span className="w-3 h-3 rounded-full bg-yellow-400" />
          <span className="w-3 h-3 rounded-full bg-green-400" />
          {language ? (
            <span className="ml-2 text-[10px] uppercase tracking-wide opacity-60">{language}</span>
          ) : null}
        </div>
        <button
          type="button"
          onClick={handleCopy}
          aria-label="Copy code"
          className="inline-flex items-center gap-1 rounded-md px-2 py-1 text-xs font-medium bg-black/70 text-white hover:bg-black/80 dark:bg-white/20 dark:hover:bg-white/30"
        >
          {copied ? "Copied" : "Copy"}
        </button>
      </div>
      <pre className="overflow-auto max-h-[70vh] p-3 text-sm leading-relaxed font-mono whitespace-pre">
        {codeEl}
      </pre>
    </div>
  );
}

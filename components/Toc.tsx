"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useLang } from "@/lib/useLang";

type TocItem = { id: string; text: string; level: 2 | 3 };
type TocGroup = { key: string; title: TocItem; children: TocItem[] };

type TocProps = {
  containerId: string;
  variant?: "sidebar" | "dropdown";
};

function groupTocItems(items: TocItem[], fallbackTitle: string): TocGroup[] {
  const groups: TocGroup[] = [];
  let current: TocGroup | null = null;
  let orphan: TocGroup | null = null;

  for (const item of items) {
    if (item.level === 2) {
      current = { key: item.id || `h2-${groups.length}`, title: item, children: [] };
      groups.push(current);
      continue;
    }

    if (!current) {
      if (!orphan) {
        orphan = {
          key: "__orphan",
          title: { id: "", text: fallbackTitle, level: 2 },
          children: [],
        };
        groups.push(orphan);
      }
      current = orphan;
    }

    current.children.push(item);
  }

  return groups;
}

export default function Toc({ containerId, variant = "sidebar" }: TocProps) {
  const [items, setItems] = useState<TocItem[]>([]);
  const [active, setActive] = useState<string>("");
  const detailsRef = useRef<HTMLDetailsElement | null>(null);
  const groupRefs = useRef<Map<string, HTMLDetailsElement>>(new Map());
  const { lang } = useLang();
  const title = lang === "id" ? "Daftar Isi" : "Table of Contents";
  const fallbackGroupTitle = lang === "id" ? "Bagian" : "Sections";

  useEffect(() => {
    const container = document.getElementById(containerId);
    if (!container) return;
    const headings = Array.from(container.querySelectorAll("h2, h3")) as HTMLHeadingElement[];
    const mapped = headings.map((h) => ({
      id: h.id,
      text: h.textContent || "",
      level: (h.tagName === "H2" ? 2 : 3) as 2 | 3,
    })) satisfies TocItem[];
    setItems(mapped);

    const hashId = decodeURIComponent((location.hash || "").replace(/^#/, ""));
    const initialActive =
      (hashId && mapped.some((it) => it.id === hashId) && hashId) ||
      mapped.find((it) => it.id)?.id ||
      "";
    setActive((prev) => prev || initialActive);

    const obs = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setActive((entry.target as HTMLElement).id);
            break;
          }
        }
      },
      { rootMargin: "0px 0px -70% 0px", threshold: 0.1 }
    );
    headings.forEach((h) => obs.observe(h));
    return () => obs.disconnect();
  }, [containerId]);

  const groups = useMemo(() => groupTocItems(items, fallbackGroupTitle), [items, fallbackGroupTitle]);
  const activeGroupKey = useMemo(() => {
    for (const group of groups) {
      if (group.title.id && group.title.id === active) return group.key;
      if (group.children.some((c) => c.id === active)) return group.key;
    }
    return "";
  }, [groups, active]);

  useEffect(() => {
    if (!activeGroupKey) return;
    const map = groupRefs.current;
    for (const [key, el] of map) el.open = key === activeGroupKey;
    if (variant === "dropdown" && detailsRef.current) detailsRef.current.open = false;
  }, [activeGroupKey, variant]);

  const activeText = useMemo(() => {
    const current = items.find((it) => it.id === active);
    return current?.text || "";
  }, [items, active]);

  const renderGroup = (group: TocGroup) => {
    const isGroupActive =
      (group.title.id && group.title.id === active) || group.children.some((c) => c.id === active);

    return (
      <details
        key={group.key}
        ref={(el) => {
          if (el) {
            groupRefs.current.set(group.key, el);
            if (!el.dataset.tocInit) el.dataset.tocInit = "1";
          } else {
            groupRefs.current.delete(group.key);
          }
        }}
        className="group rounded-md bg-black/[0.02] dark:bg-white/[0.03]"
      >
        <summary className="cursor-pointer list-none px-3 py-2 flex items-center justify-between gap-3 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black/20 dark:focus-visible:ring-white/20 rounded-md">
          {group.title.id ? (
            <a
              href={`#${group.title.id}`}
              className={`min-w-0 truncate hover:underline underline-offset-4 ${
                isGroupActive ? "text-foreground" : "text-foreground/70"
              }`}
              onClick={(e) => {
                e.stopPropagation();
                if (variant === "dropdown" && detailsRef.current) detailsRef.current.open = false;
              }}
            >
              {group.title.text}
            </a>
          ) : (
            <span className={`min-w-0 truncate ${isGroupActive ? "text-foreground" : "text-foreground/70"}`}>
              {group.title.text}
            </span>
          )}
          <svg aria-hidden viewBox="0 0 20 20" className="w-4 h-4 opacity-70 group-open:-rotate-180 transition-transform">
            <path
              fill="currentColor"
              d="M5.23 7.21a.75.75 0 011.06.02L10 10.94l3.71-3.71a.75.75 0 111.06 1.06l-4.24 4.24a.75.75 0 01-1.06 0L5.21 8.29a.75.75 0 01.02-1.08z"
            />
          </svg>
        </summary>

        {group.children.length ? (
          <ul className="px-3 pb-2 space-y-1">
            {group.children.map((it) => (
              <li key={it.id} className="pl-3">
                <a
                  href={`#${it.id}`}
                  className={`block rounded-md px-2 py-1 hover:bg-black/5 dark:hover:bg-white/10 ${
                    active === it.id ? "text-foreground" : "text-foreground/70"
                  }`}
                  onClick={() => {
                    if (variant === "dropdown" && detailsRef.current) detailsRef.current.open = false;
                  }}
                >
                  {it.text}
                </a>
              </li>
            ))}
          </ul>
        ) : null}
      </details>
    );
  };

  if (!items.length) return null;

  if (variant === "dropdown") {
    return (
      <details
        ref={detailsRef}
        className="group text-sm border border-black/5 dark:border-white/10 rounded-lg bg-white/60 dark:bg-white/5 backdrop-blur-sm shadow-sm"
        data-aos="fade-up"
      >
        <summary className="cursor-pointer list-none px-4 py-3 flex items-center justify-between gap-3 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black/20 dark:focus-visible:ring-white/20 rounded-lg">
          <div className="min-w-0">
            <div className="font-semibold">{title}</div>
            {activeText ? <div className="text-xs text-foreground/60 truncate">{activeText}</div> : null}
          </div>
          <svg aria-hidden viewBox="0 0 20 20" className="w-4 h-4 opacity-70 group-open:-rotate-180 transition-transform">
            <path fill="currentColor" d="M5.23 7.21a.75.75 0 011.06.02L10 10.94l3.71-3.71a.75.75 0 111.06 1.06l-4.24 4.24a.75.75 0 01-1.06 0L5.21 8.29a.75.75 0 01.02-1.08z" />
          </svg>
        </summary>
        <div className="px-4 pb-3">
          <div className="max-h-[60vh] overflow-auto pr-1 space-y-2">{groups.map(renderGroup)}</div>
        </div>
      </details>
    );
  }

  return (
    <nav className="text-sm sticky top-24 p-4 border border-black/5 dark:border-white/10 rounded-lg" data-aos="fade-left">
      <div className="font-medium mb-2">{title}</div>
      <div className="space-y-2">{groups.map(renderGroup)}</div>
    </nav>
  );
}

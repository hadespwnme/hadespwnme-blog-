"use client";

import { useEffect, useRef, useState } from "react";

type TocItem = { id: string; text: string; level: number };

type TocProps = {
  containerId: string;
  variant?: "sidebar" | "dropdown";
};

export default function Toc({ containerId, variant = "sidebar" }: TocProps) {
  const [items, setItems] = useState<TocItem[]>([]);
  const [active, setActive] = useState<string>("");
  const detailsRef = useRef<HTMLDetailsElement | null>(null);

  useEffect(() => {
    const container = document.getElementById(containerId);
    if (!container) return;
    const headings = Array.from(container.querySelectorAll("h2, h3")) as HTMLHeadingElement[];
    const mapped = headings.map((h) => ({
      id: h.id,
      text: h.textContent || "",
      level: h.tagName === "H2" ? 2 : 3,
    }));
    setItems(mapped);

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

  if (!items.length) return null;

  if (variant === "dropdown") {
    return (
      <details ref={detailsRef} className="group text-sm border border-black/5 dark:border-white/10 rounded-lg" data-aos="fade-up">
        <summary className="cursor-pointer list-none px-4 py-3 flex items-center justify-between">
          <span className="font-medium">Daftar Isi</span>
          <svg aria-hidden viewBox="0 0 20 20" className="w-4 h-4 opacity-70 group-open:-rotate-180 transition-transform">
            <path fill="currentColor" d="M5.23 7.21a.75.75 0 011.06.02L10 10.94l3.71-3.71a.75.75 0 111.06 1.06l-4.24 4.24a.75.75 0 01-1.06 0L5.21 8.29a.75.75 0 01.02-1.08z" />
          </svg>
        </summary>
        <ul className="px-4 pb-3 space-y-1">
          {items.map((it) => (
            <li key={it.id} className={it.level === 3 ? "pl-3" : ""}>
              <a
                href={`#${it.id}`}
                className={`block py-0.5 hover:underline underline-offset-4 ${active === it.id ? "text-foreground" : "text-foreground/70"}`}
                onClick={() => {
                  // Close dropdown after navigating to heading
                  if (detailsRef.current) detailsRef.current.open = false;
                }}
              >
                {it.text}
              </a>
            </li>
          ))}
        </ul>
      </details>
    );
  }

  return (
    <nav className="text-sm sticky top-24 p-4 border border-black/5 dark:border-white/10 rounded-lg" data-aos="fade-left">
      <div className="font-medium mb-2">Daftar Isi</div>
      <ul className="space-y-1">
        {items.map((it) => (
          <li key={it.id} className={it.level === 3 ? "pl-3" : ""}>
            <a
              href={`#${it.id}`}
              className={`hover:underline underline-offset-4 ${active === it.id ? "text-foreground" : "text-foreground/70"}`}
            >
              {it.text}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}

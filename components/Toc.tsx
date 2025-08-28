"use client";

import { useEffect, useState } from "react";

type TocItem = { id: string; text: string; level: number };

export default function Toc({ containerId }: { containerId: string }) {
  const [items, setItems] = useState<TocItem[]>([]);
  const [active, setActive] = useState<string>("");

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

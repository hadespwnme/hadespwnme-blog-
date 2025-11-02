"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { Github, Sun, Moon, Menu, X } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { useLang } from "@/lib/useLang";
import { Press_Start_2P } from "next/font/google";

const pressStart = Press_Start_2P({ subsets: ["latin"], weight: "400" });

const labels = {
  id: {
    brand: "hadespwnme",
    posts: "Artikel",
    categories: "Kategori",
    tags: "Tag",
    links: "Tautan",
    about: "Tentang",
    language: "Bahasa",
    theme: "Tema",
  },
  en: {
    brand: "hadespwnme",
    posts: "Posts",
    categories: "Categories",
    tags: "Tags",
    links: "Links",
    about: "About",
    language: "Language",
    theme: "Theme",
  },
};

export default function Navbar() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [dark, setDark] = useState(false);
  const { lang, toggle: toggleLang } = useLang();

  useEffect(() => {
    const root = document.documentElement;
    const storedTheme = localStorage.getItem("theme");
    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    const isDark = storedTheme ? storedTheme === "dark" : prefersDark;
    root.classList.toggle("dark", isDark);
    root.classList.toggle("light", !isDark);
    setDark(isDark);
  }, []);

  const t = useMemo(() => labels[lang], [lang]);

  const toggleTheme = () => {
    setDark((prev) => {
      const next = !prev;
      const root = document.documentElement;
      root.classList.toggle("dark", next);
      root.classList.toggle("light", !next);
      localStorage.setItem("theme", next ? "dark" : "light");
      return next;
    });
  };

  const navItems = [
    { href: "/posts", label: t.posts },
    { href: "/categories", label: t.categories },
    { href: "/tags", label: t.tags },
    { href: "/links", label: t.links },
    { href: "/about", label: t.about },
  ];

  return (
    <header className="sticky top-0 z-50 border-b border-black/10 dark:border-white/10 bg-background/80 backdrop-blur supports-[backdrop-filter]:bg-background/70">
      <nav className="mx-auto max-w-5xl px-4 h-14 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button
            className="md:hidden p-2 rounded-md hover:bg-black/5 dark:hover:bg-white/10"
            aria-label={open ? "Tutup menu" : "Buka menu"}
            onClick={() => setOpen((v) => !v)}
          >
            {open ? <X size={18} /> : <Menu size={18} />}
          </button>
          <Image
            src="/assets/hades-logo.png"
            alt="Hadespwnme logo"
            width={52}
            height={52}
            priority
            unoptimized
          />
          <Link
            href="/"
            className={`brand ${pressStart.className} tracking-tight text-sm sm:text-base`}
            style={{
              textShadow: "0 0 2px #a78bfa, 0 0 10px #60a5fa",
            }}
          >
            {(() => {
              const brand = t.brand ?? "hadespwnme";
              const idx = brand.toLowerCase().indexOf("pwn");
              if (idx === -1) return brand;
              return (
                <>
                  {brand.slice(0, idx)}
                  <span className="pwn">{brand.slice(idx, idx + 3)}</span>
                  {brand.slice(idx + 3)}
                </>
              );
            })()}
          </Link>
        </div>

        <ul className="hidden md:flex items-center gap-6">
          {navItems.map((item) => (
            <li key={item.href}>
              <Link
                href={item.href}
                className={`hover:underline underline-offset-4 ${pathname === item.href ? "font-medium" : ""}`}
              >
                {item.label}
              </Link>
            </li>
          ))}
        </ul>

        <div className="flex items-center gap-2">
          <a
            href="https://github.com/hadespwnme"
            target="_blank"
            rel="noreferrer"
            aria-label="GitHub"
            className="p-2 rounded-md hover:bg-black/5 dark:hover:bg-white/10"
          >
            <Github size={18} />
          </a>

          <div className="relative">
            <button
              className="px-2 py-1 text-xs rounded-md border border-black/10 dark:border-white/15 hover:bg-black/5 dark:hover:bg-white/10"
              aria-label="Pilih bahasa"
              onClick={() => toggleLang()}
            >
              {lang.toUpperCase()}
            </button>
          </div>

          <button
            className="p-2 rounded-md hover:bg-black/5 dark:hover:bg-white/10"
            aria-label="Toggle tema"
            onClick={toggleTheme}
          >
            {dark ? <Sun size={16} /> : <Moon size={16} />}
          </button>
        </div>
      </nav>

      {open && (
        <div className="md:hidden border-t border-black/10 dark:border-white/10 bg-background/95">
          <ul className="mx-auto max-w-5xl px-4 py-3 space-y-2">
            {navItems.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  onClick={() => setOpen(false)}
                  className={`block py-1 ${pathname === item.href ? "font-medium underline underline-offset-4" : ""}`}
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      )}
    </header>
  );
}

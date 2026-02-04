"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { Github, Menu, X } from "lucide-react";
import { useMemo, useState } from "react";
import { useLang } from "@/lib/useLang";
import { Press_Start_2P } from "next/font/google";
import { AnimatedThemeToggler } from "@/components/ui/animated-theme-toggler";

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
    openMenu: "Buka menu",
    closeMenu: "Tutup menu",
    chooseLanguage: "Pilih bahasa",
    toggleTheme: "Ubah tema",
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
    openMenu: "Open menu",
    closeMenu: "Close menu",
    chooseLanguage: "Select language",
    toggleTheme: "Toggle theme",
  },
};

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const { lang, toggle: toggleLang } = useLang();

  const t = useMemo(() => labels[lang], [lang]);

  const navItems = [
    { href: "/posts", label: t.posts },
    { href: "/categories", label: t.categories },
    { href: "/tags", label: t.tags },
    { href: "/links", label: t.links },
    { href: "/about", label: t.about },
  ];

  const onToggleLanguage = () => {
    toggleLang();
    router.refresh();
  };

  return (
    <header className="sticky top-0 z-50 border-b border-black/10 dark:border-white/10 bg-background/80 backdrop-blur supports-[backdrop-filter]:bg-background/70">
      <nav className="relative mx-auto max-w-5xl px-4 h-14 flex items-center justify-center md:justify-between">
        <button
          className="md:hidden absolute left-4 p-2 rounded-md hover:bg-black/5 dark:hover:bg-white/10"
          aria-label={open ? t.closeMenu : t.openMenu}
          onClick={() => setOpen((v) => !v)}
        >
          {open ? <X size={18} /> : <Menu size={18} />}
        </button>

        <div className="flex items-center gap-3 mx-auto md:mx-0">
          <Image
            src="/assets/hades-logo.png"
            alt="Hadespwnme logo"
            width={56}
            height={56}
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

        <div className="hidden md:flex items-center gap-2">
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
              aria-label={t.chooseLanguage}
              onClick={onToggleLanguage}
            >
              {lang.toUpperCase()}
            </button>
          </div>

          <AnimatedThemeToggler aria-label={t.toggleTheme} />
        </div>
      </nav>

      {open && (
        <div className="md:hidden bg-background/95">
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

          <div className="mx-auto max-w-5xl px-4 py-3">
            <div className="flex items-center justify-center gap-3">
              <a
                href="https://github.com/hadespwnme"
                target="_blank"
                rel="noreferrer"
                aria-label="GitHub"
                className="p-2 rounded-md hover:bg-black/5 dark:hover:bg-white/10"
              >
                <Github size={18} />
              </a>

              <button
                className="px-2 py-1 text-xs rounded-md border border-black/10 dark:border-white/15 hover:bg-black/5 dark:hover:bg-white/10"
                aria-label={t.chooseLanguage}
                onClick={() => {
                  setOpen(false);
                  onToggleLanguage();
                }}
              >
                {lang.toUpperCase()}
              </button>

              <AnimatedThemeToggler aria-label={t.toggleTheme} />
            </div>
          </div>
        </div>
      )}
    </header>
  );
}

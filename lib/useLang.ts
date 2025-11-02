"use client";

import { useEffect, useState } from "react";

export type Lang = "id" | "en";

export function useLang() {
  const [lang, setLang] = useState<Lang>("id");

  useEffect(() => {
    const cookieMatch = document.cookie.match(/(?:^|; )lang=(id|en)/);
    const cookieLang = (cookieMatch?.[1] as Lang | undefined) || undefined;
    const stored = (localStorage.getItem("lang") as Lang) || cookieLang || "id";
    setLang(stored);
    const onStorage = (e: StorageEvent) => {
      if (e.key === "lang" && (e.newValue === "id" || e.newValue === "en")) {
        setLang(e.newValue as Lang);
      }
    };
    const onLangChange = (e: Event) => {
      const detail = (e as CustomEvent).detail;
      if (detail === "id" || detail === "en") setLang(detail);
    };
    window.addEventListener("storage", onStorage);
    window.addEventListener("langchange", onLangChange as EventListener);
    return () => {
      window.removeEventListener("storage", onStorage);
      window.removeEventListener("langchange", onLangChange as EventListener);
    };
  }, []);

  const toggle = () => {
    const next = lang === "id" ? "en" : "id";
    localStorage.setItem("lang", next);
    document.cookie = `lang=${next}; path=/; max-age=31536000`;
    window.dispatchEvent(new CustomEvent("langchange", { detail: next }));
    setLang(next);
    window.location.reload();
  };

  const set = (l: Lang) => {
    localStorage.setItem("lang", l);
    document.cookie = `lang=${l}; path=/; max-age=31536000`;
    window.dispatchEvent(new CustomEvent("langchange", { detail: l }));
    setLang(l);
    window.location.reload();
  };

  return { lang, toggle, setLang: set };
}

"use client";

import * as React from "react";
import { Moon, Sun } from "lucide-react";

type ThemeMode = "dark" | "light";

function getStoredTheme(): ThemeMode {
  try {
    const stored = localStorage.getItem("theme");
    return stored === "light" ? "light" : "dark";
  } catch {
    return "dark";
  }
}

function applyTheme(theme: ThemeMode) {
  const root = document.documentElement;
  const isDark = theme === "dark";
  root.classList.toggle("dark", isDark);
  root.classList.toggle("light", !isDark);
  try {
    localStorage.setItem("theme", theme);
  } catch {
    // ignore
  }
}

export function AnimatedThemeToggler(props: React.ButtonHTMLAttributes<HTMLButtonElement>) {
  const [theme, setTheme] = React.useState<ThemeMode | null>(null);
  const [ticking, setTicking] = React.useState(false);

  React.useEffect(() => {
    const initial =
      document.documentElement.classList.contains("dark") ||
      (!document.documentElement.classList.contains("light") && getStoredTheme() === "dark")
        ? "dark"
        : "light";
    setTheme(initial);
  }, []);

  const toggle = (origin?: { x: number; y: number }) => {
    const current = theme ?? getStoredTheme();
    const next: ThemeMode = current === "dark" ? "light" : "dark";

    const run = () => {
      applyTheme(next);
      setTheme(next);
    };

    setTicking(true);
    window.setTimeout(() => setTicking(false), 380);

    if (origin) {
      const root = document.documentElement;
      root.style.setProperty("--theme-toggle-x", `${origin.x}px`);
      root.style.setProperty("--theme-toggle-y", `${origin.y}px`);
      const dx = Math.max(origin.x, window.innerWidth - origin.x);
      const dy = Math.max(origin.y, window.innerHeight - origin.y);
      root.style.setProperty("--theme-toggle-r", `${Math.hypot(dx, dy)}px`);
    }

    const maybeStartViewTransition = (
      document as unknown as { startViewTransition?: (cb: () => void) => unknown }
    ).startViewTransition;

    if (typeof maybeStartViewTransition === "function") {
      try {
        // Needs correct `this` binding to `document` on some browsers.
        maybeStartViewTransition.call(document, run);
      } catch {
        run();
      }
    } else {
      run();
    }
  };

  const isDark = (theme ?? "dark") === "dark";

  return (
    <button
      type="button"
      {...props}
      onClick={(e) => {
        props.onClick?.(e);
        if (e.defaultPrevented) return;
        const target = e.currentTarget;
        const rect = target.getBoundingClientRect();
        const x = e.clientX || rect.left + rect.width / 2;
        const y = e.clientY || rect.top + rect.height / 2;
        toggle({ x, y });
      }}
      className={[
        "relative inline-flex h-9 w-9 items-center justify-center rounded-md",
        "transition-colors hover:bg-black/5 dark:hover:bg-white/10",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black/20 dark:focus-visible:ring-white/20",
        ticking ? "scale-[0.98]" : "",
        props.className ?? "",
      ].join(" ")}
      aria-label={props["aria-label"] ?? "Toggle theme"}
    >
      <span
        className={[
          "absolute inset-0 grid place-items-center transition-all duration-300",
          isDark ? "opacity-100 rotate-0 scale-100" : "opacity-0 -rotate-90 scale-75",
        ].join(" ")}
      >
        <Sun size={16} />
      </span>
      <span
        className={[
          "absolute inset-0 grid place-items-center transition-all duration-300",
          isDark ? "opacity-0 rotate-90 scale-75" : "opacity-100 rotate-0 scale-100",
        ].join(" ")}
      >
        <Moon size={16} />
      </span>
    </button>
  );
}

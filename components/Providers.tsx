"use client";

import { useEffect } from "react";
import AOS from "aos";
import "aos/dist/aos.css";
import { NextUIProvider } from "@nextui-org/react";

export default function Providers({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    AOS.init({ duration: 500, once: true, easing: "ease-out-cubic", offset: 0 });

    const refresh = () => {
      AOS.refreshHard();
    };

    const timeoutId = window.setTimeout(refresh, 0);
    window.addEventListener("load", refresh);

    document.fonts?.ready
      ?.then(refresh)
      .catch(() => {
        /* no-op */
      });

    return () => {
      window.clearTimeout(timeoutId);
      window.removeEventListener("load", refresh);
    };
  }, []);

  return <NextUIProvider>{children}</NextUIProvider>;
}

"use client";

import { useEffect } from "react";
import AOS from "aos";
import "aos/dist/aos.css";
import { NextUIProvider } from "@nextui-org/react";

export default function Providers({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    AOS.init({ duration: 500, once: true, easing: "ease-out-cubic" });
  }, []);

  return <NextUIProvider>{children}</NextUIProvider>;
}

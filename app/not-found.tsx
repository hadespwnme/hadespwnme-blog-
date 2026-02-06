import type { Metadata } from "next";
import NotFoundTypewriter from "@/components/NotFoundTypewriter";
import { getServerLang } from "@/lib/i18n-server";

export const metadata: Metadata = {
  title: "404 — Not Found",
};

export default async function NotFound() {
  const lang = await getServerLang();
  const t =
    lang === "id"
      ? { title: "404", subtitle: "Halaman tidak ditemukan" }
      : { title: "404", subtitle: "Page not found" };

  return (
    <section className="min-h-[60vh] flex items-center justify-center py-10">
      <div
        className="w-full max-w-[520px] rounded-md bg-neutral-900/80 shadow-[0_0_25px_rgba(0,0,0,0.5)] ring-1 ring-white/10"
        style={{ backdropFilter: "blur(6px)" }}
      >
        <div className="rounded-t-md bg-[#f9f9f3] px-3 py-2">
          <div className="flex items-center gap-2">
            <span className="h-3.5 w-3.5 rounded-full bg-[#fc635d]" />
            <span className="h-3.5 w-3.5 rounded-full bg-[#fdbc40]" />
            <span className="h-3.5 w-3.5 rounded-full bg-[#34c84a]" />
          </div>
        </div>

        <div className="px-5 pb-5 pt-4">
          <div className="mb-3">
            <h1 className="font-mono text-4xl font-bold tracking-tight text-white">{t.title}</h1>
            <p className="font-mono text-white/80">{t.subtitle}</p>
          </div>

          <NotFoundTypewriter lang={lang === "id" ? "id" : "en"} />
        </div>
      </div>
    </section>
  );
}


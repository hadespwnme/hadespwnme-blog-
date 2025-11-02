import AuthorCard from "@/components/AuthorCard";
import { getServerLang } from "@/lib/i18n-server";
import { Info, User, FileText } from "lucide-react";

export default async function AboutPage() {
  const lang = await getServerLang();
  const t =
    lang === "id"
      ? {
          title: "Tentang",
          updated: "Diperbarui 2025-01-01 · 2 menit",
          aboutSite: "Tentang Situs",
          aboutSiteBody:
            "Blog ini dibuat untuk dokumentasi writeup dalam bermain CTF. Dan saya membuatnya menggunakan Next Js dengan tema terinspirasi dari Tema Blowfish.",
          whoami: "Whoami",
          whoamiBody: "Halo, saya seorang penggemar keamanan siber dan pemain CTF dari Jakarta, Indonesia. Saya juga anggota TCP1P, di mana saya berpartisipasi dalam berbagai kompetisi CTF.",
          blogContent: "Konten Blog",
          blogContentBody: "Writeup untuk CTF / Pentest",
          latest: "Terbaru",
          latestBody: "Mengeksplorasi mesin lab baru dan menyempurnakan alur kerja.",
          replyEmail: "Balas via Email",
        }
      : {
          title: "About",
          updated: "Updated 2025-01-01 · 2 min",
          aboutSite: "About This Site",
          aboutSiteBody:
            "This blog documents my CTF writeups. I built it with Next.js and a theme inspired by the Blowfish theme.",
          whoami: "Whoami",
          whoamiBody: "Hello, I am a cyber security enthusiast and CTF player from Jakarta, Indonesia. Also, I am a member of TCP1P, where I participate in various CTF competitions.",
          blogContent: "Blog Content",
          blogContentBody: "Writeups for CTF / Pentest",
          latest: "Latest",
          latestBody: "Exploring new lab machines and refining workflows.",
          replyEmail: "Reply via Email",
        };

  return (
    <div className="space-y-6">
      <header data-aos="fade-up">
        <h1 className="text-2xl font-semibold">{t.title}</h1>
        <div className="text-xs text-foreground/60 mt-1">{t.updated}</div>
      </header>

      <AuthorCard />

      <article className="prose" data-aos="fade-up">
        <h2 className="flex items-center gap-2"><Info size={16} className="opacity-70" /> {t.aboutSite}</h2>
        <p>{t.aboutSiteBody}</p>

        <h2 className="flex items-center gap-2"><User size={16} className="opacity-70" /> {t.whoami}</h2>
        <p>
          {t.whoamiBody.split(/(pentesting|CTF|infrastruktur|infrastructure)/).map((s, i) =>
            s === "pentesting" || s === "CTF" || s === "infrastructure" || s === "infrastruktur" ? (
              <code key={i}>{s}</code>
            ) : (
              <span key={i}>{s}</span>
            )
          )}
        </p>

        <h2 className="flex items-center gap-2"><FileText size={16} className="opacity-70" /> {t.blogContent}</h2>
        <p>{t.blogContentBody}</p>
      </article>

      <div data-aos="fade-up">
        <a className="underline underline-offset-4 text-sm" href="mailto:hadespwn0@gmail.com">
          {t.replyEmail}
        </a>
      </div>
    </div>
  );
}

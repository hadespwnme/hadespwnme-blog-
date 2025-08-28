import Image from "next/image";
import Link from "next/link";
import { getAllPostsMeta } from "@/lib/posts";
import TagChip from "@/components/TagChip";
import CategoryChip from "@/components/CategoryChip";
import { getServerLang } from "@/lib/i18n-server";
import { Globe, Github } from "lucide-react";

export default async function Home() {
  const posts = getAllPostsMeta().slice(0, 6);
  const lang = await getServerLang();
  const t = lang === "id"
    ? {
        subtitle: "live by code and raised by ethic",
        latest: "Artikel Terbaru",
        more: "Tampilkan lebih banyak →",
        words: "kata",
        minutes: "menit",
      }
    : {
        subtitle: "live by code and raised by ethic",
        latest: "Latest Articles",
        more: "Show more →",
        words: "words",
        minutes: "min",
      };
  return (
    <div className="space-y-10">
      <section className="flex flex-col items-center text-center gap-3" data-aos="fade-up">
        <Image
          src="/assets/avatar.jpg"
          alt="Avatar"
          width={192}
          height={192}
          priority
          className="rounded-full"
          data-aos="zoom-in"
        />
        <h1 className="text-3xl font-bold tracking-tight" data-aos="fade-up">
          hadespwnme
        </h1>
        <p className="text-foreground/70" data-aos="fade-up" data-aos-delay="100">{t.subtitle}</p>
        <div className="flex items-center gap-2" data-aos="fade-up" data-aos-delay="150">
          <a
            href="https://hadespwn.me"
            target="_blank"
            rel="noreferrer"
            aria-label="Website"
            className="p-2 rounded-md hover:bg-black/5 dark:hover:bg-white/10"
          >
            <Globe size={18} />
          </a>
          <a
            href="https://github.com/hadespwnme"
            target="_blank"
            rel="noreferrer"
            aria-label="GitHub"
            className="p-2 rounded-md hover:bg-black/5 dark:hover:bg-white/10"
          >
            <Github size={18} />
          </a>
        </div>
      </section>

      <section>
        <h2 className="text-xl font-semibold mb-4" data-aos="fade-up">{t.latest}</h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {posts.map((p, i) => (
            <article
              key={p.slug}
              className="rounded-lg p-4 border border-black/20 dark:border-white/20 shadow-sm hover:-translate-y-0.5 hover:shadow-md transition dark:ring-1 dark:ring-white/15 dark:shadow-[0_8px_24px_rgba(0,0,0,0.6)]"
              data-aos="fade-up"
              data-aos-delay={i * 50}
            >
              <h3 className="font-semibold leading-tight mb-1">
                <Link href={`/posts/${p.slug}`}>{p.title}</Link>
              </h3>
              <div className="text-xs text-foreground/60 mb-2">
                {p.date} · {p.words} {t.words} · {p.minutes} {t.minutes}
              </div>
              <div className="flex flex-wrap gap-1.5 mb-1">
                {(p.categories ?? []).map((c) => (
                  <CategoryChip key={c} label={c} />
                ))}
              </div>
              <div className="flex flex-wrap gap-1.5">
                {(p.tags ?? []).map((t) => (
                  <TagChip key={t} label={t} />
                ))}
              </div>
            </article>
          ))}
        </div>
        <div className="mt-6" data-aos="fade-up">
          <Link href="/posts" className="text-sm underline underline-offset-4">{t.more}</Link>
        </div>
      </section>
    </div>
  );
}

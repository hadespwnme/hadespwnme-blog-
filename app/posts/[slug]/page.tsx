import AuthorCard from "@/components/AuthorCard";
import Toc from "@/components/Toc";
import { getAllPostsMeta, getPost } from "@/lib/posts";
import { notFound } from "next/navigation";
import { getServerLang } from "@/lib/i18n-server";
import AchievementBadge from "@/components/AchievementBadge";

export const dynamic = "force-dynamic";

export default async function PostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const lang = await getServerLang();
  const data = await getPost(slug, lang);
  if (!data) return notFound();
  const { content, meta } = data;

  const all = getAllPostsMeta(lang);
  const idx = all.findIndex((m) => m.slug === slug);
  const prev = idx >= 0 && idx + 1 < all.length ? all[idx + 1] : null;
  const next = idx > 0 ? all[idx - 1] : null;

  const t =
    lang === "id"
      ? { prev: "Sebelumnya", next: "Berikutnya", words: "kata", minutes: "menit" }
      : { prev: "Previous", next: "Next", words: "words", minutes: "min" };

  return (
    <article className="space-y-6">
      <header>
        <div className="flex items-start justify-between gap-3" data-aos="fade-up">
          <h1 className="text-3xl font-bold tracking-tight">{meta.title}</h1>
          <AchievementBadge achievement={meta.achievement ?? meta.achievment ?? null} className="mt-1 shrink-0" />
        </div>
        <div className="text-sm text-foreground/60 mt-1" data-aos="fade-up" data-aos-delay="50">
          {meta.date} · {meta.words} {t.words} · {meta.minutes} {t.minutes}
        </div>
        <div className="mt-3" data-aos="fade-up" data-aos-delay="100">
          <AuthorCard />
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_280px] gap-8">
        <div className="lg:hidden" data-aos="fade-up" data-aos-delay="140">
          <Toc containerId="post-content" variant="dropdown" />
        </div>

        <div id="post-content" className="prose" data-aos="fade-up" data-aos-delay="150">
          {content}
        </div>
        <div className="hidden lg:block">
          <Toc containerId="post-content" />
        </div>
      </div>

      <nav className="flex justify-between text-sm pt-6 border-t border-black/5 dark:border-white/10" data-aos="fade-up">
        {prev ? (
          <a className="underline underline-offset-4 opacity-70 hover:opacity-100" href={`/posts/${prev.slug}`}>
            ← {t.prev}
          </a>
        ) : (
          <span className="opacity-40">← {t.prev}</span>
        )}
        {next ? (
          <a className="underline underline-offset-4 opacity-70 hover:opacity-100" href={`/posts/${next.slug}`}>
            {t.next} →
          </a>
        ) : (
          <span className="opacity-40">{t.next} →</span>
        )}
      </nav>
    </article>
  );
}

import AuthorCard from "@/components/AuthorCard";
import Toc from "@/components/Toc";
import { getAllPostsMeta, getAllSlugs, getPost } from "@/lib/posts";
import { notFound } from "next/navigation";
import { getServerLang } from "@/lib/i18n-server";

export async function generateStaticParams() {
  return getAllSlugs().map((slug) => ({ slug }));
}

export default async function PostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const data = await getPost(slug);
  if (!data) return notFound();
  const { content, meta } = data;

  const all = getAllPostsMeta();
  const idx = all.findIndex((m) => m.slug === slug);
  const prev = idx >= 0 && idx + 1 < all.length ? all[idx + 1] : null; // older
  const next = idx > 0 ? all[idx - 1] : null; // newer

  const lang = await getServerLang();
  const t = lang === "id" ? { prev: "Sebelumnya", next: "Berikutnya" } : { prev: "Previous", next: "Next" };

  return (
    <article className="space-y-6">
      <header>
        <h1 className="text-3xl font-bold tracking-tight" data-aos="fade-up">
          {meta.title}
        </h1>
        <div className="text-sm text-foreground/60 mt-1" data-aos="fade-up" data-aos-delay="50">
          {meta.date} · {meta.words} kata · {meta.minutes} menit
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

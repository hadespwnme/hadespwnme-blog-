import Link from "next/link";
import { getAllPostsMeta } from "@/lib/posts";
import { getServerLang } from "@/lib/i18n-server";
import CategoryChip from "@/components/CategoryChip";
import TagChip from "@/components/TagChip";
import AchievementBadge from "@/components/AchievementBadge";

const PAGE_SIZE = 10;

export default async function PostsPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string }>;
}) {
  const lang = await getServerLang();
  const all = getAllPostsMeta(lang);
  const params = await searchParams;
  const page = Math.max(1, Number(params.page ?? "1") || 1);
  const totalPages = Math.max(1, Math.ceil(all.length / PAGE_SIZE));
  const items = all.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);
  const t = lang === "id"
    ? { title: "Artikel", prev: "Sebelumnya", next: "Berikutnya", words: "kata", minutes: "menit" }
    : { title: "Articles", prev: "Previous", next: "Next", words: "words", minutes: "min" };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold" data-aos="fade-up">{t.title}</h1>
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {items.map((p, i) => (
          <article
            key={p.slug}
            className="relative rounded-lg p-4 border border-black/20 dark:border-white shadow-sm hover:-translate-y-0.5 hover:shadow-md transition dark:ring-1 dark:ring-white/15 dark:shadow-[0_8px_24px_rgba(0,0,0,0.6)]"
            data-aos="fade-up"
            data-aos-delay={i * 50}
          >
            <AchievementBadge
              achievement={p.achievement ?? p.achievment ?? null}
              variant="corner"
            />
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
              {(p.tags ?? []).map((tg) => (
                <TagChip key={tg} label={tg} />
              ))}
            </div>
          </article>
        ))}
      </div>
      <div className="flex items-center gap-3" data-aos="fade-up">
        <Link
          href={`/posts?page=${Math.max(1, page - 1)}`}
          className={`text-sm underline underline-offset-4 ${page === 1 ? "pointer-events-none opacity-50" : ""}`}
        >
          {t.prev}
        </Link>
        <span className="text-sm">
          {page} / {totalPages}
        </span>
        <Link
          href={`/posts?page=${Math.min(totalPages, page + 1)}`}
          className={`text-sm underline underline-offset-4 ${page === totalPages ? "pointer-events-none opacity-50" : ""}`}
        >
          {t.next}
        </Link>
      </div>
    </div>
  );
}

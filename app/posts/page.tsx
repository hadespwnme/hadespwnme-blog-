import Link from "next/link";
import { getAllPostsMeta } from "@/lib/posts";
import { getServerLang } from "@/lib/i18n-server";

const PAGE_SIZE = 10;

export default async function PostsPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string }>;
}) {
  const all = getAllPostsMeta();
  const params = await searchParams;
  const page = Math.max(1, Number(params.page ?? "1") || 1);
  const totalPages = Math.max(1, Math.ceil(all.length / PAGE_SIZE));
  const items = all.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);
  const lang = await getServerLang();
  const t = lang === "id"
    ? { title: "Artikel", prev: "Sebelumnya", next: "Berikutnya", words: "kata", minutes: "menit" }
    : { title: "Articles", prev: "Previous", next: "Next", words: "words", minutes: "min" };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold" data-aos="fade-up">{t.title}</h1>
      <ul className="space-y-4">
        {items.map((p, i) => (
          <li key={p.slug} data-aos="fade-up" data-aos-delay={i * 50}>
            <div className="flex flex-col gap-1">
              <Link href={`/posts/${p.slug}`} className="font-medium hover:underline underline-offset-4">
                {p.title}
              </Link>
              <div className="text-xs text-foreground/60">
                {p.date} · {p.words} {t.words} · {p.minutes} {t.minutes}
              </div>
            </div>
          </li>
        ))}
      </ul>
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

import Link from "next/link";
import { getAllPostsMeta } from "@/lib/posts";
import CategoryChip from "@/components/CategoryChip";
import TagChip from "@/components/TagChip";
import { getServerLang } from "@/lib/i18n-server";
import AchievementBadge from "@/components/AchievementBadge";

export default async function CategoryArchive({ params }: { params: Promise<{ name: string }> }) {
  const { name } = await params;
  const decoded = decodeURIComponent(name);
  const lang = await getServerLang();
  const list = getAllPostsMeta(lang).filter((p) => (p.categories ?? []).includes(decoded));
  const title = lang === "id" ? `Kategori: ${decoded}` : `Category: ${decoded}`;
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold" data-aos="fade-up">{title}</h1>
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {list.map((p, i) => (
          <article
            key={p.slug}
            className="relative rounded-lg p-4 border border-black/20 dark:border-white/20 shadow-sm hover:-translate-y-0.5 hover:shadow-md transition dark:ring-1 dark:ring-white/15 dark:shadow-[0_8px_24px_rgba(0,0,0,0.6)]"
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
            <div className="text-xs text-foreground/60 mb-2">{p.date}</div>
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
    </div>
  );
}

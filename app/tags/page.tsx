import Link from "next/link";
import { aggregateTags } from "@/lib/posts";
import { getServerLang } from "@/lib/i18n-server";

export default async function TagsPage() {
  const lang = await getServerLang();
  const data = aggregateTags(lang);
  const t = lang === "id" ? { title: "Tag" } : { title: "Tags" };
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold" data-aos="fade-up">{t.title}</h1>
      <div className="flex flex-wrap gap-2">
        {data.map((t, i) => (
          <Link
            key={t.name}
            href={`/tags/${encodeURIComponent(t.name)}`}
            className="text-sm px-2 py-1 rounded-full border border-black/5 dark:border-white/10 hover:bg-black/5 dark:hover:bg-white/10"
            data-aos="fade-up"
            data-aos-delay={i * 50}
          >
            #{t.name}
            <span className="ml-1 text-xs opacity-70">{t.count}</span>
          </Link>
        ))}
      </div>
    </div>
  );
}

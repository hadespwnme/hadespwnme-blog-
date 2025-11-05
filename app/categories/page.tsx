import Link from "next/link";
import { aggregateCategories } from "@/lib/posts";
import { getServerLang } from "@/lib/i18n-server";

export default async function CategoriesPage() {
  const lang = await getServerLang();
  const data = aggregateCategories(lang);
  const t = lang === "id" ? { title: "Kategori" } : { title: "Categories" };
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold" data-aos="fade-up">{t.title}</h1>
      <ul className="grid sm:grid-cols-2 gap-3">
        {data.map((c, i) => (
          <li
            key={c.name}
            className="rounded-md p-3 flex items-center justify-between border border-black/20 dark:border-white/20 shadow-sm hover:shadow-md transition dark:ring-1 dark:ring-white/15 dark:shadow-[0_8px_24px_rgba(0,0,0,0.6)]"
            data-aos="fade-up"
            data-aos-delay={i * 50}
          >
            <Link href={`/categories/${encodeURIComponent(c.name)}`}>{c.name}</Link>
            <span className="text-xs px-2 py-0.5 rounded-full bg-black/5 dark:bg-white/10">{c.count}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

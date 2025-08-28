import Link from "next/link";
import { getAllPostsMeta } from "@/lib/posts";

export default function TagArchive({ params }: { params: { name: string } }) {
  const name = decodeURIComponent(params.name);
  const list = getAllPostsMeta().filter((p) => (p.tags ?? []).includes(name));
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold" data-aos="fade-up">Tag: {name}</h1>
      <ul className="space-y-3">
        {list.map((p, i) => (
          <li key={p.slug} data-aos="fade-up" data-aos-delay={i * 50}>
            <Link href={`/posts/${p.slug}`} className="underline underline-offset-4">
              {p.title}
            </Link>
            <span className="ml-2 text-xs text-foreground/60">{p.date}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}


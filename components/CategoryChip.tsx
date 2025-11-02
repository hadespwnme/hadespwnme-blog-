import Link from "next/link";

export default function CategoryChip({ label }: { label: string }) {
  return (
    <Link
      href={`/categories/${encodeURIComponent(label)}`}
      className="text-xs px-2 py-0.5 rounded-full bg-black/5 dark:bg-white/10 text-foreground/80 hover:underline underline-offset-4"
      aria-label={`Category: ${label}`}
    >
      {label}
    </Link>
  );
}

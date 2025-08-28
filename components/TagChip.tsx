export default function TagChip({ label }: { label: string }) {
  return (
    <span className="text-xs px-2 py-0.5 rounded-full bg-black/5 dark:bg-white/10 text-foreground/80">
      #{label}
    </span>
  );
}


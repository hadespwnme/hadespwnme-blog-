export default function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className="border-t border-black/5 dark:border-white/10 mt-16" data-aos="fade-up">
      <div className="mx-auto max-w-5xl px-4 py-10 text-sm text-foreground/80 space-y-3">
        <p className="italic text-center">
          hacking is art of exploitation
        </p>
        <p className="text-center">© {year} hadespwn.me</p>
      </div>
    </footer>
  );
}

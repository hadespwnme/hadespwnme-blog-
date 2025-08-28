import Image from "next/image";

export default function AuthorCard() {
  return (
    <div className="flex items-center gap-4 border border-black/20 dark:border-white/20 rounded-lg p-4 shadow-sm hover:shadow-md transition dark:ring-1 dark:ring-white/15 dark:shadow-[0_8px_24px_rgba(0,0,0,0.6)]" data-aos="fade-up">
      <Image
        src="/assets/avatar.jpg"
        alt="Author avatar"
        width={48}
        height={48}
        className="rounded-full"
      />
      <div>
        <div className="font-semibold">HADES</div>
        <div className="text-sm text-foreground/70">
          Security enthusiast. CTF / pentesting / write-ups.
        </div>
      </div>
    </div>
  );
}

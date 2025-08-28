import { getServerLang } from "@/lib/i18n-server";

export default async function LinksPage() {
  const lang = await getServerLang();
  const t =
    lang === "id"
      ? { title: "Tautan", resources: "Sumber Daya Pentesting" }
      : { title: "Links", resources: "Pentesting Resources" };
  return (
    <div className="space-y-8">
      <h1 className="text-2xl font-semibold" data-aos="fade-up">{t.title}</h1>

      <section>
        <h2 className="text-lg font-semibold mb-3" data-aos="fade-up">{t.resources}</h2>
        <ul className="space-y-2">
          {[
            { name: "CrackStation", url: "https://crackstation.net/" },
            { name: "HackTheBox", url: "https://app.hackthebox.com/" },
            { name: "DockerLabs", url: "https://dockerlabs.es/" },
            { name: "GTFOBins", url: "https://gtfobins.github.io/" },
          ].map((l, i) => (
            <li key={l.url} data-aos="fade-up" data-aos-delay={i * 50}>
              <a href={l.url} target="_blank" rel="noreferrer" className="underline underline-offset-4">
                {l.name}
              </a>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}

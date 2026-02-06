import { getTCP1PLeaderboard } from "@/lib/tcp1p";

function formatScore(score: number) {
  return score.toLocaleString(undefined, { maximumFractionDigits: 2 });
}

export default async function TCP1PLeaderboardCard() {
  const rows = await getTCP1PLeaderboard({ limit: 10, offset: 0 });

  return (
    <section className="border border-black/20 dark:border-white rounded-lg p-4 shadow-sm dark:ring-1 dark:ring-white/15 dark:shadow-[0_8px_24px_rgba(0,0,0,0.6)]">
      <div className="flex items-start justify-between gap-3">
        <div>
          <div className="font-semibold leading-tight">TCP1P Member Scoring</div>
          <div className="text-xs text-foreground/60 mt-0.5">
            Source:{" "}
            <a
              className="underline underline-offset-4"
              href="https://scoring.1pc.tf/"
              target="_blank"
              rel="noreferrer"
            >
              scoring.1pc.tf
            </a>
          </div>
        </div>
        <a
          className="text-xs underline underline-offset-4 opacity-70 hover:opacity-100 shrink-0"
          href="https://scoring.1pc.tf/"
          target="_blank"
          rel="noreferrer"
        >
          View
        </a>
      </div>

      {rows.length === 0 ? (
        <div className="text-sm text-foreground/70 mt-3">Unable to load leaderboard.</div>
      ) : (
        <div className="mt-3 overflow-x-auto">
          <table className="w-full text-xs">
            <thead className="text-foreground/70">
              <tr className="border-b border-black/10 dark:border-white/10">
                <th className="py-2 pr-2 text-left font-medium">Rank</th>
                <th className="py-2 pr-2 text-left font-medium">Player</th>
                <th className="py-2 pr-2 text-right font-medium">Score</th>
                <th className="py-2 text-right font-medium">Solves</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((r) => (
                <tr key={`${r.rank}:${r.player}`} className="border-b border-black/5 dark:border-white/10">
                  <td className="py-2 pr-2 tabular-nums">{r.rank}</td>
                  <td className="py-2 pr-2 max-w-[10rem] truncate" title={r.player}>
                    {r.player}
                  </td>
                  <td className="py-2 pr-2 text-right tabular-nums">{formatScore(r.score)}</td>
                  <td className="py-2 text-right tabular-nums">{r.solves.toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
}

export type TCP1PLeaderboardRow = {
  rank: number;
  player: string;
  score: number;
  solves: number;
};

type ScoreboardApiResponse = {
  data?: Array<{
    rank?: number;
    user?: { displayName?: string; username?: string } | null;
    totalScore?: number;
    solveCount?: number;
  }>;
};

function isFiniteNumber(value: unknown): value is number {
  return typeof value === "number" && Number.isFinite(value);
}

export async function getTCP1PLeaderboard({
  limit = 10,
  offset = 0,
}: {
  limit?: number;
  offset?: number;
} = {}): Promise<TCP1PLeaderboardRow[]> {
  const safeLimit = Math.max(1, Math.min(50, Math.trunc(limit)));
  const safeOffset = Math.max(0, Math.trunc(offset));

  const url = new URL("https://api.assistant.1pc.tf/api/scoreboard");
  url.searchParams.set("limit", String(safeLimit));
  url.searchParams.set("offset", String(safeOffset));

  const res = await fetch(url, {
    headers: { accept: "application/json" },
    next: { revalidate: 300 },
  });

  if (!res.ok) return [];

  const json = (await res.json().catch(() => null)) as ScoreboardApiResponse | null;
  const rows = json?.data;
  if (!Array.isArray(rows)) return [];

  return rows
    .map((r) => {
      const rank = r?.rank;
      const player = r?.user?.displayName ?? r?.user?.username ?? "";
      const score = r?.totalScore;
      const solves = r?.solveCount;

      if (!isFiniteNumber(rank) || !player || !isFiniteNumber(score) || !isFiniteNumber(solves)) return null;
      return { rank, player, score, solves } satisfies TCP1PLeaderboardRow;
    })
    .filter((r): r is TCP1PLeaderboardRow => r !== null);
}


import { Medal } from "lucide-react";

type AchievementBadgeProps = {
  achievement?: string | null;
  className?: string;
  variant?: "inline" | "corner";
};

function stylesForAchievement(achievement: string) {
  const a = achievement.trim();
  switch (a) {
    case "1st":
      return {
        label: a,
        border: "border-yellow-700/60 dark:border-yellow-500/40",
        bg: "bg-yellow-300/70 dark:bg-yellow-400/20",
        text: "text-black dark:text-yellow-300",
        icon: "text-yellow-700 dark:text-yellow-300",
      };
    case "2nd":
      return {
        label: a,
        border: "border-slate-500/60 dark:border-slate-500/40",
        bg: "bg-slate-200/80 dark:bg-slate-400/20",
        text: "text-black dark:text-slate-200",
        icon: "text-slate-500 dark:text-slate-200",
      };
    case "3rd":
      return {
        label: a,
        border: "border-amber-700/60 dark:border-amber-700/40",
        bg: "bg-amber-300/70 dark:bg-amber-700/20",
        text: "text-black dark:text-amber-200",
        icon: "text-amber-700 dark:text-amber-200",
      };
    default:
      return {
        label: a,
        border: "border-black/15 dark:border-white/15",
        bg: "bg-black/10 dark:bg-white/10",
        text: "text-black dark:text-foreground",
        icon: "text-foreground/70",
      };
  }
}

export default function AchievementBadge({
  achievement,
  className,
  variant = "inline",
}: AchievementBadgeProps) {
  if (!achievement) return null;
  const trimmed = achievement.trim();
  if (!trimmed) return null;
  const { label, border, bg, text, icon } = stylesForAchievement(trimmed);
  const showMedal = label === "1st" || label === "2nd" || label === "3rd";

  if (variant === "corner") {
    return (
      <span
        className={[
          "pointer-events-none absolute -top-px -right-px h-14 w-14 select-none overflow-hidden rounded-tr-lg z-10",
          className,
        ]
          .filter(Boolean)
          .join(" ")}
        title={label}
      >
        <span
          className={[
            "absolute inset-0 [clip-path:polygon(0_0,100%_0,100%_100%)] backdrop-blur-sm",
            bg,
            "shadow-[inset_0_0_0_1px_rgba(0,0,0,0.2)] dark:shadow-[inset_0_0_0_1px_rgba(255,255,255,0.2)]",
          ].join(" ")}
        />
        <span
          className={[
            "absolute top-2.5 right-2.5 text-[12px] font-semibold leading-none",
            text,
          ].join(" ")}
        >
          {label}
        </span>
      </span>
    );
  }

  return (
    <span
      className={[
        "inline-flex items-center gap-1.5 rounded-lg border px-2.5 py-1.5 text-[13px] font-semibold leading-none backdrop-blur-sm",
        border,
        bg,
        text,
        className,
      ]
        .filter(Boolean)
        .join(" ")}
      title={label}
    >
      {showMedal ? <Medal className={["h-4 w-4", icon].join(" ")} aria-hidden="true" /> : null}
      {label}
    </span>
  );
}

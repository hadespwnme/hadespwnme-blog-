import { cookies } from "next/headers";

export type Lang = "id" | "en";

export async function getServerLang(): Promise<Lang> {
  const v = (await cookies()).get("lang")?.value as Lang | undefined;
  return v === "en" || v === "id" ? v : "en";
}

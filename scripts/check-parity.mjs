#!/usr/bin/env node
import fs from "node:fs";
import path from "node:path";

const POSTS_DIR = path.join(process.cwd(), "content", "posts");
const LANG_DIR = {
  id: path.join(POSTS_DIR, "id"),
  en: path.join(POSTS_DIR, "en"),
};

function listMdx(dir) {
  if (!fs.existsSync(dir)) return [];
  return fs.readdirSync(dir).filter((f) => f.endsWith(".mdx"));
}

function listPairs() {
  const pairs = new Map();

  // Preferred: content/posts/{id,en}/{slug}.mdx
  for (const lang of ["id", "en"]) {
    const dir = LANG_DIR[lang];
    for (const f of listMdx(dir)) {
      const base = f.replace(/\.mdx$/, "");
      if (!pairs.has(base)) pairs.set(base, {});
      pairs.get(base)[lang] = path.join(dir, f);
    }
  }

  // Legacy: content/posts/{slug}.{id,en}.mdx
  for (const f of listMdx(POSTS_DIR)) {
    const m = f.match(/^(.*)\.(id|en)\.mdx$/);
    if (!m) continue;
    const base = m[1];
    const lang = m[2];
    if (!pairs.has(base)) pairs.set(base, {});
    pairs.get(base)[lang] = path.join(POSTS_DIR, f);
  }

  return pairs;
}

function stripFrontmatter(text) {
  const lines = text.split(/\r?\n/);
  if (lines[0] === "---") {
    const end = lines.indexOf("---", 1);
    if (end !== -1) {
      return lines.slice(end + 1).join("\n");
    }
  }
  return text;
}

function statsOf(filePath) {
  const raw = fs.readFileSync(filePath, "utf8");
  const body = stripFrontmatter(raw);
  const lines = body.split(/\r?\n/);
  let headings = 0;
  let codeFence = 0;
  let paragraphs = 0;
  for (const l of lines) {
    const s = l.trim();
    if (!s) continue;
    if (s.startsWith("```")) {
      codeFence++;
      continue;
    }
    if (s.startsWith("#")) {
      headings++;
      continue;
    }
    if (!s.startsWith(">") && !s.startsWith("<center>") && !s.startsWith("</center>")) {
      paragraphs++;
    }
  }
  return { headings, codeFences: codeFence, paragraphs };
}

function report() {
  const pairs = listPairs();
  const rows = [];
  for (const [base, langs] of pairs.entries()) {
    if (!langs.id || !langs.en) continue;
    const idPath = langs.id;
    const enPath = langs.en;
    const id = statsOf(idPath);
    const en = statsOf(enPath);
    const diff = {
      headings: en.headings - id.headings,
      codeFences: en.codeFences - id.codeFences,
      paragraphs: en.paragraphs - id.paragraphs,
    };
    rows.push({ base, id, en, diff });
  }
  rows.sort((a, b) => a.base.localeCompare(b.base));
  let issues = 0;
  console.log("Slug".padEnd(28), "Head(id/en)", "Code(id/en)", "Para(id/en)", "Δhead", "Δcode", "Δpara");
  for (const r of rows) {
    const h = `${r.id.headings}/${r.en.headings}`.padEnd(10);
    const c = `${r.id.codeFences}/${r.en.codeFences}`.padEnd(11);
    const p = `${r.id.paragraphs}/${r.en.paragraphs}`.padEnd(12);
    const dh = String(r.diff.headings).padStart(5);
    const dc = String(r.diff.codeFences).padStart(6);
    const dp = String(r.diff.paragraphs).padStart(6);
    const flag = (r.diff.headings !== 0 || r.diff.codeFences !== 0 || r.diff.paragraphs !== 0);
    if (flag) issues++;
    console.log(r.base.padEnd(28), h, c, p, dh, dc, dp, flag ? "  !" : "");
  }
  if (issues > 0) {
    console.log(`\nFound ${issues} post(s) with structural mismatches. English posts should be direct translations only.`);
    process.exitCode = 1;
  } else {
    console.log("\nAll posts structurally match.");
  }
}

report();

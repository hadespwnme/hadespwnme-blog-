import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";
import readingTime from "reading-time";
import { compileMDX } from "next-mdx-remote/rsc";
import CodeBlock from "@/components/CodeBlock";
import { Highlighter } from "@/components/ui/highlighter";
import remarkGfm from "remark-gfm";
import rehypeSlug from "rehype-slug";
import rehypeAutolinkHeadings from "rehype-autolink-headings";
import React from "react";
import type { Lang } from "@/lib/i18n-server";

export type PostFrontmatter = {
  title: string;
  date: string;
  categories?: string[];
  tags?: string[];
  cover?: string;
  achievement?: string;
  achievment?: string;
};

export type PostMeta = PostFrontmatter & {
  slug: string;
  words: number;
  minutes: number;
};

const POSTS_DIR = path.join(process.cwd(), "content", "posts");

type PostLang = Lang | undefined;

function parsePostPath(filePath: string): { base: string; lang: PostLang } | null {
  if (!filePath.endsWith(".mdx")) return null;

  const rel = path.relative(POSTS_DIR, filePath);
  const parts = rel.split(path.sep).filter(Boolean);
  if (parts.length === 2 && (parts[0] === "id" || parts[0] === "en")) {
    return { base: parts[1].replace(/\.mdx$/, ""), lang: parts[0] as Lang };
  }

  const file = parts.at(-1) ?? path.basename(filePath);
  const m = file.match(/^(.*)\.(id|en)\.mdx$/);
  if (m) return { base: m[1], lang: m[2] as Lang };
  return { base: file.replace(/\.mdx$/, ""), lang: undefined };
}

function listMdxFilesIn(dir: string): string[] {
  if (!fs.existsSync(dir)) return [];
  return fs
    .readdirSync(dir)
    .filter((f) => f.endsWith(".mdx"))
    .map((f) => path.join(dir, f));
}

function listPostFiles(): string[] {
  return [
    ...listMdxFilesIn(POSTS_DIR),
    ...listMdxFilesIn(path.join(POSTS_DIR, "id")),
    ...listMdxFilesIn(path.join(POSTS_DIR, "en")),
  ];
}

function getAllBaseSlugs(): string[] {
  const files = listPostFiles();
  const set = new Set<string>();
  for (const f of files) {
    const info = parsePostPath(f);
    if (info) set.add(info.base);
  }
  return Array.from(set);
}

function resolveFileFor(slug: string, preferred?: Lang): string | null {
  if (preferred) {
    const p = path.join(POSTS_DIR, preferred, `${slug}.mdx`);
    if (fs.existsSync(p)) return p;
    const pLegacy = path.join(POSTS_DIR, `${slug}.${preferred}.mdx`);
    if (fs.existsSync(pLegacy)) return pLegacy;
  }
  const legacy = path.join(POSTS_DIR, `${slug}.mdx`);
  if (fs.existsSync(legacy)) return legacy;
  const alt: Lang = preferred === "id" ? "en" : "id";
  const p2 = path.join(POSTS_DIR, alt, `${slug}.mdx`);
  if (fs.existsSync(p2)) return p2;
  const p2Legacy = path.join(POSTS_DIR, `${slug}.${alt}.mdx`);
  if (fs.existsSync(p2Legacy)) return p2Legacy;
  for (const lang of ["id", "en"] as Lang[]) {
    const p3 = path.join(POSTS_DIR, lang, `${slug}.mdx`);
    if (fs.existsSync(p3)) return p3;
    const p3Legacy = path.join(POSTS_DIR, `${slug}.${lang}.mdx`);
    if (fs.existsSync(p3Legacy)) return p3Legacy;
  }
  return null;
}

function normalizeDate(input: unknown): string {
  if (typeof input === "number") {
    return new Date(input).toISOString().slice(0, 10);
  }
  if (typeof input === "string") {
    return input.length >= 10 ? input.slice(0, 10) : input;
  }
  if (typeof input === "object" && input instanceof Date) {
    return input.toISOString().slice(0, 10);
  }
  return "";
}

export function getAllSlugs(): string[] {
  return getAllBaseSlugs();
}

export function getAllPostsMeta(lang?: Lang): PostMeta[] {
  const slugs = getAllBaseSlugs();
  const metas = slugs
    .map((slug) => getPostMeta(slug, lang))
    .filter(Boolean) as PostMeta[];
  return metas.sort((a, b) => (a.date < b.date ? 1 : -1));
}

export function getPostMeta(slug: string, lang?: Lang): PostMeta | null {
  const file = resolveFileFor(slug, lang);
  if (!file) return null;
  const raw = fs.readFileSync(file, "utf8");
  const { data, content } = matter(raw);
  const words = content.trim().split(/\s+/).length;
  const stats = readingTime(content);
  const fm = data as PostFrontmatter & { date: string | Date | number };
  const dateStr = normalizeDate(fm.date);
  return {
    ...fm,
    date: dateStr ?? String(fm.date ?? ""),
    slug,
    words,
    minutes: Math.max(1, Math.round(stats.minutes)),
  };
}

export async function getPost(slug: string, lang?: Lang) {
  const file = resolveFileFor(slug, lang);
  if (!file) return null;
  const source = fs.readFileSync(file, "utf8");
  const Pre: React.FC<React.HTMLAttributes<HTMLPreElement>> = (props) =>
    React.createElement(CodeBlock, null, props.children);
  const Strong: React.FC<{ children?: React.ReactNode }> = ({ children }) =>
    React.createElement(
      Highlighter,
      { action: "highlight", color: "#87CEFA", padding: 4 },
      React.createElement("span", { style: { fontWeight: "inherit" } }, children),
    );
  const Code: React.FC<React.ComponentPropsWithoutRef<"code">> = ({ className, ...props }) => {
    const children = props.children;
    const childText =
      typeof children === "string"
        ? children
        : Array.isArray(children) && children.every((c) => typeof c === "string")
          ? children.join("")
          : "";
    const isBlock =
      (typeof className === "string" && /(?:^|\\s)language-/.test(className)) || childText.includes("\n");
    const codeEl = React.createElement("code", { className, ...props });
    if (isBlock) return codeEl;
    return React.createElement(Highlighter, { action: "underline" }, codeEl);
  };
  const { content, frontmatter } = await compileMDX<PostFrontmatter>({
    source,
    components: {
      pre: Pre,
      strong: Strong,
      code: Code,
    },
    options: {
      parseFrontmatter: true,
      mdxOptions: {
        remarkPlugins: [remarkGfm],
        rehypePlugins: [rehypeSlug, [rehypeAutolinkHeadings, { behavior: "wrap" }]],
      },
    },
  });

  const words = source.split(/\s+/).length;
  const stats = readingTime(source);

  const meta: PostMeta = {
    ...frontmatter,
    date: normalizeDate(frontmatter.date as unknown),
    slug,
    words,
    minutes: Math.max(1, Math.round(stats.minutes)),
  };

  return { content, meta };
}

export function aggregateCategories(lang?: Lang) {
  const map = new Map<string, number>();
  for (const meta of getAllPostsMeta(lang)) {
    for (const c of meta.categories ?? []) {
      map.set(c, (map.get(c) ?? 0) + 1);
    }
  }
  return Array.from(map.entries())
    .map(([name, count]) => ({ name, count }))
    .sort((a, b) => a.name.localeCompare(b.name));
}

export function aggregateTags(lang?: Lang) {
  const map = new Map<string, number>();
  for (const meta of getAllPostsMeta(lang)) {
    for (const t of meta.tags ?? []) {
      map.set(t, (map.get(t) ?? 0) + 1);
    }
  }
  return Array.from(map.entries())
    .map(([name, count]) => ({ name, count }))
    .sort((a, b) => a.name.localeCompare(b.name));
}

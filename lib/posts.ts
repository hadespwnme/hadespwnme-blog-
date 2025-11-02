import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";
import readingTime from "reading-time";
import { compileMDX } from "next-mdx-remote/rsc";
import CodeBlock from "@/components/CodeBlock";
import remarkGfm from "remark-gfm";
import rehypeSlug from "rehype-slug";
import rehypeAutolinkHeadings from "rehype-autolink-headings";
import React from "react";

export type PostFrontmatter = {
  title: string;
  date: string;
  categories?: string[];
  tags?: string[];
  cover?: string;
};

export type PostMeta = PostFrontmatter & {
  slug: string;
  words: number;
  minutes: number;
};

const POSTS_DIR = path.join(process.cwd(), "content", "posts");

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
  if (!fs.existsSync(POSTS_DIR)) return [];
  return fs
    .readdirSync(POSTS_DIR)
    .filter((f) => f.endsWith(".mdx"))
    .map((f) => f.replace(/\.mdx$/, ""));
}

export function getAllPostsMeta(): PostMeta[] {
  const slugs = getAllSlugs();
  const metas = slugs.map((slug) => getPostMeta(slug)).filter(Boolean) as PostMeta[];
  return metas.sort((a, b) => (a.date < b.date ? 1 : -1));
}

export function getPostMeta(slug: string): PostMeta | null {
  const file = path.join(POSTS_DIR, `${slug}.mdx`);
  if (!fs.existsSync(file)) return null;
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

export async function getPost(slug: string) {
  const file = path.join(POSTS_DIR, `${slug}.mdx`);
  if (!fs.existsSync(file)) return null;
  const source = fs.readFileSync(file, "utf8");
  const Pre: React.FC<React.HTMLAttributes<HTMLPreElement>> = (props) =>
    React.createElement(CodeBlock, null, props.children);
  const { content, frontmatter } = await compileMDX<PostFrontmatter>({
    source,
    components: {
      pre: Pre,
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

export function aggregateCategories() {
  const map = new Map<string, number>();
  for (const meta of getAllPostsMeta()) {
    for (const c of meta.categories ?? []) {
      map.set(c, (map.get(c) ?? 0) + 1);
    }
  }
  return Array.from(map.entries())
    .map(([name, count]) => ({ name, count }))
    .sort((a, b) => a.name.localeCompare(b.name));
}

export function aggregateTags() {
  const map = new Map<string, number>();
  for (const meta of getAllPostsMeta()) {
    for (const t of meta.tags ?? []) {
      map.set(t, (map.get(t) ?? 0) + 1);
    }
  }
  return Array.from(map.entries())
    .map(([name, count]) => ({ name, count }))
    .sort((a, b) => a.name.localeCompare(b.name));
}

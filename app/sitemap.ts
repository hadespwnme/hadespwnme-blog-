import { getAllPostsMeta } from "@/lib/posts";

export default function sitemap() {
  const base = "https://hadespwn.me";
  const staticRoutes = ["", "/posts", "/categories", "/tags", "/links", "/about"].map((p) => ({
    url: base + p,
    lastModified: new Date().toISOString(),
  }));
  const posts = getAllPostsMeta().map((p) => ({
    url: `${base}/posts/${p.slug}`,
    lastModified: p.date,
  }));
  return [...staticRoutes, ...posts];
}

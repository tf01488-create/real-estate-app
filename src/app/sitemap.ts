import type { MetadataRoute } from "next";
import { articles } from "@/data/articles";

const BASE_URL = "https://fudousanunyou-toushi-simulators.kawaguchi-tetsuya-tax.com";

export default function sitemap(): MetadataRoute.Sitemap {
  const articleEntries: MetadataRoute.Sitemap = articles.map((article) => ({
    url: `${BASE_URL}/articles/${article.slug}`,
    lastModified: new Date(article.date),
    changeFrequency: "monthly",
    priority: 0.7,
  }));

  return [
    {
      url: BASE_URL,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 1.0,
    },
    {
      url: `${BASE_URL}/articles`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.8,
    },
    {
      url: `${BASE_URL}/privacy-policy`,
      lastModified: new Date("2026-05-13"),
      changeFrequency: "yearly",
      priority: 0.3,
    },
    ...articleEntries,
  ];
}

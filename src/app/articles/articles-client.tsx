"use client";

import Link from "next/link";
import Image from "next/image";
import { BookOpen, ChevronRight } from "lucide-react";
import { useState, useMemo } from "react";
import type { Article, ArticleCategory } from "@/data/articles";

const CATEGORIES: ArticleCategory[] = [
  "融資・ローン",
  "税金・節税",
  "物件評価・購入",
  "売却・出口戦略",
  "運用・管理",
];

export function ArticlesClient({ articles }: { articles: Article[] }) {
  const [selectedCategory, setSelectedCategory] = useState<ArticleCategory | null>(null);

  const filtered = useMemo(() => {
    return [...articles]
      .filter((a) => !selectedCategory || a.category === selectedCategory)
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }, [articles, selectedCategory]);

  return (
    <>
      <div className="mb-6">
        <div className="flex items-center gap-2 mb-4">
          <BookOpen className="w-5 h-5 text-blue-500" />
          <span className="text-sm text-gray-600">{filtered.length}件の記事</span>
        </div>

        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setSelectedCategory(null)}
            className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
              selectedCategory === null
                ? "bg-blue-600 text-white"
                : "bg-white border border-gray-300 text-gray-700 hover:border-blue-400"
            }`}
          >
            すべて
          </button>
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
                selectedCategory === cat
                  ? "bg-blue-600 text-white"
                  : "bg-white border border-gray-300 text-gray-700 hover:border-blue-400"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      <div className="flex flex-col gap-4">
        {filtered.map((article) => (
          <Link
            key={article.slug}
            href={`/articles/${article.slug}`}
            className="group bg-white border border-gray-200 rounded-xl overflow-hidden hover:border-blue-400 hover:shadow-md transition-all flex flex-col sm:flex-row"
          >
            {article.image && (
              <div className="relative w-full sm:w-48 h-36 sm:h-36 shrink-0 bg-gray-100 flex items-center justify-center">
                <Image
                  src={article.image}
                  alt={article.title}
                  fill
                  className="object-contain"
                  sizes="(max-width: 640px) 100vw, 192px"
                />
              </div>
            )}
            <div className="flex-1 min-w-0 p-5 flex items-start justify-between gap-4">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1.5">
                  <p className="text-xs text-gray-400">{article.date}</p>
                  <span className="inline-block px-2 py-0.5 bg-blue-100 text-blue-700 text-xs font-semibold rounded">
                    {article.category}
                  </span>
                </div>
                <h2 className="text-base font-semibold text-gray-900 group-hover:text-blue-600 transition-colors leading-snug mb-2">
                  {article.title}
                </h2>
                <p className="text-sm text-gray-500 leading-relaxed line-clamp-2">
                  {article.excerpt}
                </p>
              </div>
              <ChevronRight className="w-5 h-5 text-gray-300 group-hover:text-blue-500 shrink-0 mt-1 transition-colors" />
            </div>
          </Link>
        ))}
      </div>
    </>
  );
}

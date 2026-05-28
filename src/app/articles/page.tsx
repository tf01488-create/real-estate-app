import Link from "next/link";
import Image from "next/image";
import { articles } from "@/data/articles";
import { Building2, BookOpen, ChevronRight } from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "不動産投資コラム | 不動産投資　簡易シミュレーション",
  description: "不動産投資に役立つ記事を日々更新しています。",
};

export default function ArticlesPage() {
  const sorted = [...articles].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-blue-600 border-b border-blue-700 px-6 py-4">
        <div className="max-w-4xl mx-auto flex items-center gap-3">
          <Link href="/" className="p-2 bg-white/20 rounded-lg hover:bg-white/30 transition-colors">
            <Building2 className="w-5 h-5 text-white" />
          </Link>
          <div className="flex-1">
            <h1 className="text-lg font-bold text-white">不動産投資コラム</h1>
            <p className="text-xs text-blue-100">投資判断に役立つ記事を日々更新</p>
          </div>
          <Link
            href="/"
            className="text-xs text-blue-100 hover:text-white border border-blue-400 hover:border-white px-3 py-1.5 rounded-lg transition-colors"
          >
            シミュレーターへ →
          </Link>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-8">
        <div className="flex items-center gap-2 mb-6">
          <BookOpen className="w-5 h-5 text-blue-500" />
          <span className="text-sm text-gray-600">{sorted.length}件の記事</span>
        </div>

        <div className="flex flex-col gap-4">
          {sorted.map((article) => (
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
                  <p className="text-xs text-gray-400 mb-1.5">{article.date}</p>
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

        <footer className="mt-10 border-t border-gray-200 pt-6 flex flex-wrap gap-4 text-xs text-gray-500">
          <Link href="/" className="hover:text-gray-800 transition-colors">トップ</Link>
          <Link href="/about" className="hover:text-gray-800 transition-colors">運営者情報</Link>
          <Link href="/contact" className="hover:text-gray-800 transition-colors">お問い合わせ</Link>
          <Link href="/privacy-policy" className="hover:text-gray-800 transition-colors">プライバシーポリシー</Link>
        </footer>
      </main>
    </div>
  );
}

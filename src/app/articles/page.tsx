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
    <div className="min-h-screen bg-slate-900">
      <header className="bg-blue-950 border-b border-blue-800 px-6 py-4">
        <div className="max-w-4xl mx-auto flex items-center gap-3">
          <Link href="/" className="p-2 bg-blue-500 rounded-lg hover:bg-blue-400 transition-colors">
            <Building2 className="w-5 h-5 text-white" />
          </Link>
          <div className="flex-1">
            <h1 className="text-lg font-bold text-white">不動産投資コラム</h1>
            <p className="text-xs text-blue-300">投資判断に役立つ記事を日々更新</p>
          </div>
          <Link
            href="/"
            className="text-xs text-blue-300 hover:text-blue-100 border border-blue-700 hover:border-blue-500 px-3 py-1.5 rounded-lg transition-colors"
          >
            シミュレーターへ →
          </Link>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-8">
        <div className="flex items-center gap-2 mb-6">
          <BookOpen className="w-5 h-5 text-blue-400" />
          <span className="text-sm text-blue-300">{sorted.length}件の記事</span>
        </div>

        <div className="flex flex-col gap-4">
          {sorted.map((article) => (
            <Link
              key={article.slug}
              href={`/articles/${article.slug}`}
              className="group bg-blue-950 border border-blue-800 rounded-xl overflow-hidden hover:border-blue-500 hover:bg-blue-900/60 transition-all flex flex-col sm:flex-row"
            >
              <div className="relative w-full sm:w-48 h-36 sm:h-auto shrink-0 bg-blue-900">
                <Image
                  src={`/images/articles/${article.slug}.jpg`}
                  alt={article.title}
                  fill
                  className="object-cover"
                  sizes="(max-width: 640px) 100vw, 192px"
                />
              </div>
              <div className="flex-1 min-w-0 p-5 flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <p className="text-xs text-blue-400 mb-1.5">{article.date}</p>
                  <h2 className="text-base font-semibold text-white group-hover:text-blue-200 transition-colors leading-snug mb-2">
                    {article.title}
                  </h2>
                  <p className="text-sm text-blue-300 leading-relaxed line-clamp-2">
                    {article.excerpt}
                  </p>
                </div>
                <ChevronRight className="w-5 h-5 text-blue-600 group-hover:text-blue-400 shrink-0 mt-1 transition-colors" />
              </div>
            </Link>
          ))}
        </div>

        <footer className="mt-10 border-t border-blue-900 pt-6 flex flex-wrap gap-4 text-xs text-blue-500">
          <Link href="/" className="hover:text-blue-300 transition-colors">トップ</Link>
          <Link href="/about" className="hover:text-blue-300 transition-colors">運営者情報</Link>
          <Link href="/contact" className="hover:text-blue-300 transition-colors">お問い合わせ</Link>
          <Link href="/privacy-policy" className="hover:text-blue-300 transition-colors">プライバシーポリシー</Link>
        </footer>
      </main>
    </div>
  );
}

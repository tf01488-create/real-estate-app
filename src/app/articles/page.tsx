import Link from "next/link";
import { articles } from "@/data/articles";
import { Building2 } from "lucide-react";
import type { Metadata } from "next";
import { ArticlesClient } from "./articles-client";

export const metadata: Metadata = {
  title: "不動産投資コラム | 不動産投資　簡易シミュレーション",
  description: "不動産投資に役立つ記事を日々更新しています。",
  alternates: {
    canonical: "/articles",
  },
};

export default function ArticlesPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-blue-600 border-b border-blue-700 px-6 py-4">
        <div className="max-w-4xl mx-auto flex items-center gap-3">
          <Link href="/" className="p-2 bg-white/20 rounded-lg hover:bg-white/30 transition-colors">
            <Building2 className="w-5 h-5 text-white" />
          </Link>
          <div className="flex-1 min-w-0">
            <h1 className="text-lg font-bold text-white truncate">不動産投資コラム</h1>
            <p className="text-xs text-blue-100 truncate">投資判断に役立つ記事を日々更新</p>
          </div>
          <Link
            href="/"
            className="hidden sm:inline-block text-xs text-blue-100 hover:text-white border border-blue-400 hover:border-white px-3 py-1.5 rounded-lg transition-colors whitespace-nowrap"
          >
            投資シミュレーター
          </Link>
          <Link
            href="/income-simulator"
            className="hidden sm:inline-block text-xs text-blue-100 hover:text-white border border-blue-400 hover:border-white px-3 py-1.5 rounded-lg transition-colors whitespace-nowrap"
          >
            所得シミュレーター
          </Link>
          <a
            href="https://lin.ee/QY17l0C"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 bg-green-500 hover:bg-green-400 text-white text-xs font-bold px-3 py-1.5 rounded-lg transition-colors whitespace-nowrap"
          >
            <svg viewBox="0 0 24 24" className="w-4 h-4 shrink-0" fill="currentColor">
              <path d="M12 2C6.48 2 2 6.03 2 11c0 3.19 1.73 6.01 4.38 7.77-.19.71-.69 2.58-.79 2.98-.12.5.18.49.38.36.16-.11 2.06-1.39 2.9-1.96.69.1 1.4.15 2.13.15 5.52 0 10-4.03 10-9S17.52 2 12 2zm-4 12.5H6.5V9H8v5.5zm1.5 0V9H11v3.75L13.25 9H15v5.5h-1.5V10.75L11.25 14.5H9.5zm8 0H16v-2.25L13.75 14.5H12v-5.5h1.5v3.75L15.75 9H18v5.5z"/>
            </svg>
            LINE相談
          </a>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-8">
        <ArticlesClient articles={articles} />

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

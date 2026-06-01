import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { articles, getArticleBySlug } from "@/data/articles";
import { Building2, ChevronLeft } from "lucide-react";
import type { Metadata } from "next";

type Props = { params: Promise<{ slug: string }> };

export async function generateStaticParams() {
  return articles.map((a) => ({ slug: a.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const article = getArticleBySlug(slug);
  if (!article) return {};
  return {
    title: `${article.title} | 不動産投資　簡易シミュレーション`,
    description: article.excerpt,
    ...(article.keywords ? { keywords: article.keywords } : {}),
  };
}

const BASE_URL = "https://fudousanunyou-toushi-simulators.kawaguchi-tetsuya-tax.com";

export default async function ArticlePage({ params }: Props) {
  const { slug } = await params;
  const article = getArticleBySlug(slug);
  if (!article) notFound();

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Article",
        "headline": article.title,
        "description": article.excerpt,
        "datePublished": article.date,
        "dateModified": article.date,
        "author": {
          "@type": "Organization",
          "name": "川口哲也税理士事務所",
          "url": BASE_URL,
        },
        "publisher": {
          "@type": "Organization",
          "name": "川口哲也税理士事務所",
          "url": BASE_URL,
        },
        "url": `${BASE_URL}/articles/${article.slug}`,
        "mainEntityOfPage": `${BASE_URL}/articles/${article.slug}`,
      },
      {
        "@type": "BreadcrumbList",
        "itemListElement": [
          { "@type": "ListItem", "position": 1, "name": "トップ", "item": BASE_URL },
          { "@type": "ListItem", "position": 2, "name": "コラム記事一覧", "item": `${BASE_URL}/articles` },
          { "@type": "ListItem", "position": 3, "name": article.title, "item": `${BASE_URL}/articles/${article.slug}` },
        ],
      },
    ],
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <header className="bg-blue-600 border-b border-blue-700 px-6 py-4">
        <div className="max-w-4xl mx-auto flex items-center gap-3">
          <Link href="/" className="p-2 bg-white/20 rounded-lg hover:bg-white/30 transition-colors">
            <Building2 className="w-5 h-5 text-white" />
          </Link>
          <div className="flex-1">
            <h1 className="text-lg font-bold text-white">不動産投資コラム</h1>
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
        <Link
          href="/articles"
          className="inline-flex items-center gap-1 text-sm text-blue-600 hover:text-blue-800 mb-6 transition-colors"
        >
          <ChevronLeft className="w-4 h-4" />
          記事一覧に戻る
        </Link>

        <article className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm">
          {article.image && (
            <Image
              src={article.image}
              alt={article.title}
              width={1200}
              height={630}
              className="w-full h-auto"
              priority
              sizes="(max-width: 896px) 100vw, 896px"
            />
          )}
          <div className="p-6 sm:p-8">
            <p className="text-xs text-gray-400 mb-3">{article.date}</p>
            <h2 className="text-xl sm:text-2xl font-bold text-gray-900 leading-snug mb-6">
              {article.title}
            </h2>
            <p className="text-sm text-gray-600 border-l-2 border-blue-500 pl-4 mb-8 leading-relaxed">
              {article.excerpt}
            </p>

            <div className="space-y-5">
              {article.content.map((paragraph, i) => (
                <p key={i} className="text-sm text-gray-700 leading-relaxed whitespace-pre-line">
                  {paragraph.split(/\*\*(.*?)\*\*/g).map((part, j) =>
                    j % 2 === 1 ? (
                      <strong key={j} className="font-bold text-blue-700">{part}</strong>
                    ) : (
                      part
                    )
                  )}
                </p>
              ))}
            </div>
          </div>
        </article>

        <div className="mt-8 bg-blue-50 border border-blue-200 rounded-xl p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <p className="text-sm font-semibold text-gray-800 mb-1">実際にシミュレーションしてみよう</p>
            <p className="text-xs text-gray-500">物件価格・ローン・家賃を入力して、35年分の収支を無料で試算できます。</p>
          </div>
          <Link
            href="/"
            className="shrink-0 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium px-5 py-2.5 rounded-lg transition-colors"
          >
            シミュレーターを使う →
          </Link>
        </div>

        {/* LINE CTA */}
        <a
          href="https://lin.ee/QY17l0C"
          target="_blank"
          rel="noopener noreferrer"
          className="mt-6 flex flex-col sm:flex-row items-center justify-between gap-4 bg-green-500 hover:bg-green-600 transition-colors rounded-xl px-6 py-5 shadow-sm"
        >
          <div className="flex items-center gap-4">
            <div className="bg-white rounded-xl p-2.5 shrink-0">
              <svg viewBox="0 0 24 24" className="w-8 h-8" fill="#06C755">
                <path d="M12 2C6.48 2 2 6.03 2 11c0 3.19 1.73 6.01 4.38 7.77-.19.71-.69 2.58-.79 2.98-.12.5.18.49.38.36.16-.11 2.06-1.39 2.9-1.96.69.1 1.4.15 2.13.15 5.52 0 10-4.03 10-9S17.52 2 12 2zm-4 12.5H6.5V9H8v5.5zm1.5 0V9H11v3.75L13.25 9H15v5.5h-1.5V10.75L11.25 14.5H9.5zm8 0H16v-2.25L13.75 14.5H12v-5.5h1.5v3.75L15.75 9H18v5.5z"/>
              </svg>
            </div>
            <div>
              <p className="text-white font-bold text-base leading-snug">この記事の内容、税理士に相談してみませんか？</p>
              <p className="text-green-100 text-sm mt-0.5">川口哲也税理士事務所の公式LINEから無料でご相談いただけます</p>
            </div>
          </div>
          <div className="shrink-0 bg-white text-green-600 font-bold text-sm px-5 py-2.5 rounded-lg whitespace-nowrap">
            LINEで無料相談 →
          </div>
        </a>

        <footer className="mt-8 flex flex-wrap gap-4 text-xs text-gray-500">
          <Link href="/" className="hover:text-gray-800 transition-colors">トップ</Link>
          <Link href="/articles" className="hover:text-gray-800 transition-colors">コラム記事一覧</Link>
          <Link href="/about" className="hover:text-gray-800 transition-colors">運営者情報</Link>
          <Link href="/contact" className="hover:text-gray-800 transition-colors">お問い合わせ</Link>
          <Link href="/privacy-policy" className="hover:text-gray-800 transition-colors">プライバシーポリシー</Link>
        </footer>
      </main>
    </div>
  );
}

import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { articles, getArticleBySlug, getRelatedArticles } from "@/data/articles";
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
    alternates: {
      canonical: `/articles/${slug}`,
    },
  };
}

const BASE_URL = "https://fudousanunyou-toushi-simulators.kawaguchi-tetsuya-tax.com";

export default async function ArticlePage({ params }: Props) {
  const { slug } = await params;
  const article = getArticleBySlug(slug);
  if (!article) notFound();
  const related = getRelatedArticles(slug);

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
            className="text-xs text-blue-100 hover:text-white border border-blue-400 hover:border-white px-3 py-1.5 rounded-lg transition-colors whitespace-nowrap"
          >
            収支シミュレーター
          </Link>
          <Link
            href="/income-simulator"
            className="text-xs text-blue-100 hover:text-white border border-blue-400 hover:border-white px-3 py-1.5 rounded-lg transition-colors whitespace-nowrap"
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
            <div className="flex items-center gap-2 mb-3">
              <p className="text-xs text-gray-400">{article.date}</p>
              <span className="inline-block px-2 py-0.5 bg-blue-100 text-blue-700 text-xs font-semibold rounded">
                {article.category}
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-gray-900 leading-snug mb-6">
              {article.title}
            </h2>
            <p className="text-sm text-gray-600 border-l-2 border-blue-500 pl-4 mb-8 leading-relaxed">
              {article.excerpt}
            </p>

            <div className="space-y-5">
              {article.content.flatMap((paragraph, i) => {
                const renderBold = (text: string, key: string) => (
                  <p key={key} className="text-sm text-gray-700 leading-relaxed whitespace-pre-line">
                    {text.split(/\*\*(.*?)\*\*/g).map((part, j) =>
                      j % 2 === 1 ? (
                        <strong key={j} className="font-bold text-blue-700">{part}</strong>
                      ) : (part)
                    )}
                  </p>
                );
                if (paragraph.startsWith("## ")) {
                  const nl = paragraph.indexOf("\n");
                  const heading = nl >= 0 ? paragraph.slice(3, nl) : paragraph.slice(3);
                  const body = nl >= 0 ? paragraph.slice(nl + 1).trim() : "";
                  return [
                    <h2 key={`${i}-h`} className="text-base sm:text-lg font-bold text-gray-900 mt-8 mb-1 pt-6 border-t border-gray-200">{heading}</h2>,
                    ...(body ? [renderBold(body, `${i}-p`)] : []),
                  ];
                }
                if (paragraph.startsWith("### ")) {
                  const nl = paragraph.indexOf("\n");
                  const heading = nl >= 0 ? paragraph.slice(4, nl) : paragraph.slice(4);
                  const body = nl >= 0 ? paragraph.slice(nl + 1).trim() : "";
                  return [
                    <h3 key={`${i}-h`} className="text-sm sm:text-base font-bold text-gray-800 mt-5 mb-1">{heading}</h3>,
                    ...(body ? [renderBold(body, `${i}-p`)] : []),
                  ];
                }
                return [renderBold(paragraph, `${i}`)];
              })}
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

        {article.category === "税金・節税" && (
          <div className="mt-4 bg-emerald-50 border border-emerald-200 rounded-xl p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <p className="text-sm font-semibold text-gray-800 mb-1">不動産所得・税額も計算してみよう</p>
              <p className="text-xs text-gray-500">家賃収入・経費・減価償却費を入力すると、不動産所得や所得税・住民税の概算額を自動計算できます。</p>
            </div>
            <Link
              href="/income-simulator"
              className="shrink-0 bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-medium px-5 py-2.5 rounded-lg transition-colors"
            >
              所得シミュレーターを使う →
            </Link>
          </div>
        )}

        {related.length > 0 && (
          <div className="mt-8">
            <h3 className="text-sm font-bold text-gray-700 mb-3">関連記事</h3>
            <div className="grid gap-3 sm:grid-cols-3">
              {related.map((r) => (
                <Link
                  key={r.slug}
                  href={`/articles/${r.slug}`}
                  className="bg-white border border-gray-200 rounded-xl overflow-hidden hover:shadow-md transition-shadow group"
                >
                  {r.image && (
                    <div className="relative w-full h-24">
                      <Image
                        src={r.image}
                        alt={r.title}
                        fill
                        className="object-cover"
                        sizes="(max-width: 640px) 100vw, 33vw"
                      />
                    </div>
                  )}
                  <div className="p-3">
                    <p className="text-xs text-gray-400 mb-1">{r.date}</p>
                    <p className="text-xs font-semibold text-gray-800 leading-snug group-hover:text-blue-600 transition-colors line-clamp-3">
                      {r.title}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}

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

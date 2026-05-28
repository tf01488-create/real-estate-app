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

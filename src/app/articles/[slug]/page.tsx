import Link from "next/link";
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
          {
            "@type": "ListItem",
            "position": 1,
            "name": "トップ",
            "item": BASE_URL,
          },
          {
            "@type": "ListItem",
            "position": 2,
            "name": "コラム記事一覧",
            "item": `${BASE_URL}/articles`,
          },
          {
            "@type": "ListItem",
            "position": 3,
            "name": article.title,
            "item": `${BASE_URL}/articles/${article.slug}`,
          },
        ],
      },
    ],
  };

  return (
    <div className="min-h-screen bg-slate-900">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <header className="bg-blue-950 border-b border-blue-800 px-6 py-4">
        <div className="max-w-4xl mx-auto flex items-center gap-3">
          <Link href="/" className="p-2 bg-blue-500 rounded-lg hover:bg-blue-400 transition-colors">
            <Building2 className="w-5 h-5 text-white" />
          </Link>
          <div className="flex-1">
            <h1 className="text-lg font-bold text-white">不動産投資コラム</h1>
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
        <Link
          href="/articles"
          className="inline-flex items-center gap-1 text-sm text-blue-400 hover:text-blue-200 mb-6 transition-colors"
        >
          <ChevronLeft className="w-4 h-4" />
          記事一覧に戻る
        </Link>

        <article className="bg-blue-950 border border-blue-800 rounded-xl p-6 sm:p-8">
          <p className="text-xs text-blue-400 mb-3">{article.date}</p>
          <h2 className="text-xl sm:text-2xl font-bold text-white leading-snug mb-6">
            {article.title}
          </h2>
          <p className="text-sm text-blue-300 border-l-2 border-blue-600 pl-4 mb-8 leading-relaxed">
            {article.excerpt}
          </p>

          <div className="space-y-5">
            {article.content.map((paragraph, i) => (
              <p key={i} className="text-sm text-blue-100 leading-relaxed whitespace-pre-line">
                {paragraph}
              </p>
            ))}
          </div>
        </article>

        <div className="mt-8 bg-blue-900/40 border border-blue-700 rounded-xl p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <p className="text-sm font-semibold text-blue-100 mb-1">実際にシミュレーションしてみよう</p>
            <p className="text-xs text-blue-300">物件価格・ローン・家賃を入力して、35年分の収支を無料で試算できます。</p>
          </div>
          <Link
            href="/"
            className="shrink-0 bg-blue-500 hover:bg-blue-400 text-white text-sm font-medium px-5 py-2.5 rounded-lg transition-colors"
          >
            シミュレーターを使う →
          </Link>
        </div>
      </main>
    </div>
  );
}

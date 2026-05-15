import { ImageResponse } from "next/og";
import { getArticleBySlug, articles } from "@/data/articles";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export async function generateImageMetadata() {
  return articles.map((article) => ({
    id: article.slug,
    alt: article.title,
  }));
}

export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const article = getArticleBySlug(slug);
  const title = article?.title ?? "不動産投資コラム";

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background: "linear-gradient(135deg, #0f172a 0%, #1e3a5f 100%)",
          padding: "60px",
        }}
      >
        {/* ヘッダー */}
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <div
            style={{
              background: "#3b82f6",
              borderRadius: 10,
              padding: "8px 16px",
              color: "#ffffff",
              fontSize: 22,
              fontWeight: 700,
            }}
          >
            不動産投資コラム
          </div>
          <div style={{ color: "#64748b", fontSize: 20 }}>川口哲也税理士事務所</div>
        </div>

        {/* 記事タイトル */}
        <div
          style={{
            fontSize: title.length > 28 ? 44 : 52,
            fontWeight: 700,
            color: "#ffffff",
            lineHeight: 1.4,
          }}
        >
          {title}
        </div>

        {/* フッター */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <div style={{ color: "#93c5fd", fontSize: 22 }}>
            不動産投資 簡易シミュレーション
          </div>
          <div
            style={{
              background: "#3b82f6",
              borderRadius: 24,
              padding: "10px 24px",
              color: "#ffffff",
              fontSize: 20,
            }}
          >
            シミュレーターで試す →
          </div>
        </div>
      </div>
    ),
    { ...size }
  );
}

import { ImageResponse } from "next/og";

export const alt = "不動産投資 簡易シミュレーション | 川口哲也税理士事務所";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          background: "linear-gradient(135deg, #0f172a 0%, #1e3a5f 100%)",
          padding: "60px",
        }}
      >
        {/* アイコン */}
        <div
          style={{
            width: 80,
            height: 80,
            background: "#3b82f6",
            borderRadius: 16,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            marginBottom: 32,
            fontSize: 40,
          }}
        >
          🏢
        </div>

        {/* メインタイトル */}
        <div
          style={{
            fontSize: 56,
            fontWeight: 700,
            color: "#ffffff",
            textAlign: "center",
            lineHeight: 1.3,
            marginBottom: 20,
          }}
        >
          不動産投資 簡易シミュレーション
        </div>

        {/* サブタイトル */}
        <div
          style={{
            fontSize: 28,
            color: "#93c5fd",
            textAlign: "center",
            marginBottom: 40,
          }}
        >
          35年間のキャッシュフローを無料で試算
        </div>

        {/* タグ */}
        <div style={{ display: "flex", gap: 12 }}>
          {["利回り計算", "売却シナリオ", "損益分岐"].map((tag) => (
            <div
              key={tag}
              style={{
                background: "rgba(59,130,246,0.25)",
                border: "1px solid #3b82f6",
                borderRadius: 24,
                padding: "8px 20px",
                color: "#93c5fd",
                fontSize: 22,
              }}
            >
              {tag}
            </div>
          ))}
        </div>

        {/* 運営者 */}
        <div
          style={{
            position: "absolute",
            bottom: 40,
            right: 60,
            fontSize: 20,
            color: "#64748b",
          }}
        >
          川口哲也税理士事務所
        </div>
      </div>
    ),
    { ...size }
  );
}

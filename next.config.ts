import type { NextConfig } from "next";

const securityHeaders = [
  // MIMEタイプのスニッフィングを防止
  { key: "X-Content-Type-Options", value: "nosniff" },
  // クリックジャッキング攻撃を防止（iframeへの埋め込みを拒否）
  { key: "X-Frame-Options", value: "DENY" },
  // 旧ブラウザ向けXSS保護
  { key: "X-XSS-Protection", value: "1; mode=block" },
  // リファラー情報の送信範囲を制限
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  // 不要なブラウザ機能へのアクセスを制限
  {
    key: "Permissions-Policy",
    value: "camera=(), microphone=(), geolocation=(), payment=()",
  },
  // Google AdSense・Analytics を許可しつつ基本的なCSPを設定
  {
    key: "Content-Security-Policy",
    value: [
      "default-src 'self'",
      // Google AdSense / Analytics / Fonts
      "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://*.google.com https://*.googlesyndication.com https://*.googletagmanager.com https://*.googletagservices.com https://*.doubleclick.net",
      "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
      "font-src 'self' https://fonts.gstatic.com",
      "img-src 'self' data: https:",
      "connect-src 'self' https://*.google-analytics.com https://*.analytics.google.com https://*.googletagmanager.com",
      "frame-src https://*.googlesyndication.com https://*.doubleclick.net",
      "frame-ancestors 'none'",
    ].join("; "),
  },
];

const nextConfig: NextConfig = {
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: securityHeaders,
      },
    ];
  },
};

export default nextConfig;

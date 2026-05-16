import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Script from "next/script";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const BASE_URL = "https://fudousanunyou-toushi-simulators.kawaguchi-tetsuya-tax.com";

export const metadata: Metadata = {
  title: "不動産投資　簡易シミュレーション",
  description: "物件価格・ローン・賃料などを入力して35年間の収支をシミュレーション。売却シナリオも対応。川口哲也税理士事務所が運営。",
  metadataBase: new URL(BASE_URL),
  openGraph: {
    type: "website",
    url: BASE_URL,
    siteName: "不動産投資　簡易シミュレーション",
    title: "不動産投資　簡易シミュレーション",
    description: "物件価格・ローン・賃料などを入力して35年間の収支をシミュレーション。売却シナリオも対応。川口哲也税理士事務所が運営。",
    locale: "ja_JP",
  },
  twitter: {
    card: "summary_large_image",
    title: "不動産投資　簡易シミュレーション",
    description: "物件価格・ローン・賃料などを入力して35年間の収支をシミュレーション。売却シナリオも対応。",
  },
  verification: {
    google: "Va4EUq-IqNhStuSkwZrtXVPtEaSbq4SrY-k_ifC8E78",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="ja"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <head>
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-RGKWN3TB4S"
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-RGKWN3TB4S');
          `}
        </Script>
      </head>
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}

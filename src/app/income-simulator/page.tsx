import type { Metadata } from "next";
import IncomeSimulatorClient from "./income-simulator-client";

const BASE_URL = "https://fudousanunyou-toushi-simulators.kawaguchi-tetsuya-tax.com";
const TITLE = "不動産所得 概算シミュレーター｜減価償却・所得税額を自動計算";
const DESCRIPTION =
  "賃貸収入・経費・減価償却費を入力するだけで、不動産所得の金額や所得税・住民税の概算額を自動計算。確定申告前の試算に役立つ無料ツールです。川口哲也税理士事務所が運営。";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: {
    canonical: "/income-simulator",
  },
  openGraph: {
    type: "website",
    url: `${BASE_URL}/income-simulator`,
    siteName: "不動産投資　簡易シミュレーション",
    title: TITLE,
    description: DESCRIPTION,
    locale: "ja_JP",
  },
  twitter: {
    card: "summary_large_image",
    title: TITLE,
    description: DESCRIPTION,
  },
};

export default function IncomeSimulatorPage() {
  return <IncomeSimulatorClient />;
}

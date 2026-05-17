import Link from "next/link";
import { Building2 } from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "運営者情報 | 不動産投資　簡易シミュレーション",
  description: "不動産投資 簡易シミュレーションの運営者情報。川口哲也税理士事務所が運営する不動産投資支援ツールです。",
};

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-slate-900">
      <header className="bg-blue-950 border-b border-blue-800 px-6 py-4">
        <div className="max-w-4xl mx-auto flex items-center gap-3">
          <Link href="/" className="p-2 bg-blue-500 rounded-lg hover:bg-blue-400 transition-colors">
            <Building2 className="w-5 h-5 text-white" />
          </Link>
          <div className="flex-1">
            <h1 className="text-lg font-bold text-white">運営者情報</h1>
          </div>
          <Link
            href="/"
            className="text-xs text-blue-300 hover:text-blue-100 border border-blue-700 hover:border-blue-500 px-3 py-1.5 rounded-lg transition-colors"
          >
            シミュレーターへ →
          </Link>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-10">
        <div className="bg-blue-950 border border-blue-800 rounded-xl p-6 sm:p-8 space-y-8">
          <div>
            <h2 className="text-xl font-bold text-white mb-6">運営者情報</h2>

            <table className="w-full text-sm">
              <tbody className="divide-y divide-blue-800">
                {[
                  { label: "サイト名", value: "不動産投資　簡易シミュレーション" },
                  { label: "運営者", value: "川口哲也税理士事務所" },
                  { label: "代表者", value: "川口哲也（税理士）" },
                  { label: "所在地", value: "お問い合わせにてご確認ください" },
                  { label: "お問い合わせ", value: "taxoffice@kawaguchi-tetsuya-tax.com" },
                  { label: "サイトURL", value: "https://fudousanunyou-toushi-simulators.kawaguchi-tetsuya-tax.com" },
                ].map(({ label, value }) => (
                  <tr key={label}>
                    <td className="py-3 pr-6 text-blue-400 font-medium whitespace-nowrap w-36">{label}</td>
                    <td className="py-3 text-blue-100 break-all">{value}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div>
            <h3 className="text-base font-semibold text-white mb-3">サイトの目的</h3>
            <p className="text-sm text-blue-100 leading-relaxed">
              本サイトは、不動産投資を検討されている方が物件の収支を簡単に試算できるシミュレーションツールを無料で提供しています。物件価格・ローン条件・家賃収入・売却シナリオなどを入力することで、35年間のキャッシュフローを可視化し、投資判断の参考情報としてご活用いただけます。
            </p>
          </div>

          <div>
            <h3 className="text-base font-semibold text-white mb-3">運営者について</h3>
            <p className="text-sm text-blue-100 leading-relaxed">
              川口哲也税理士事務所は、個人・法人の税務申告をはじめ、不動産投資・資産運用に関する税務相談を取り扱う税理士事務所です。不動産投資における税務・収支管理の知識をもとに、投資家の方々が正確な情報に基づいて判断できるよう、本サイトを運営しています。
            </p>
          </div>

          <div>
            <h3 className="text-base font-semibold text-white mb-3">免責事項</h3>
            <p className="text-sm text-blue-300 leading-relaxed">
              本サイトのシミュレーション結果は入力値に基づく試算であり、将来の収益・損失を保証するものではありません。投資判断は必ず専門家にご相談のうえ、ご自身の責任においてお行いください。
            </p>
          </div>
        </div>

        <div className="mt-6 flex flex-wrap gap-4 text-xs text-blue-400">
          <Link href="/" className="hover:text-blue-200 transition-colors">トップ</Link>
          <Link href="/articles" className="hover:text-blue-200 transition-colors">コラム記事一覧</Link>
          <Link href="/contact" className="hover:text-blue-200 transition-colors">お問い合わせ</Link>
          <Link href="/privacy-policy" className="hover:text-blue-200 transition-colors">プライバシーポリシー</Link>
        </div>
      </main>
    </div>
  );
}

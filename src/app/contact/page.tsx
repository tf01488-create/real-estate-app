import Link from "next/link";
import { Building2, Mail } from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "お問い合わせ | 不動産投資　簡易シミュレーション",
  description: "不動産投資 簡易シミュレーションへのお問い合わせはこちら。川口哲也税理士事務所へのご相談・ご連絡をお受けしています。",
};

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-slate-900">
      <header className="bg-blue-950 border-b border-blue-800 px-6 py-4">
        <div className="max-w-4xl mx-auto flex items-center gap-3">
          <Link href="/" className="p-2 bg-blue-500 rounded-lg hover:bg-blue-400 transition-colors">
            <Building2 className="w-5 h-5 text-white" />
          </Link>
          <div className="flex-1">
            <h1 className="text-lg font-bold text-white">お問い合わせ</h1>
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
        <div className="bg-blue-950 border border-blue-800 rounded-xl p-6 sm:p-8 space-y-6">
          <div>
            <h2 className="text-xl font-bold text-white mb-2">お問い合わせ</h2>
            <p className="text-sm text-blue-300 leading-relaxed">
              本サイトに関するご質問・ご意見、不動産投資の税務に関するご相談など、お気軽にご連絡ください。
            </p>
          </div>

          <div className="bg-blue-900/40 border border-blue-700 rounded-xl p-5">
            <div className="flex items-start gap-4">
              <div className="p-2.5 bg-blue-600 rounded-lg shrink-0">
                <Mail className="w-5 h-5 text-white" />
              </div>
              <div>
                <p className="text-sm font-semibold text-white mb-1">メールでのお問い合わせ</p>
                <a
                  href="mailto:taxoffice@kawaguchi-tetsuya-tax.com"
                  className="text-blue-300 hover:text-blue-100 text-sm underline underline-offset-2 transition-colors"
                >
                  taxoffice@kawaguchi-tetsuya-tax.com
                </a>
                <p className="text-xs text-blue-400 mt-2">
                  ※ 返信まで2〜3営業日いただく場合がございます。
                </p>
              </div>
            </div>
          </div>

          <div className="space-y-3 text-sm text-blue-200">
            <p className="font-semibold text-white">お問い合わせの際は、以下をご記載ください：</p>
            <ul className="list-disc list-inside space-y-1 text-blue-300 text-sm">
              <li>お名前</li>
              <li>お問い合わせ内容</li>
              <li>ご連絡先（返信が必要な場合）</li>
            </ul>
          </div>

          <div className="border-t border-blue-800 pt-5">
            <p className="text-xs text-blue-400 leading-relaxed">
              いただいた個人情報は、お問い合わせへの返答のみに使用し、第三者への提供は行いません。詳しくは
              <Link href="/privacy-policy" className="text-blue-300 hover:text-blue-100 underline underline-offset-2 ml-1">
                プライバシーポリシー
              </Link>
              をご確認ください。
            </p>
          </div>
        </div>

        <div className="mt-6 flex flex-wrap gap-4 text-xs text-blue-400">
          <Link href="/" className="hover:text-blue-200 transition-colors">トップ</Link>
          <Link href="/articles" className="hover:text-blue-200 transition-colors">コラム記事一覧</Link>
          <Link href="/about" className="hover:text-blue-200 transition-colors">運営者情報</Link>
          <Link href="/privacy-policy" className="hover:text-blue-200 transition-colors">プライバシーポリシー</Link>
        </div>
      </main>
    </div>
  );
}

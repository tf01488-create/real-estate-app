import Link from "next/link";
import { Building2 } from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "プライバシーポリシー | 不動産投資　簡易シミュレーション",
  description: "当サイトのプライバシーポリシーについてご説明します。",
  alternates: {
    canonical: "/privacy-policy",
  },
};

export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-blue-600 border-b border-blue-700 px-6 py-4">
        <div className="max-w-4xl mx-auto flex items-center gap-3">
          <Link href="/" className="p-2 bg-white/20 rounded-lg hover:bg-white/30 transition-colors">
            <Building2 className="w-5 h-5 text-white" />
          </Link>
          <div className="flex-1">
            <h1 className="text-lg font-bold text-white">プライバシーポリシー</h1>
            <p className="text-xs text-blue-100">不動産投資　簡易シミュレーション</p>
          </div>
          <Link
            href="/"
            className="text-xs text-blue-100 hover:text-white border border-blue-400 hover:border-white px-3 py-1.5 rounded-lg transition-colors"
          >
            トップへ戻る
          </Link>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-10">
        <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-6 sm:p-10 space-y-10 text-sm text-gray-700 leading-relaxed">

          <p className="text-gray-400 text-xs">最終更新日：2026年5月13日</p>

          <section>
            <p>川口哲也税理士事務所（以下「当事務所」）が運営する「不動産投資　簡易シミュレーション」（以下「当サイト」）は、利用者のプライバシーを尊重し、個人情報の保護に努めます。本プライバシーポリシーは、当サイトにおける個人情報・データの取り扱いについて説明するものです。</p>
          </section>

          <section className="space-y-3">
            <h2 className="text-base font-bold text-gray-900 border-b border-gray-200 pb-2">1. 運営者情報</h2>
            <div className="space-y-1 text-gray-600">
              <p><span className="text-blue-600">事務所名：</span>川口哲也税理士事務所</p>
              <p><span className="text-blue-600">お問い合わせ：</span>
                <a href="mailto:taxoffice@kawaguchi-tetsuya-tax.com" className="text-blue-600 hover:text-blue-800 underline underline-offset-2">
                  taxoffice@kawaguchi-tetsuya-tax.com
                </a>
              </p>
            </div>
          </section>

          <section className="space-y-3">
            <h2 className="text-base font-bold text-gray-900 border-b border-gray-200 pb-2">2. 収集する情報について</h2>
            <p>当サイトは、利用者が入力したシミュレーション数値（物件価格・ローン条件・家賃等）をブラウザ上のセッションストレージに一時保存しますが、これらの情報はサーバーに送信・保存されることはなく、ブラウザのタブを閉じると自動的に削除されます。</p>
            <p>当サイトでは、お問い合わせフォーム等による個人情報の収集は行っておりません。個人情報をご提供いただく際は、その都度利用目的をお知らせします。</p>
          </section>

          <section className="space-y-3">
            <h2 className="text-base font-bold text-gray-900 border-b border-gray-200 pb-2">3. Cookieの使用について</h2>
            <p>当サイトでは、アクセス解析および広告配信の目的でCookie（クッキー）を使用しています。Cookieとは、ウェブサイトがお使いのブラウザに保存する小さなテキストファイルです。Cookieにより個人を特定できる情報が収集されることはありません。</p>
            <p>ブラウザの設定によりCookieを無効にすることが可能ですが、一部の機能が正常に動作しない場合があります。</p>
          </section>

          <section className="space-y-3">
            <h2 className="text-base font-bold text-gray-900 border-b border-gray-200 pb-2">4. アクセス解析ツール（Google アナリティクス）について</h2>
            <p>当サイトでは、Googleが提供するアクセス解析サービス「Google アナリティクス」を利用しています。Google アナリティクスはCookieを使用してアクセス情報を収集しますが、この情報は匿名で収集されており、個人を特定するものではありません。</p>
            <p>収集されたデータはGoogleのプライバシーポリシーに基づいて管理されます。Google アナリティクスのデータ収集を無効にする場合は、Googleが提供する「Google アナリティクス オプトアウト アドオン」をご利用ください。</p>
            <p>
              Google のプライバシーポリシーについては
              <a href="https://policies.google.com/privacy" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-800 underline underline-offset-2 mx-1">
                こちら
              </a>
              をご確認ください。
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-base font-bold text-gray-900 border-b border-gray-200 pb-2">5. 広告配信（Google AdSense）について</h2>
            <p>当サイトでは、Googleが提供する広告配信サービス「Google AdSense」を利用しています。Google AdSenseは、利用者の興味・関心に基づいた広告を表示するためにCookieを使用します。</p>
            <p>Google AdSenseにおける広告のCookie利用については、パーソナライズド広告のオプトアウトページ（<a href="https://www.google.com/settings/ads" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-800 underline underline-offset-2">Google 広告設定</a>）からオプトアウトが可能です。また、<a href="https://www.aboutads.info/" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-800 underline underline-offset-2">aboutads.info</a> にアクセスすることで、第三者配信事業者のCookieを無効にすることができます。</p>
            <p>広告配信に関するGoogleのポリシーについては <a href="https://policies.google.com/technologies/ads" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-800 underline underline-offset-2">こちら</a> をご参照ください。</p>
          </section>

          <section className="space-y-3">
            <h2 className="text-base font-bold text-gray-900 border-b border-gray-200 pb-2">6. 免責事項</h2>
            <p>当サイトに掲載するシミュレーション結果・コラム記事は、情報提供を目的としたものであり、投資助言・税務相談・法律相談を行うものではありません。掲載情報の正確性・完全性には努めておりますが、その内容の正確性を保証するものではなく、当サイトの情報に基づく判断・行動により生じたいかなる損害についても、当事務所は一切の責任を負いません。</p>
            <p>実際の投資・税務・法律に関するご判断は、税理士・弁護士・ファイナンシャルプランナー等の専門家にご相談ください。</p>
          </section>

          <section className="space-y-3">
            <h2 className="text-base font-bold text-gray-900 border-b border-gray-200 pb-2">7. 著作権について</h2>
            <p>当サイトに掲載されているコンテンツ（文章・画像・シミュレーションロジック等）の著作権は、川口哲也税理士事務所に帰属します。無断転載・複製・改変等はご遠慮ください。</p>
          </section>

          <section className="space-y-3">
            <h2 className="text-base font-bold text-gray-900 border-b border-gray-200 pb-2">8. プライバシーポリシーの変更について</h2>
            <p>当事務所は、法令の変更やサービス内容の変化に応じて、本プライバシーポリシーを予告なく変更することがあります。変更後のプライバシーポリシーは、当ページに掲載した時点から効力を生じるものとします。</p>
          </section>

          <section className="space-y-3">
            <h2 className="text-base font-bold text-gray-900 border-b border-gray-200 pb-2">9. お問い合わせ</h2>
            <p>本プライバシーポリシーに関するお問い合わせは、下記までご連絡ください。</p>
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 space-y-1 text-gray-600">
              <p>川口哲也税理士事務所</p>
              <p>
                メール：
                <a href="mailto:taxoffice@kawaguchi-tetsuya-tax.com" className="text-blue-600 hover:text-blue-800 underline underline-offset-2">
                  taxoffice@kawaguchi-tetsuya-tax.com
                </a>
              </p>
            </div>
          </section>

        </div>
      </main>
    </div>
  );
}

"use client";

import { useState, useMemo, useRef } from "react";
import Link from "next/link";
import { Building2, RotateCcw, Info, ChevronDown } from "lucide-react";

// ---------- 税計算ユーティリティ ----------

const DEPRECIATION_RATES: Record<number, number> = {
  2: 0.500, 3: 0.334, 4: 0.250, 5: 0.200, 6: 0.167, 7: 0.143, 8: 0.125,
  9: 0.112, 10: 0.100, 11: 0.091, 12: 0.084, 13: 0.077, 14: 0.072,
  15: 0.067, 16: 0.063, 17: 0.059, 18: 0.056, 19: 0.053, 20: 0.050,
  21: 0.048, 22: 0.046, 23: 0.044, 24: 0.042, 25: 0.040, 26: 0.039,
  27: 0.038, 28: 0.036, 29: 0.035, 30: 0.034, 31: 0.033, 32: 0.032,
  33: 0.031, 34: 0.030, 35: 0.029, 36: 0.028, 37: 0.028, 38: 0.027,
  39: 0.026, 40: 0.025, 41: 0.025, 42: 0.024, 43: 0.024, 44: 0.023,
  45: 0.023, 46: 0.022, 47: 0.022,
};

function getDepreciationRate(years: number): number {
  if (years <= 2) return 0.500;
  if (years >= 47) return 0.022;
  return DEPRECIATION_RATES[years] ?? Math.floor(1000 / years) / 1000;
}

const LEGAL_LIFE: Record<string, number> = {
  "木造": 22, "木骨モルタル造": 20, "軽量鉄骨造（3mm以下）": 19,
  "軽量鉄骨造（3mm超4mm以下）": 27, "重量鉄骨造（4mm超）": 34,
  "鉄筋コンクリート造（RC・SRC）": 47,
};

function calcUsefulLife(structure: string, age: number): number {
  const legal = LEGAL_LIFE[structure] ?? 22;
  if (age >= legal) return Math.max(2, Math.floor(legal * 0.2));
  return Math.max(2, Math.floor((legal - age) + age * 0.2));
}

function calcDepreciation(buildingValue: number, structure: string, age: number): number {
  const life = calcUsefulLife(structure, age);
  const rate = getDepreciationRate(life);
  return Math.floor(buildingValue * 10000 * rate);
}

// 給与所得控除
function salaryDeduction(salary: number): number {
  const s = salary * 10000;
  if (s <= 1_625_000) return 550_000;
  if (s <= 1_800_000) return Math.floor(s * 0.4 - 100_000);
  if (s <= 3_600_000) return Math.floor(s * 0.3 + 80_000);
  if (s <= 6_600_000) return Math.floor(s * 0.2 + 440_000);
  if (s <= 8_500_000) return Math.floor(s * 0.1 + 1_100_000);
  return 1_950_000;
}

// 所得税額（課税所得から）
function calcIncomeTax(taxableIncome: number): number {
  if (taxableIncome <= 0) return 0;
  const t = taxableIncome;
  let tax = 0;
  if (t <= 1_950_000) tax = t * 0.05;
  else if (t <= 3_300_000) tax = t * 0.10 - 97_500;
  else if (t <= 6_950_000) tax = t * 0.20 - 427_500;
  else if (t <= 9_000_000) tax = t * 0.23 - 636_000;
  else if (t <= 18_000_000) tax = t * 0.33 - 1_536_000;
  else if (t <= 40_000_000) tax = t * 0.40 - 2_796_000;
  else tax = t * 0.45 - 4_796_000;
  return Math.floor(tax * 1.021); // 復興特別所得税
}

// 住民税額
function calcResidentTax(taxableIncome: number): number {
  if (taxableIncome <= 0) return 0;
  return Math.floor(taxableIncome * 0.10);
}

// ---------- UI コンポーネント ----------

interface InputFieldProps {
  label: string;
  hint?: string;
  value: number;
  onChange: (v: number) => void;
  unit: string;
  min?: number;
  max?: number;
  step?: number;
}

function NumField({ label, hint, value, onChange, unit, min = 0, max, step = 1 }: InputFieldProps) {
  const [raw, setRaw] = useState<string | null>(null);
  const focused = useRef(false);

  const displayed = focused.current && raw !== null ? raw : String(value);

  return (
    <div>
      <div className="flex items-center gap-1 mb-1">
        <label className="text-xs font-semibold text-gray-700">{label}</label>
        {hint && (
          <span className="group relative">
            <Info className="w-3.5 h-3.5 text-gray-400 cursor-help" />
            <span className="absolute left-5 top-0 z-10 hidden group-hover:block w-56 bg-gray-800 text-white text-xs rounded-lg px-3 py-2 leading-relaxed shadow-lg">
              {hint}
            </span>
          </span>
        )}
      </div>
      <div className="flex items-center gap-2">
        <input
          type="text"
          inputMode="decimal"
          value={displayed}
          onFocus={() => {
            focused.current = true;
            setRaw(value === 0 ? "" : String(value));
          }}
          onChange={(e) => {
            const s = e.target.value;
            setRaw(s);
            const n = parseFloat(s);
            if (!isNaN(n)) onChange(n);
          }}
          onBlur={() => {
            focused.current = false;
            const n = parseFloat(raw ?? "");
            onChange(isNaN(n) ? 0 : Math.max(min, max !== undefined ? Math.min(max, n) : n));
            setRaw(null);
          }}
          className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
        />
        <span className="text-xs text-gray-500 whitespace-nowrap">{unit}</span>
      </div>
    </div>
  );
}

function SelectField({ label, hint, value, onChange, options }: {
  label: string; hint?: string; value: string;
  onChange: (v: string) => void; options: string[];
}) {
  return (
    <div>
      <div className="flex items-center gap-1 mb-1">
        <label className="text-xs font-semibold text-gray-700">{label}</label>
        {hint && (
          <span className="group relative">
            <Info className="w-3.5 h-3.5 text-gray-400 cursor-help" />
            <span className="absolute left-5 top-0 z-10 hidden group-hover:block w-56 bg-gray-800 text-white text-xs rounded-lg px-3 py-2 leading-relaxed shadow-lg">
              {hint}
            </span>
          </span>
        )}
      </div>
      <div className="relative">
        <select
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-full appearance-none border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 bg-white pr-8"
        >
          {options.map((o) => <option key={o}>{o}</option>)}
        </select>
        <ChevronDown className="absolute right-2 top-2.5 w-4 h-4 text-gray-400 pointer-events-none" />
      </div>
    </div>
  );
}

function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <h3 className="text-xs font-bold text-blue-700 uppercase tracking-wide border-b border-blue-100 pb-1 mb-3">
      {children}
    </h3>
  );
}

function ResultRow({ label, value, sub, highlight }: {
  label: string; value: string; sub?: string; highlight?: "blue" | "green" | "red";
}) {
  const colors = {
    blue: "text-blue-700 font-bold",
    green: "text-emerald-600 font-bold",
    red: "text-red-600 font-bold",
  };
  return (
    <div className="flex items-baseline justify-between py-2 border-b border-gray-100 last:border-0">
      <span className="text-xs text-gray-600">{label}</span>
      <div className="text-right">
        <span className={`text-sm ${highlight ? colors[highlight] : "text-gray-800 font-medium"}`}>
          {value}
        </span>
        {sub && <p className="text-xs text-gray-400">{sub}</p>}
      </div>
    </div>
  );
}

function man(yen: number): string {
  const m = Math.round(yen / 10000);
  return `${m.toLocaleString()}万円`;
}

// ---------- DEFAULT VALUES ----------
const DEFAULTS = {
  annualRent: 120,        // 万円
  propertyTax: 10,        // 万円/年
  managementFee: 1,       // 万円/月
  loanInterest: 40,       // 万円/年（利息部分のみ）
  buildingValue: 1000,    // 万円
  structure: "木造",
  buildingAge: 20,        // 年
  otherExpenses: 5,       // 万円/年
  salary: 600,            // 万円/年
};

// ---------- メインコンポーネント ----------
export default function IncomeSimulatorClient() {
  const [inputs, setInputs] = useState(DEFAULTS);

  const set = (key: keyof typeof DEFAULTS) => (v: number | string) =>
    setInputs((prev) => ({ ...prev, [key]: v }));

  const results = useMemo(() => {
    const rent = inputs.annualRent * 10000;
    const propTax = inputs.propertyTax * 10000;
    const mgmt = inputs.managementFee * 12 * 10000;
    const interest = inputs.loanInterest * 10000;
    const depreciation = calcDepreciation(inputs.buildingValue, inputs.structure, inputs.buildingAge);
    const other = inputs.otherExpenses * 10000;
    const totalExpenses = propTax + mgmt + interest + depreciation + other;
    const realEstateIncome = rent - totalExpenses;

    // 給与所得
    const salaryIncome = inputs.salary * 10000 - salaryDeduction(inputs.salary);
    const basicDeduction = 480_000;

    // 損益通算なし（不動産所得がプラスの場合は合算、マイナスの場合は0として計算）
    const taxableWithout = Math.max(0, salaryIncome - basicDeduction + Math.max(0, realEstateIncome));
    // 損益通算あり（不動産所得がマイナスの場合のみ）
    const lossCarry = Math.min(0, realEstateIncome);
    const taxableWith = Math.max(0, salaryIncome - basicDeduction + lossCarry + Math.max(0, realEstateIncome));

    const incomeTaxWithout = calcIncomeTax(taxableWithout);
    const residentTaxWithout = calcResidentTax(taxableWithout);
    const totalTaxWithout = incomeTaxWithout + residentTaxWithout;

    const incomeTaxWith = calcIncomeTax(taxableWith);
    const residentTaxWith = calcResidentTax(taxableWith);
    const totalTaxWith = incomeTaxWith + residentTaxWith;

    const taxSaving = totalTaxWithout - totalTaxWith;
    const usefulLife = calcUsefulLife(inputs.structure, inputs.buildingAge);
    const deprRate = getDepreciationRate(usefulLife);

    return {
      rent, propTax, mgmt, interest, depreciation, other,
      totalExpenses, realEstateIncome,
      salaryIncome, taxableWithout, taxableWith,
      incomeTaxWithout, residentTaxWithout, totalTaxWithout,
      incomeTaxWith, residentTaxWith, totalTaxWith,
      taxSaving, usefulLife, deprRate,
    };
  }, [inputs]);

  const BASE_URL = "https://fudousanunyou-toushi-simulators.kawaguchi-tetsuya-tax.com";
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebApplication",
        "name": "不動産所得 概算シミュレーター",
        "description": "賃貸収入・経費・減価償却費を入力するだけで、不動産所得の金額や所得税・住民税の概算額を自動計算するツールです。",
        "url": `${BASE_URL}/income-simulator`,
        "applicationCategory": "FinanceApplication",
        "offers": { "@type": "Offer", "price": "0", "priceCurrency": "JPY" },
        "author": {
          "@type": "Organization",
          "name": "川口哲也税理士事務所",
          "url": BASE_URL,
        },
      },
    ],
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      {/* ヘッダー */}
      <header className="bg-blue-600 border-b border-blue-700 px-6 py-4">
        <div className="max-w-5xl mx-auto flex items-center gap-3">
          <Link href="/" className="p-2 bg-white/20 rounded-lg hover:bg-white/30 transition-colors">
            <Building2 className="w-5 h-5 text-white" />
          </Link>
          <div className="flex-1 min-w-0">
            <h1 className="text-lg font-bold text-white truncate">不動産所得　概算シミュレーション</h1>
            <p className="text-xs text-blue-100 truncate">経費・減価償却・損益通算の節税効果を試算</p>
          </div>
          <Link
            href="/articles"
            className="hidden sm:inline-block text-xs text-blue-100 hover:text-white border border-blue-400 hover:border-white px-3 py-1.5 rounded-lg transition-colors whitespace-nowrap"
          >
            コラム記事
          </Link>
          <Link
            href="/"
            className="hidden sm:inline-block text-xs text-blue-100 hover:text-white border border-blue-400 hover:border-white px-3 py-1.5 rounded-lg transition-colors whitespace-nowrap"
          >
            投資シミュレーター
          </Link>
          <a
            href="https://lin.ee/QY17l0C"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 bg-green-500 hover:bg-green-400 text-white text-xs font-bold px-3 py-1.5 rounded-lg transition-colors whitespace-nowrap"
          >
            <svg viewBox="0 0 24 24" className="w-4 h-4 shrink-0" fill="currentColor">
              <path d="M12 2C6.48 2 2 6.03 2 11c0 3.19 1.73 6.01 4.38 7.77-.19.71-.69 2.58-.79 2.98-.12.5.18.49.38.36.16-.11 2.06-1.39 2.9-1.96.69.1 1.4.15 2.13.15 5.52 0 10-4.03 10-9S17.52 2 12 2zm-4 12.5H6.5V9H8v5.5zm1.5 0V9H11v3.75L13.25 9H15v5.5h-1.5V10.75L11.25 14.5H9.5zm8 0H16v-2.25L13.75 14.5H12v-5.5h1.5v3.75L15.75 9H18v5.5z"/>
            </svg>
            LINE相談
          </a>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 py-8">
        {/* 注意書き */}
        <div className="bg-amber-50 border border-amber-200 rounded-xl px-4 py-3 mb-6 text-xs text-amber-800 leading-relaxed">
          本シミュレーターは概算値を算出するものです。実際の税額は個人の状況・各種控除等によって異なります。正確な申告・税務相談は税理士にご確認ください。
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* ===== 入力パネル ===== */}
          <div className="space-y-5">

            {/* 収入 */}
            <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm">
              <SectionTitle>① 年間収入</SectionTitle>
              <div className="space-y-4">
                <NumField label="年間家賃収入" value={inputs.annualRent} onChange={set("annualRent")} unit="万円/年" min={0} step={1} />
              </div>
            </div>

            {/* 経費 */}
            <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm">
              <SectionTitle>② 年間経費</SectionTitle>
              <div className="space-y-4">
                <NumField
                  label="固定資産税・都市計画税"
                  hint="毎年5〜6月頃に届く納税通知書の金額"
                  value={inputs.propertyTax} onChange={set("propertyTax")} unit="万円/年" min={0} step={1}
                />
                <NumField
                  label="管理費・修繕積立金"
                  hint="毎月支払う管理費・修繕積立金の合計額。年額換算して計算します。"
                  value={inputs.managementFee} onChange={set("managementFee")} unit="万円/月" min={0} step={0.1}
                />
                <NumField
                  label="ローン利息（年間）"
                  hint="元本返済部分は経費になりません。利息部分のみを入力してください。"
                  value={inputs.loanInterest} onChange={set("loanInterest")} unit="万円/年" min={0} step={1}
                />
                <NumField
                  label="その他経費"
                  hint="火災保険料・地震保険料・税理士費用・交通費など"
                  value={inputs.otherExpenses} onChange={set("otherExpenses")} unit="万円/年" min={0} step={1}
                />
              </div>
            </div>

            {/* 減価償却 */}
            <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm">
              <SectionTitle>③ 減価償却費（自動計算）</SectionTitle>
              <div className="space-y-4">
                <NumField
                  label="建物取得価額"
                  hint="土地代を除いた建物のみの取得費。消費税から逆算も可。"
                  value={inputs.buildingValue} onChange={set("buildingValue")} unit="万円" min={0} step={10}
                />
                <SelectField
                  label="建物の構造"
                  hint="登記簿謄本や売買契約書で確認できます。"
                  value={inputs.structure}
                  onChange={set("structure") as (v: string) => void}
                  options={Object.keys(LEGAL_LIFE)}
                />
                <NumField
                  label="取得時の築年数"
                  hint="中古物件の場合、取得時点での築年数を入力してください。"
                  value={inputs.buildingAge} onChange={set("buildingAge")} unit="年" min={0} max={99} step={1}
                />

                {/* 減価償却の計算結果表示 */}
                <div className="bg-blue-50 rounded-lg p-3 text-xs space-y-1">
                  <div className="flex justify-between">
                    <span className="text-gray-600">法定耐用年数</span>
                    <span className="font-semibold text-gray-800">{LEGAL_LIFE[inputs.structure]}年</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">適用耐用年数（中古）</span>
                    <span className="font-semibold text-gray-800">{results.usefulLife}年</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">定額法償却率</span>
                    <span className="font-semibold text-gray-800">{results.deprRate.toFixed(3)}</span>
                  </div>
                  <div className="flex justify-between border-t border-blue-200 pt-1 mt-1">
                    <span className="text-blue-700 font-bold">年間減価償却費</span>
                    <span className="text-blue-700 font-bold">{man(results.depreciation)}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* 給与所得 */}
            <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm">
              <SectionTitle>④ 給与所得（損益通算用）</SectionTitle>
              <div className="space-y-4">
                <NumField
                  label="給与収入（年収）"
                  hint="源泉徴収票の「支払金額」を入力。給与所得控除は自動計算します。"
                  value={inputs.salary} onChange={set("salary")} unit="万円/年" min={0} step={10}
                />
                <div className="bg-gray-50 rounded-lg p-3 text-xs">
                  <div className="flex justify-between">
                    <span className="text-gray-600">給与所得控除</span>
                    <span className="font-semibold">{man(salaryDeduction(inputs.salary))}</span>
                  </div>
                  <div className="flex justify-between mt-1">
                    <span className="text-gray-600">給与所得</span>
                    <span className="font-semibold">{man(results.salaryIncome)}</span>
                  </div>
                </div>
              </div>
            </div>

            <button
              onClick={() => setInputs(DEFAULTS)}
              className="flex items-center gap-2 text-xs text-gray-500 hover:text-gray-700 transition-colors"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              初期値に戻す
            </button>
          </div>

          {/* ===== 結果パネル ===== */}
          <div className="space-y-5">

            {/* 不動産所得の計算 */}
            <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm">
              <SectionTitle>不動産所得の計算</SectionTitle>
              <ResultRow label="年間家賃収入" value={man(results.rent)} />
              <ResultRow label="　固定資産税・都市計画税" value={`－${man(results.propTax)}`} />
              <ResultRow label="　管理費・修繕積立金" value={`－${man(results.mgmt)}`} />
              <ResultRow label="　ローン利息" value={`－${man(results.interest)}`} />
              <ResultRow label="　減価償却費" value={`－${man(results.depreciation)}`} />
              <ResultRow label="　その他経費" value={`－${man(results.other)}`} />
              <ResultRow label="経費合計" value={man(results.totalExpenses)} />
              <ResultRow
                label="不動産所得"
                value={man(results.realEstateIncome)}
                sub={results.realEstateIncome < 0 ? "赤字→損益通算の可能性あり" : "黒字"}
                highlight={results.realEstateIncome < 0 ? "green" : "blue"}
              />
            </div>

            {/* 課税所得の比較 */}
            <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm">
              <SectionTitle>課税所得と税負担の比較</SectionTitle>
              <div className="grid grid-cols-2 gap-3 mb-3">
                <div className="bg-gray-50 rounded-lg p-3 text-center">
                  <p className="text-xs text-gray-500 mb-1">不動産なし（参考）</p>
                  <p className="text-sm font-bold text-gray-800">{man(Math.max(0, results.salaryIncome - 480_000))}</p>
                  <p className="text-xs text-gray-400">課税所得</p>
                </div>
                <div className={`rounded-lg p-3 text-center ${results.taxSaving > 0 ? "bg-emerald-50" : "bg-blue-50"}`}>
                  <p className="text-xs text-gray-500 mb-1">不動産所得を加算後</p>
                  <p className={`text-sm font-bold ${results.taxSaving > 0 ? "text-emerald-700" : "text-blue-700"}`}>
                    {man(results.taxableWith)}
                  </p>
                  <p className="text-xs text-gray-400">課税所得</p>
                </div>
              </div>

              <div className="space-y-0">
                <ResultRow label="所得税（不動産なし参考）" value={man(calcIncomeTax(Math.max(0, results.salaryIncome - 480_000)))} />
                <ResultRow label="所得税（不動産所得加算後）" value={man(results.incomeTaxWith)} />
                <ResultRow label="住民税（不動産なし参考）" value={man(calcResidentTax(Math.max(0, results.salaryIncome - 480_000)))} />
                <ResultRow label="住民税（不動産所得加算後）" value={man(results.residentTaxWith)} />
                <ResultRow
                  label="合計税負担（不動産所得加算後）"
                  value={man(results.totalTaxWith)}
                  highlight="blue"
                />
              </div>
            </div>

            {/* 節税効果 */}
            <div className={`rounded-xl p-5 shadow-sm border ${results.taxSaving > 0 ? "bg-emerald-50 border-emerald-200" : results.taxSaving < 0 ? "bg-red-50 border-red-200" : "bg-gray-50 border-gray-200"}`}>
              <SectionTitle>
                {results.taxSaving > 0 ? "節税効果（概算）" : results.taxSaving < 0 ? "税負担増（概算）" : "税負担の変化"}
              </SectionTitle>
              <div className="text-center py-3">
                <p className={`text-3xl font-bold ${results.taxSaving > 0 ? "text-emerald-600" : results.taxSaving < 0 ? "text-red-600" : "text-gray-500"}`}>
                  {results.taxSaving > 0 ? "▼ " : results.taxSaving < 0 ? "▲ " : ""}{man(Math.abs(results.taxSaving))}
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  {results.taxSaving > 0
                    ? "不動産所得（赤字）の損益通算による節税効果"
                    : results.taxSaving < 0
                    ? "不動産所得（黒字）による税負担増"
                    : "税負担の変化なし"}
                </p>
              </div>
              {results.realEstateIncome < 0 && (
                <p className="text-xs text-gray-600 leading-relaxed mt-2 border-t border-emerald-200 pt-3">
                  不動産所得が赤字（主に減価償却・ローン利息の影響）の場合、給与所得と損益通算することで所得税・住民税を軽減できます。ただし土地取得に係る借入金利子は損益通算の対象外となる場合があります。
                </p>
              )}
              {results.realEstateIncome >= 0 && (
                <p className="text-xs text-gray-600 leading-relaxed mt-2 border-t border-blue-200 pt-3">
                  不動産所得が黒字の場合、給与所得に合算されて税負担が増えます。経費の計上漏れがないか確認しましょう。
                </p>
              )}
            </div>

            {/* LINE CTA */}
            <a
              href="https://lin.ee/QY17l0C"
              target="_blank"
              rel="noopener noreferrer"
              className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-green-500 hover:bg-green-600 transition-colors rounded-xl px-5 py-4 shadow-sm"
            >
              <div className="flex items-center gap-3">
                <div className="bg-white rounded-xl p-2 shrink-0">
                  <svg viewBox="0 0 24 24" className="w-7 h-7" fill="#06C755">
                    <path d="M12 2C6.48 2 2 6.03 2 11c0 3.19 1.73 6.01 4.38 7.77-.19.71-.69 2.58-.79 2.98-.12.5.18.49.38.36.16-.11 2.06-1.39 2.9-1.96.69.1 1.4.15 2.13.15 5.52 0 10-4.03 10-9S17.52 2 12 2zm-4 12.5H6.5V9H8v5.5zm1.5 0V9H11v3.75L13.25 9H15v5.5h-1.5V10.75L11.25 14.5H9.5zm8 0H16v-2.25L13.75 14.5H12v-5.5h1.5v3.75L15.75 9H18v5.5z"/>
                  </svg>
                </div>
                <div>
                  <p className="text-white font-bold text-sm leading-snug">試算結果について税理士に相談する</p>
                  <p className="text-green-100 text-xs mt-0.5">川口哲也税理士事務所の公式LINEから無料相談</p>
                </div>
              </div>
              <div className="shrink-0 bg-white text-green-600 font-bold text-sm px-4 py-2 rounded-lg whitespace-nowrap">
                LINEで無料相談 →
              </div>
            </a>
          </div>
        </div>

        <footer className="mt-10 border-t border-gray-200 pt-6 flex flex-wrap gap-4 text-xs text-gray-500">
          <Link href="/" className="hover:text-gray-800 transition-colors">投資シミュレーター</Link>
          <Link href="/articles" className="hover:text-gray-800 transition-colors">コラム記事一覧</Link>
          <Link href="/about" className="hover:text-gray-800 transition-colors">運営者情報</Link>
          <Link href="/contact" className="hover:text-gray-800 transition-colors">お問い合わせ</Link>
          <Link href="/privacy-policy" className="hover:text-gray-800 transition-colors">プライバシーポリシー</Link>
        </footer>
      </main>
    </div>
  );
}

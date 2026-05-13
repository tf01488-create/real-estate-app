"use client";

import { useState, useMemo, useEffect } from "react";
import Link from "next/link";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  ReferenceLine,
} from "recharts";
import {
  Building2,
  TrendingUp,
  TrendingDown,
  CalendarDays,
  BarChart2,
  Settings,
  AlertTriangle,
  RotateCcw,
  ChevronDown,
  Info,
} from "lucide-react";

interface Inputs {
  propertyPrice: number;
  downPayment: number;
  closingCostRate: number;
  loanRate: number;
  loanYears: number;
  monthlyRent: number;
  vacancyRate: number;
  managementFee: number;
  repairCost: number;
  propertyTax: number;
  otherCosts: number;
  rentDeclineRate: number;
  saleYear: number;
  salePrice: number;
}

function InputField({
  label,
  description,
  value,
  onChange,
  onPresetClick,
  unit,
  min = 0,
  max,
  step = 0.1,
  presets,
}: {
  label: string;
  description?: string;
  value: string | number;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onPresetClick: (v: number) => void;
  unit: string;
  min?: number;
  max?: number;
  step?: number;
  presets?: number[];
}) {
  return (
    <div className="flex flex-col gap-1">
      <label className="text-xs font-medium text-blue-200">{label}</label>
      {description && (
        <p className="text-xs text-blue-400 leading-tight">{description}</p>
      )}
      <div className="flex items-center gap-1 border border-blue-700 rounded-lg px-2 py-1.5 bg-blue-900 focus-within:border-blue-400 focus-within:ring-1 focus-within:ring-blue-500 transition">
        <input
          type="number"
          value={value}
          onChange={onChange}
          min={min}
          max={max}
          step={step}
          className="w-full text-sm text-right outline-none bg-transparent text-white"
        />
        <span className="text-xs text-blue-400 whitespace-nowrap">{unit}</span>
      </div>
      {presets && (
        <div className="flex gap-1 flex-wrap mt-0.5">
          {presets.map((p) => (
            <button
              key={p}
              type="button"
              onClick={() => onPresetClick(p)}
              className={`text-xs px-2 py-0.5 rounded-full border transition-colors ${
                value === p
                  ? "bg-blue-500 border-blue-400 text-white font-semibold"
                  : "bg-blue-900 border-blue-700 text-blue-300 hover:bg-blue-700 hover:border-blue-500 hover:text-blue-100"
              }`}
            >
              {p}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

function formatManYen(value: number) {
  if (Math.abs(value) >= 10000) {
    return `${(value / 10000).toFixed(1)}億円`;
  }
  return `${value.toFixed(0)}万円`;
}

function calcMonthlyPayment(principal: number, annualRate: number, years: number) {
  if (annualRate === 0) return principal / (years * 12);
  const r = annualRate / 100 / 12;
  const n = years * 12;
  return (principal * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
}

const DEFAULT_INPUTS: Inputs = {
  propertyPrice: 3000,
  downPayment: 600,
  closingCostRate: 6,
  loanRate: 1.5,
  loanYears: 30,
  monthlyRent: 15,
  vacancyRate: 5,
  managementFee: 5,
  repairCost: 1,
  propertyTax: 10,
  otherCosts: 3,
  rentDeclineRate: 0.5,
  saleYear: 20,
  salePrice: 2400,
};

export default function Home() {
  const [inputs, setInputs] = useState<Inputs>(() => {
    try {
      const saved = sessionStorage.getItem("sim_inputs");
      return saved ? { ...DEFAULT_INPUTS, ...JSON.parse(saved) } : DEFAULT_INPUTS;
    } catch { return DEFAULT_INPUTS; }
  });
  const [rawValues, setRawValues] = useState<Record<keyof Inputs, string>>(() => {
    try {
      const saved = sessionStorage.getItem("sim_inputs");
      const merged = saved ? { ...DEFAULT_INPUTS, ...JSON.parse(saved) } : DEFAULT_INPUTS;
      return Object.fromEntries(Object.entries(merged).map(([k, v]) => [k, String(v)])) as Record<keyof Inputs, string>;
    } catch {
      return Object.fromEntries(Object.entries(DEFAULT_INPUTS).map(([k, v]) => [k, String(v)])) as Record<keyof Inputs, string>;
    }
  });

  const [activeTab, setActiveTab] = useState<"cashflow" | "cumulative" | "balance">("cashflow");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [infoOpen, setInfoOpen] = useState(false);
  const [saleEnabled, setSaleEnabled] = useState(() => {
    try { return sessionStorage.getItem("sim_sale_enabled") === "true"; } catch { return false; }
  });

  useEffect(() => {
    try { sessionStorage.setItem("sim_inputs", JSON.stringify(inputs)); } catch {}
  }, [inputs]);

  useEffect(() => {
    try { sessionStorage.setItem("sim_sale_enabled", String(saleEnabled)); } catch {}
  }, [saleEnabled]);

  const set = (key: keyof Inputs) => (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value;
    setRawValues((prev) => ({ ...prev, [key]: raw }));
    const v = parseFloat(raw);
    if (!isNaN(v)) setInputs((prev) => ({ ...prev, [key]: v }));
  };

  const preset = (key: keyof Inputs) => (v: number) => {
    setInputs((prev) => ({ ...prev, [key]: v }));
    setRawValues((prev) => ({ ...prev, [key]: String(v) }));
  };

  const handleReset = () => {
    setInputs(DEFAULT_INPUTS);
    setRawValues(Object.fromEntries(Object.entries(DEFAULT_INPUTS).map(([k, v]) => [k, String(v)])) as Record<keyof Inputs, string>);
    setSaleEnabled(false);
  };

  const validationErrors = useMemo(() => {
    const errors: string[] = [];
    if (inputs.propertyPrice <= 0) errors.push("物件価格を入力してください。");
    if (inputs.downPayment > inputs.propertyPrice) errors.push("頭金が物件価格を超えています。");
    if (inputs.monthlyRent <= 0) errors.push("月額家賃を入力してください。");
    if (inputs.loanYears <= 0) errors.push("返済期間を入力してください。");
    return errors;
  }, [inputs]);

  const results = useMemo(() => {
    const loanAmount = inputs.propertyPrice - inputs.downPayment;
    const monthlyPayment = calcMonthlyPayment(loanAmount, inputs.loanRate, inputs.loanYears);
    const closingCosts = Math.round(inputs.propertyPrice * (inputs.closingCostRate / 100) * 10) / 10;

    let remainingLoan = loanAmount;
    let cumulativeCashflow = -(inputs.downPayment + closingCosts);
    const data = [];

    for (let year = 1; year <= 35; year++) {
      const rentDecay = Math.pow(1 - inputs.rentDeclineRate / 100, year - 1);
      const grossRent =
        inputs.monthlyRent * 12 * rentDecay * (1 - inputs.vacancyRate / 100);
      const managementFeeAmt = grossRent * (inputs.managementFee / 100);
      const repairCostAmt = inputs.repairCost * (inputs.propertyPrice / 100);
      const totalExpenses =
        managementFeeAmt +
        repairCostAmt +
        inputs.propertyTax +
        inputs.otherCosts;

      const noiBeforeLoan = grossRent - totalExpenses;

      const annualPayment = year <= inputs.loanYears ? monthlyPayment * 12 : 0;

      if (year <= inputs.loanYears) {
        const r = inputs.loanRate / 100 / 12;
        let bal = remainingLoan;
        for (let m = 0; m < 12; m++) {
          const interestM = bal * r;
          const principalM = monthlyPayment - interestM;
          bal -= principalM;
        }
        remainingLoan = bal > 0 ? bal : 0;
      } else {
        remainingLoan = 0;
      }

      const annualCashflow = noiBeforeLoan - annualPayment;
      cumulativeCashflow += annualCashflow;

      const yieldRate = (noiBeforeLoan / inputs.propertyPrice) * 100;
      const cashOnCash =
        inputs.downPayment > 0 ? (annualCashflow / inputs.downPayment) * 100 : 0;

      data.push({
        year: `${year}年目`,
        grossRent: Math.round(grossRent * 10) / 10,
        totalExpenses: Math.round(totalExpenses * 10) / 10,
        noiBeforeLoan: Math.round(noiBeforeLoan * 10) / 10,
        loanRepayment: Math.round(annualPayment * 10) / 10,
        annualCashflow: Math.round(annualCashflow * 10) / 10,
        cumulativeCashflow: Math.round(cumulativeCashflow * 10) / 10,
        remainingLoan: Math.round((remainingLoan > 0 ? remainingLoan : 0) * 10) / 10,
        yieldRate: Math.round(yieldRate * 100) / 100,
        cashOnCash: Math.round(cashOnCash * 100) / 100,
      });
    }

    const monthlyPaymentMan = Math.round(monthlyPayment * 10) / 10;
    const firstYearGrossRent = data[0].grossRent;
    const grossYield = (firstYearGrossRent / inputs.propertyPrice) * 100;
    const netYield = data[0].yieldRate;
    const firstYearCashflow = data[0].annualCashflow;
    const breakEvenIndex = data.findIndex((d) => d.cumulativeCashflow >= 0);

    const saleIdx = Math.min(inputs.saleYear, 35) - 1;
    const saleRow = data[saleIdx];
    const saleNetProceeds = inputs.salePrice - saleRow.remainingLoan;
    const saleTotalReturn = saleRow.cumulativeCashflow + saleNetProceeds;

    return { data, monthlyPaymentMan, grossYield, netYield, firstYearCashflow, loanAmount, breakEvenIndex, saleIdx, saleRow, saleNetProceeds, saleTotalReturn, closingCosts };
  }, [inputs]);

  const summaryCards = [
    {
      label: "損益分岐",
      value: results.breakEvenIndex >= 0 ? `${results.breakEvenIndex + 1}年目` : "35年超",
      icon: CalendarDays,
      color: results.breakEvenIndex >= 0 ? "text-blue-400" : "text-slate-400",
      bg: results.breakEvenIndex >= 0 ? "bg-blue-900/60" : "bg-slate-800",
    },
    {
      label: "表面利回り",
      value: `${results.grossYield.toFixed(2)}%`,
      icon: BarChart2,
      color: "text-green-400",
      bg: "bg-green-900/60",
    },
    {
      label: "実質利回り",
      value: `${results.netYield.toFixed(2)}%`,
      icon: TrendingUp,
      color: "text-emerald-400",
      bg: "bg-emerald-900/60",
    },
    {
      label: "初年度CF",
      value: `${results.firstYearCashflow.toFixed(1)}万円`,
      icon: results.firstYearCashflow >= 0 ? TrendingUp : TrendingDown,
      color: results.firstYearCashflow >= 0 ? "text-emerald-400" : "text-red-400",
      bg: results.firstYearCashflow >= 0 ? "bg-emerald-900/60" : "bg-red-900/60",
    },
    ...(saleEnabled ? [{
      label: `売却時総収益 (${inputs.saleYear}年目)`,
      value: formatManYen(results.saleTotalReturn),
      icon: results.saleTotalReturn >= 0 ? TrendingUp : TrendingDown,
      color: results.saleTotalReturn >= 0 ? "text-yellow-400" : "text-red-400",
      bg: results.saleTotalReturn >= 0 ? "bg-yellow-900/60" : "bg-red-900/60",
    }] : []),
  ];

  const tabs = [
    { key: "cashflow" as const, label: "年次収支" },
    { key: "cumulative" as const, label: "累積収支" },
    { key: "balance" as const, label: "残債推移" },
  ];

  return (
    <div className="min-h-screen bg-slate-900">
      {/* Header */}
      <header className="bg-blue-950 border-b border-blue-800 px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center gap-3">
          <div className="p-2 bg-blue-500 rounded-lg">
            <Building2 className="w-5 h-5 text-white" />
          </div>
          <div className="flex-1">
            <h1 className="text-lg font-bold text-white">不動産投資　簡易シミュレーション</h1>
            <p className="text-xs text-blue-300">35年間のキャッシュフローを分析</p>
          </div>
          <Link
            href="/articles"
            className="text-xs text-blue-300 hover:text-blue-100 border border-blue-700 hover:border-blue-500 px-3 py-1.5 rounded-lg transition-colors whitespace-nowrap"
          >
            コラム記事
          </Link>
        </div>
      </header>

      {/* Info Banner */}
      <div className="bg-blue-900/40 border-b border-blue-800">
        <div className="max-w-7xl mx-auto px-4">
          <button
            type="button"
            onClick={() => setInfoOpen((v) => !v)}
            className="w-full flex items-center gap-2 py-3 text-sm text-blue-300 hover:text-blue-100 transition-colors"
          >
            <Info className="w-4 h-4 shrink-0" />
            <span className="font-medium">このシミュレーターでできること</span>
            <ChevronDown className={`w-4 h-4 ml-auto transition-transform duration-200 ${infoOpen ? "rotate-180" : ""}`} />
          </button>
          {infoOpen && (
            <div className="pb-4 grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs text-blue-200">
              <div className="bg-blue-900/60 rounded-lg p-3 flex gap-2">
                <BarChart2 className="w-4 h-4 text-blue-400 shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold text-blue-100 mb-0.5">収支を35年間シミュレーション</p>
                  <p className="text-blue-300">物件価格・ローン・家賃・各種費用を入力すると、年次のキャッシュフローと累積収支を自動で試算します。</p>
                </div>
              </div>
              <div className="bg-blue-900/60 rounded-lg p-3 flex gap-2">
                <TrendingUp className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold text-blue-100 mb-0.5">利回りと損益分岐を即確認</p>
                  <p className="text-blue-300">表面・実質利回り、損益分岐年を自動計算。数値を変えながら条件の違いをすぐに比較できます。</p>
                </div>
              </div>
              <div className="bg-blue-900/60 rounded-lg p-3 flex gap-2">
                <CalendarDays className="w-4 h-4 text-yellow-400 shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold text-blue-100 mb-0.5">売却シナリオも試算</p>
                  <p className="text-blue-300">「何年目にいくらで売るか」を設定すると、運用収益と売却益を合算した総収益を確認できます。</p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-6 flex flex-col lg:flex-row gap-6">
        {/* Sidebar Inputs */}
        <aside className="w-full lg:w-72 flex-shrink-0">
          <div className="bg-blue-950 rounded-xl border border-blue-800 overflow-hidden">
            <div className="px-4 py-3 bg-blue-900 border-b border-blue-800 flex items-center gap-2">
              <Settings className="w-4 h-4 text-blue-300" />
              <span className="text-sm font-semibold text-blue-100 flex-1">物件・ローン設定</span>
              <button
                type="button"
                onClick={handleReset}
                className="flex items-center gap-1 text-xs text-blue-400 hover:text-blue-200 transition-colors px-2 py-1 rounded-md hover:bg-blue-800"
                title="デフォルト値にリセット"
              >
                <RotateCcw className="w-3 h-3" />
                リセット
              </button>
              <button
                type="button"
                onClick={() => setSidebarOpen((v) => !v)}
                className="lg:hidden flex items-center justify-center p-1 rounded-md text-blue-400 hover:text-blue-200 hover:bg-blue-800 transition-colors"
                aria-label="設定を開閉"
              >
                <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${sidebarOpen ? "rotate-180" : ""}`} />
              </button>
            </div>
            <div className={`p-4 grid grid-cols-2 lg:grid-cols-1 gap-4 lg:overflow-y-auto lg:max-h-[calc(100vh-200px)] ${sidebarOpen ? "grid" : "hidden"} lg:grid`}>
              <InputField
                label="物件価格"
                description="購入総額（諸費用込みが理想）"
                value={rawValues.propertyPrice}
                onChange={set("propertyPrice")}
                onPresetClick={preset("propertyPrice")}
                unit="万円"
                step={50}
                presets={[500, 1000, 2000, 3000, 5000, 8000]}
              />
              <InputField
                label="頭金"
                description="自己資金での初期支払い分"
                value={rawValues.downPayment}
                onChange={set("downPayment")}
                onPresetClick={preset("downPayment")}
                unit="万円"
                step={50}
                presets={[0, 100, 300, 500, 1000]}
              />
              <InputField
                label="購入時諸費用率"
                description="仲介手数料・登記費用・ローン手数料などの合計（物件価格の5〜8%が目安）"
                value={rawValues.closingCostRate}
                onChange={set("closingCostRate")}
                onPresetClick={preset("closingCostRate")}
                unit="%"
                step={0.5}
                max={15}
                presets={[5, 6, 7, 8]}
              />
              <InputField
                label="ローン金利"
                description="年利率（変動は現在1%台前半が多い）"
                value={rawValues.loanRate}
                onChange={set("loanRate")}
                onPresetClick={preset("loanRate")}
                unit="%"
                step={0.05}
                max={15}
                presets={[0.5, 1.0, 1.5, 2.0, 3.0]}
              />
              <InputField
                label="返済期間"
                description="ローン完済まで（最長35年）"
                value={rawValues.loanYears}
                onChange={set("loanYears")}
                onPresetClick={preset("loanYears")}
                unit="年"
                step={1}
                max={35}
                presets={[15, 20, 25, 30, 35]}
              />
              <div className="col-span-2 lg:col-span-1 pt-1 border-t border-blue-800">
                <p className="text-xs text-blue-400 font-medium">収入・費用</p>
              </div>
              <InputField
                label="月額家賃"
                description="満室時の月額賃料収入"
                value={rawValues.monthlyRent}
                onChange={set("monthlyRent")}
                onPresetClick={preset("monthlyRent")}
                unit="万円"
                step={0.5}
                presets={[5, 8, 10, 12, 15, 20]}
              />
              <InputField
                label="空室率"
                description="年間で空室になる期間の割合"
                value={rawValues.vacancyRate}
                onChange={set("vacancyRate")}
                onPresetClick={preset("vacancyRate")}
                unit="%"
                step={1}
                max={100}
                presets={[3, 5, 8, 10, 15]}
              />
              <InputField
                label="管理費率"
                description="賃料収入に対する管理会社手数料（5〜10%が一般的）"
                value={rawValues.managementFee}
                onChange={set("managementFee")}
                onPresetClick={preset("managementFee")}
                unit="%"
                step={0.5}
                max={30}
                presets={[3, 5, 7, 10]}
              />
              <InputField
                label="修繕費率"
                description="物件価格に対する年間修繕費（老朽化に備えて積立）"
                value={rawValues.repairCost}
                onChange={set("repairCost")}
                onPresetClick={preset("repairCost")}
                unit="%/年"
                step={0.1}
                max={5}
                presets={[0.5, 1.0, 1.5, 2.0]}
              />
              <InputField
                label="固定資産税"
                description="年間の固定資産税＋都市計画税の合計"
                value={rawValues.propertyTax}
                onChange={set("propertyTax")}
                onPresetClick={preset("propertyTax")}
                unit="万円/年"
                step={1}
                presets={[5, 10, 15, 20]}
              />
              <InputField
                label="その他費用"
                description="火災保険・管理組合費・雑費などの年間合計"
                value={rawValues.otherCosts}
                onChange={set("otherCosts")}
                onPresetClick={preset("otherCosts")}
                unit="万円/年"
                step={0.5}
                presets={[0, 1, 3, 5]}
              />
              <InputField
                label="家賃下落率"
                description="経年による年間賃料の下落率（築古で0.3〜1%が目安）"
                value={rawValues.rentDeclineRate}
                onChange={set("rentDeclineRate")}
                onPresetClick={preset("rentDeclineRate")}
                unit="%/年"
                step={0.1}
                max={5}
                presets={[0, 0.3, 0.5, 1.0]}
              />
              <div className="col-span-2 lg:col-span-1 pt-1 border-t border-blue-800 flex items-center justify-between">
                <p className="text-xs text-blue-400 font-medium">売却シナリオ</p>
                <button
                  type="button"
                  onClick={() => setSaleEnabled((v) => !v)}
                  className={`relative inline-flex h-5 w-9 shrink-0 rounded-full border-2 border-transparent transition-colors duration-200 focus:outline-none ${saleEnabled ? "bg-blue-500" : "bg-blue-800"}`}
                  role="switch"
                  aria-checked={saleEnabled}
                >
                  <span className={`inline-block h-4 w-4 rounded-full bg-white shadow transition-transform duration-200 ${saleEnabled ? "translate-x-4" : "translate-x-0"}`} />
                </button>
              </div>
              {saleEnabled && (
                <>
                  <InputField
                    label="売却タイミング"
                    description="何年目に売却するか想定"
                    value={rawValues.saleYear}
                    onChange={set("saleYear")}
                    onPresetClick={preset("saleYear")}
                    unit="年目"
                    step={1}
                    min={1}
                    max={35}
                    presets={[5, 10, 15, 20, 25, 30]}
                  />
                  <InputField
                    label="売却想定価格"
                    description="売却時の想定売却価格"
                    value={rawValues.salePrice}
                    onChange={set("salePrice")}
                    onPresetClick={preset("salePrice")}
                    unit="万円"
                    step={50}
                    presets={[]}
                  />
                </>
              )}
            </div>
          </div>

          {/* Loan Info */}
          <div className="mt-3 bg-blue-900 border border-blue-700 rounded-xl p-4 text-sm">
            <p className="font-semibold text-blue-100 mb-2">初期費用・ローン概要</p>
            <div className="space-y-1 text-blue-200 text-xs">
              <div className="flex justify-between">
                <span>購入時諸費用</span>
                <span className="font-medium text-orange-300">{results.closingCosts.toFixed(0)}万円</span>
              </div>
              <div className="flex justify-between">
                <span>初期支出合計</span>
                <span className="font-medium text-orange-300">{(inputs.downPayment + results.closingCosts).toFixed(0)}万円</span>
              </div>
              <div className="border-t border-blue-700 pt-1 mt-1">
                <div className="flex justify-between">
                  <span>借入額</span>
                  <span className="font-medium">{formatManYen(results.loanAmount)}</span>
                </div>
              </div>
              <div className="flex justify-between">
                <span>月返済額</span>
                <span className="font-medium">{results.monthlyPaymentMan.toFixed(1)}万円</span>
              </div>
              <div className="flex justify-between">
                <span>年返済額</span>
                <span className="font-medium">{(results.monthlyPaymentMan * 12).toFixed(1)}万円</span>
              </div>
            </div>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 min-w-0 flex flex-col gap-5">
          {/* Validation Errors */}
          {validationErrors.length > 0 && (
            <div className="bg-red-900/40 border border-red-700 rounded-xl p-3 flex flex-col gap-1.5">
              {validationErrors.map((msg, i) => (
                <p key={i} className="text-xs text-red-300 flex items-center gap-2">
                  <AlertTriangle className="w-3.5 h-3.5 text-red-400 shrink-0" />
                  {msg}
                </p>
              ))}
            </div>
          )}

          {/* Summary Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
            {summaryCards.map((card) => (
              <div
                key={card.label}
                className="bg-blue-950 rounded-xl border border-blue-800 p-4"
              >
                <div className={`inline-flex p-1.5 rounded-lg ${card.bg} mb-2`}>
                  <card.icon className={`w-4 h-4 ${card.color}`} />
                </div>
                <p className="text-xs text-blue-300">{card.label}</p>
                <p className={`text-lg font-bold mt-0.5 ${card.color}`}>{card.value}</p>
              </div>
            ))}
          </div>

          {/* Charts */}
          <div className="bg-blue-950 rounded-xl border border-blue-800 overflow-hidden">
            <div className="flex border-b border-blue-800">
              {tabs.map((tab) => (
                <button
                  key={tab.key}
                  onClick={() => setActiveTab(tab.key)}
                  className={`px-5 py-3 text-sm font-medium transition-colors ${
                    activeTab === tab.key
                      ? "border-b-2 border-blue-400 text-blue-300 bg-blue-900/50"
                      : "text-blue-400 hover:text-blue-200 hover:bg-blue-900"
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            <div className="p-4">
              {activeTab === "cashflow" && (
                <>
                  <p className="text-xs text-blue-400 mb-4">収入・費用・キャッシュフローの年次推移（万円）</p>
                  <ResponsiveContainer width="100%" height={320}>
                    <BarChart data={results.data} margin={{ top: 5, right: 10, left: 0, bottom: 5 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#1e3a5f" />
                      <XAxis dataKey="year" tick={{ fontSize: 11, fill: "#93c5fd" }} interval={4} />
                      <YAxis tick={{ fontSize: 11, fill: "#93c5fd" }} />
                      <Tooltip
                        formatter={(value, name) => [typeof value === "number" ? `${value.toFixed(1)}万円` : value, name]}
                        contentStyle={{ fontSize: 12, backgroundColor: "#1e3a5f", border: "1px solid #2563eb", color: "#e0f2fe" }}
                      />
                      <Legend wrapperStyle={{ fontSize: 12, color: "#93c5fd" }} />
                      <ReferenceLine y={0} stroke="#4b6a8f" strokeDasharray="4 2" />
                      <Bar dataKey="grossRent" name="総収入" fill="#60a5fa" radius={[2, 2, 0, 0]} />
                      <Bar dataKey="totalExpenses" name="運営費" fill="#f97316" radius={[2, 2, 0, 0]} />
                      <Bar dataKey="loanRepayment" name="ローン返済" fill="#8b5cf6" radius={[2, 2, 0, 0]} />
                      <Line
                        type="monotone"
                        dataKey="annualCashflow"
                        name="CF"
                        stroke="#10b981"
                        strokeWidth={2}
                        dot={false}
                      />
                    </BarChart>
                  </ResponsiveContainer>
                </>
              )}

              {activeTab === "cumulative" && (
                <>
                  <p className="text-xs text-blue-400 mb-4">累積キャッシュフロー推移（頭金含む）（万円）</p>
                  <ResponsiveContainer width="100%" height={320}>
                    <LineChart data={results.data} margin={{ top: 5, right: 10, left: 0, bottom: 5 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#1e3a5f" />
                      <XAxis dataKey="year" tick={{ fontSize: 11, fill: "#93c5fd" }} interval={4} />
                      <YAxis tick={{ fontSize: 11, fill: "#93c5fd" }} />
                      <Tooltip
                        formatter={(value, name) => [typeof value === "number" ? `${value.toFixed(1)}万円` : value, name]}
                        contentStyle={{ fontSize: 12, backgroundColor: "#1e3a5f", border: "1px solid #2563eb", color: "#e0f2fe" }}
                      />
                      <Legend wrapperStyle={{ fontSize: 12, color: "#93c5fd" }} />
                      <ReferenceLine
                        y={0}
                        stroke="#4b6a8f"
                        strokeDasharray="4 2"
                        label={{ value: "損益分岐", position: "insideTopLeft", fontSize: 11, fill: "#93c5fd" }}
                      />
                      {saleEnabled && (
                        <ReferenceLine
                          x={`${inputs.saleYear}年目`}
                          stroke="#facc15"
                          strokeDasharray="4 2"
                          label={{ value: "売却", position: "insideTopRight", fontSize: 11, fill: "#facc15" }}
                        />
                      )}
                      <Line
                        type="monotone"
                        dataKey="cumulativeCashflow"
                        name="累積CF"
                        stroke="#60a5fa"
                        strokeWidth={2.5}
                        dot={false}
                        activeDot={{ r: 5 }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                  {/* Sale scenario summary */}
                  {saleEnabled && (
                    <div className="mt-4 bg-yellow-900/20 border border-yellow-700/50 rounded-lg p-3 grid grid-cols-3 gap-3 text-xs">
                      <div>
                        <p className="text-yellow-400 mb-0.5">売却益（税引前）</p>
                        <p className="text-white font-semibold">{formatManYen(results.saleNetProceeds)}</p>
                        <p className="text-yellow-600 mt-0.5">売却価格 − 残債</p>
                      </div>
                      <div>
                        <p className="text-yellow-400 mb-0.5">累積CF（売却時点）</p>
                        <p className={`font-semibold ${results.saleRow.cumulativeCashflow >= 0 ? "text-emerald-400" : "text-red-400"}`}>
                          {formatManYen(results.saleRow.cumulativeCashflow)}
                        </p>
                        <p className="text-yellow-600 mt-0.5">{inputs.saleYear}年間の運用CF合計</p>
                      </div>
                      <div>
                        <p className="text-yellow-400 mb-0.5">売却時総収益</p>
                        <p className={`font-semibold ${results.saleTotalReturn >= 0 ? "text-emerald-400" : "text-red-400"}`}>
                          {formatManYen(results.saleTotalReturn)}
                        </p>
                        <p className="text-yellow-600 mt-0.5">累積CF + 売却益</p>
                      </div>
                    </div>
                  )}
                </>
              )}

              {activeTab === "balance" && (
                <>
                  <p className="text-xs text-blue-400 mb-4">ローン残高推移（万円）</p>
                  <ResponsiveContainer width="100%" height={320}>
                    <LineChart data={results.data} margin={{ top: 5, right: 10, left: 0, bottom: 5 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#1e3a5f" />
                      <XAxis dataKey="year" tick={{ fontSize: 11, fill: "#93c5fd" }} interval={4} />
                      <YAxis tick={{ fontSize: 11, fill: "#93c5fd" }} />
                      <Tooltip
                        formatter={(value) => [typeof value === "number" ? `${value.toFixed(0)}万円` : value, "残債"]}
                        contentStyle={{ fontSize: 12, backgroundColor: "#1e3a5f", border: "1px solid #2563eb", color: "#e0f2fe" }}
                      />
                      <Legend wrapperStyle={{ fontSize: 12, color: "#93c5fd" }} />
                      <Line
                        type="monotone"
                        dataKey="remainingLoan"
                        name="ローン残高"
                        stroke="#8b5cf6"
                        strokeWidth={2.5}
                        dot={false}
                        activeDot={{ r: 5 }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </>
              )}
            </div>
          </div>

          {/* Table */}
          <div className="bg-blue-950 rounded-xl border border-blue-800 overflow-hidden">
            <div className="px-4 py-3 border-b border-blue-800">
              <p className="text-sm font-semibold text-blue-100">年次詳細データ（万円）</p>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-xs">
                <thead>
                  <tr className="bg-blue-900 text-blue-300 text-right">
                    <th className="px-3 py-2 text-left font-medium sticky left-0 bg-blue-900">年</th>
                    <th className="px-3 py-2 font-medium">総収入</th>
                    <th className="px-3 py-2 font-medium">運営費</th>
                    <th className="px-3 py-2 font-medium">NOI</th>
                    <th className="px-3 py-2 font-medium">返済額</th>
                    <th className="px-3 py-2 font-medium">年次CF</th>
                    <th className="px-3 py-2 font-medium">累積CF</th>
                    <th className="px-3 py-2 font-medium">残債</th>
                    <th className="px-3 py-2 font-medium">実質利回り</th>
                    <th className="px-3 py-2 font-medium">自己資金利回</th>
                  </tr>
                </thead>
                <tbody>
                  {results.data.map((row, i) => (
                    <tr
                      key={i}
                      className={`border-t border-blue-800 text-right ${
                        i % 2 === 0 ? "bg-blue-950" : "bg-blue-900/40"
                      }`}
                    >
                      <td className="px-3 py-2 text-left text-blue-200 sticky left-0 bg-inherit">{row.year}</td>
                      <td className="px-3 py-2 text-blue-100">{row.grossRent.toFixed(1)}</td>
                      <td className="px-3 py-2 text-orange-400">{row.totalExpenses.toFixed(1)}</td>
                      <td className="px-3 py-2 text-blue-300">{row.noiBeforeLoan.toFixed(1)}</td>
                      <td className="px-3 py-2 text-violet-400">{row.loanRepayment.toFixed(1)}</td>
                      <td
                        className={`px-3 py-2 font-semibold ${
                          row.annualCashflow >= 0 ? "text-emerald-400" : "text-red-400"
                        }`}
                      >
                        {row.annualCashflow.toFixed(1)}
                      </td>
                      <td
                        className={`px-3 py-2 font-semibold ${
                          row.cumulativeCashflow >= 0 ? "text-emerald-400" : "text-red-400"
                        }`}
                      >
                        {row.cumulativeCashflow.toFixed(1)}
                      </td>
                      <td className="px-3 py-2 text-blue-400">{row.remainingLoan.toFixed(0)}</td>
                      <td className="px-3 py-2 text-blue-400">{row.yieldRate.toFixed(2)}%</td>
                      <td
                        className={`px-3 py-2 ${
                          row.cashOnCash >= 0 ? "text-emerald-400" : "text-red-400"
                        }`}
                      >
                        {row.cashOnCash.toFixed(2)}%
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </main>
      </div>

      {/* Disclaimer */}
      <footer className="border-t border-blue-900 bg-slate-950 px-6 py-4 mt-4">
        <div className="max-w-7xl mx-auto">
          <p className="text-xs text-slate-500 leading-relaxed">
            【免責事項】本シミュレーターは不動産投資の参考情報を提供することを目的としており、投資助言・勧誘を行うものではありません。シミュレーション結果は入力値に基づく試算であり、将来の収益・損失を保証するものではありません。税制・金利・市況の変動により、実際の結果は大きく異なる場合があります。実際の投資判断は、税理士・ファイナンシャルプランナーなどの専門家にご相談のうえ、ご自身の責任においてお行いください。
          </p>
        </div>
      </footer>
    </div>
  );
}

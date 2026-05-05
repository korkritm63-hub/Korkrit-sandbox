"use client"
import { useState } from "react"
import { useComparison } from "@/hooks/useStockData"
import { ComparisonChart } from "@/components/charts/ComparisonChart"
import { PeriodSelector } from "@/components/ui/PeriodSelector"
import { ReturnsCard } from "@/components/cards/ReturnsCard"
import type { Period } from "@/types/stock"

const PRESET_SYMBOLS = [
  { label: "SET vs S&P500", symbols: ["^SET.BK", "^GSPC"] },
  { label: "PTT vs Exxon", symbols: ["PTT.BK", "XOM"] },
  { label: "KBANK vs JPM", symbols: ["KBANK.BK", "JPM"] },
  { label: "AOT vs DAL", symbols: ["AOT.BK", "DAL"] },
]

export default function ComparePage() {
  const [period, setPeriod] = useState<Period>("1y")
  const [symbols, setSymbols] = useState(["^SET.BK", "^GSPC"])
  const [normalized, setNormalized] = useState(true)
  const [input, setInput] = useState("")

  const { data, isLoading, error } = useComparison(symbols, period)

  function addSymbol() {
    const sym = input.trim().toUpperCase()
    if (sym && !symbols.includes(sym) && symbols.length < 5) {
      setSymbols([...symbols, sym])
    }
    setInput("")
  }

  function removeSymbol(sym: string) {
    if (symbols.length > 1) setSymbols(symbols.filter((s) => s !== sym))
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">เปรียบเทียบการลงทุน</h1>
        <p className="text-gray-500 mt-1 text-sm">เปรียบเทียบผลตอบแทนของหุ้นและดัชนีต่างๆ</p>
      </div>

      {/* Controls */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5 space-y-4">
        {/* Presets */}
        <div>
          <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-2">ชุดเปรียบเทียบสำเร็จรูป</p>
          <div className="flex flex-wrap gap-2">
            {PRESET_SYMBOLS.map((p) => (
              <button
                key={p.label}
                onClick={() => setSymbols(p.symbols)}
                className={`px-3 py-1.5 rounded-lg text-sm border transition-colors ${
                  JSON.stringify(symbols) === JSON.stringify(p.symbols)
                    ? "bg-blue-600 text-white border-blue-600"
                    : "bg-white text-gray-700 border-gray-200 hover:border-blue-300"
                }`}
              >
                {p.label}
              </button>
            ))}
          </div>
        </div>

        {/* Symbol chips */}
        <div>
          <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-2">สัญลักษณ์ที่เลือก</p>
          <div className="flex flex-wrap gap-2">
            {symbols.map((s) => (
              <span
                key={s}
                className="flex items-center gap-1.5 px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-sm font-medium"
              >
                {s}
                <button onClick={() => removeSymbol(s)} className="hover:text-red-500 text-blue-400">×</button>
              </span>
            ))}
          </div>
        </div>

        {/* Add symbol */}
        <div className="flex gap-2">
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && addSymbol()}
            placeholder="เพิ่ม symbol เช่น AAPL, SCB.BK..."
            className="flex-1 border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-300"
          />
          <button
            onClick={addSymbol}
            disabled={symbols.length >= 5}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 disabled:opacity-40"
          >
            เพิ่ม
          </button>
        </div>

        {/* Period + view toggle */}
        <div className="flex items-center justify-between flex-wrap gap-3">
          <PeriodSelector value={period} onChange={setPeriod} />
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-500">มุมมอง:</span>
            <button
              onClick={() => setNormalized(true)}
              className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${
                normalized ? "bg-blue-600 text-white" : "bg-gray-100 text-gray-600"
              }`}
            >
              Normalized (base 100)
            </button>
            <button
              onClick={() => setNormalized(false)}
              className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${
                !normalized ? "bg-blue-600 text-white" : "bg-gray-100 text-gray-600"
              }`}
            >
              ราคาจริง
            </button>
          </div>
        </div>
      </div>

      {/* Chart */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5">
        {isLoading && (
          <div className="h-80 flex items-center justify-center text-gray-400">กำลังโหลด...</div>
        )}
        {error && (
          <div className="h-80 flex items-center justify-center text-red-400 text-sm">
            ไม่สามารถโหลดข้อมูลได้
          </div>
        )}
        {data && <ComparisonChart series={data.series} normalized={normalized} />}
      </div>

      {/* Returns comparison table */}
      {data && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {data.series.map((s) => (
            <ReturnsCard key={s.symbol} returns={s.returns} title={`${s.name} (${s.symbol})`} />
          ))}
        </div>
      )}
    </div>
  )
}

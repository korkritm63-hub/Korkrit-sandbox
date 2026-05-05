"use client"
import { useState } from "react"
import Link from "next/link"
import { useMarketOverview, useStockHistory } from "@/hooks/useStockData"
import { QuoteCard } from "@/components/cards/QuoteCard"
import { PriceChart } from "@/components/charts/PriceChart"
import { PeriodSelector } from "@/components/ui/PeriodSelector"
import type { Period } from "@/types/stock"

function IndexChart({ symbol, currency, period }: { symbol: string; currency: string; period: Period }) {
  const { data, isLoading } = useStockHistory(symbol, period)
  if (isLoading) return <div className="h-64 flex items-center justify-center text-gray-400 text-sm">กำลังโหลด...</div>
  if (!data?.prices?.length) return <div className="h-64 flex items-center justify-center text-gray-400 text-sm">ไม่มีข้อมูล</div>
  return <PriceChart data={data.prices} currency={currency} />
}

export default function Dashboard() {
  const { data: market, isLoading } = useMarketOverview()
  const [period, setPeriod] = useState<Period>("1y")

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">ภาพรวมตลาด</h1>
        <p className="text-gray-500 mt-1 text-sm">ข้อมูลดัชนีและหุ้น SET และ S&amp;P 500</p>
      </div>

      {/* Index cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {isLoading ? (
          <>
            <div className="h-32 bg-white rounded-xl border border-gray-200 animate-pulse" />
            <div className="h-32 bg-white rounded-xl border border-gray-200 animate-pulse" />
          </>
        ) : (
          <>
            {market?.set_index && <QuoteCard quote={market.set_index} large />}
            {market?.sp500 && <QuoteCard quote={market.sp500} large />}
          </>
        )}
      </div>

      {/* Charts side by side */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold text-gray-900">SET Index</h2>
            <PeriodSelector value={period} onChange={setPeriod} />
          </div>
          <IndexChart symbol="^SET.BK" currency="THB" period={period} />
        </div>
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold text-gray-900">S&amp;P 500</h2>
            <PeriodSelector value={period} onChange={setPeriod} />
          </div>
          <IndexChart symbol="^GSPC" currency="USD" period={period} />
        </div>
      </div>

      {/* Popular SET stocks */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h2 className="font-semibold text-gray-900">หุ้นไทย (SET)</h2>
          <Link href="/market" className="text-sm text-blue-600 hover:underline">ดูทั้งหมด</Link>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
          {isLoading
            ? Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="h-28 bg-white rounded-xl border border-gray-200 animate-pulse" />
              ))
            : market?.popular_set.map((q) => <QuoteCard key={q.symbol} quote={q} />)}
        </div>
      </div>

      {/* Popular US stocks */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h2 className="font-semibold text-gray-900">หุ้นสหรัฐ (S&amp;P 500)</h2>
          <Link href="/compare" className="text-sm text-blue-600 hover:underline">เปรียบเทียบ</Link>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
          {isLoading
            ? Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="h-28 bg-white rounded-xl border border-gray-200 animate-pulse" />
              ))
            : market?.popular_us.map((q) => <QuoteCard key={q.symbol} quote={q} />)}
        </div>
      </div>
    </div>
  )
}

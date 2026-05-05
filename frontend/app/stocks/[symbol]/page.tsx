"use client"
import { useState, use } from "react"
import { useStockHistory, useFundamentals } from "@/hooks/useStockData"
import { PriceChart } from "@/components/charts/PriceChart"
import { PeriodSelector } from "@/components/ui/PeriodSelector"
import { FundamentalCard } from "@/components/cards/FundamentalCard"
import { ReturnsCard } from "@/components/cards/ReturnsCard"
import { QuoteCard } from "@/components/cards/QuoteCard"
import type { Period, QuotePrice } from "@/types/stock"
import Link from "next/link"

interface Props {
  params: Promise<{ symbol: string }>
}

export default function StockPage({ params }: Props) {
  const { symbol } = use(params)
  const decodedSymbol = decodeURIComponent(symbol).toUpperCase()
  const [period, setPeriod] = useState<Period>("1y")

  const { data: history, isLoading: histLoading } = useStockHistory(decodedSymbol, period)
  const { data: fundamentals, isLoading: fundLoading } = useFundamentals(decodedSymbol)

  const quoteFromFundamentals: QuotePrice | null = fundamentals
    ? {
        symbol: fundamentals.symbol,
        name: fundamentals.name,
        price: fundamentals.current_price ?? 0,
        change: fundamentals.current_price && fundamentals.previous_close
          ? fundamentals.current_price - fundamentals.previous_close
          : 0,
        change_pct: fundamentals.current_price && fundamentals.previous_close && fundamentals.previous_close !== 0
          ? ((fundamentals.current_price - fundamentals.previous_close) / fundamentals.previous_close) * 100
          : 0,
        currency: fundamentals.currency,
        volume: null,
        market_state: "CLOSED",
      }
    : null

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2 text-sm text-gray-500">
        <Link href="/" className="hover:text-blue-600">หน้าหลัก</Link>
        <span>/</span>
        <span className="text-gray-900 font-medium">{decodedSymbol}</span>
      </div>

      {/* Price header */}
      {fundLoading ? (
        <div className="h-32 bg-white rounded-xl border border-gray-200 animate-pulse" />
      ) : quoteFromFundamentals ? (
        <QuoteCard quote={quoteFromFundamentals} large />
      ) : null}

      {/* Chart */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-semibold text-gray-900">กราฟราคา</h2>
          <PeriodSelector value={period} onChange={setPeriod} />
        </div>
        {histLoading ? (
          <div className="h-80 flex items-center justify-center text-gray-400 text-sm">กำลังโหลด...</div>
        ) : history?.prices?.length ? (
          <PriceChart data={history.prices} currency={history.currency} />
        ) : (
          <div className="h-80 flex items-center justify-center text-gray-400 text-sm">ไม่มีข้อมูล</div>
        )}
      </div>

      {/* Bottom: returns + fundamentals */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {history?.returns && <ReturnsCard returns={history.returns} />}
        {fundamentals && <FundamentalCard data={fundamentals} />}
      </div>
    </div>
  )
}

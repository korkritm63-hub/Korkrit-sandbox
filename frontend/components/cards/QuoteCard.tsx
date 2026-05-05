"use client"
import type { QuotePrice } from "@/types/stock"
import { formatCurrency } from "@/lib/constants"

interface Props {
  quote: QuotePrice
  large?: boolean
}

export function QuoteCard({ quote, large }: Props) {
  const isPositive = quote.change >= 0
  const color = isPositive ? "text-green-600" : "text-red-500"
  const bg = isPositive ? "bg-green-50" : "bg-red-50"
  const badge = isPositive ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"

  return (
    <div className={`rounded-xl border border-gray-200 p-4 ${large ? "p-6" : ""} bg-white shadow-sm`}>
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs text-gray-500 font-medium uppercase tracking-wide">{quote.symbol}</p>
          <p className="text-sm text-gray-700 font-semibold mt-0.5 truncate max-w-[160px]">{quote.name}</p>
        </div>
        <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${badge}`}>
          {quote.market_state === "REGULAR" ? "เปิด" : "ปิด"}
        </span>
      </div>

      <p className={`text-2xl font-bold mt-3 ${large ? "text-3xl" : ""}`}>
        {formatCurrency(quote.price, quote.currency)}
      </p>

      <div className={`flex items-center gap-2 mt-1`}>
        <span className={`text-sm font-medium ${color}`}>
          {isPositive ? "+" : ""}
          {formatCurrency(quote.change, quote.currency)}
        </span>
        <span className={`text-xs px-1.5 py-0.5 rounded ${bg} ${color} font-medium`}>
          {isPositive ? "+" : ""}
          {quote.change_pct.toFixed(2)}%
        </span>
      </div>
    </div>
  )
}

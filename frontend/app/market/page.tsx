"use client"
import { useState } from "react"
import Link from "next/link"
import { useMarketOverview } from "@/hooks/useStockData"
import { QuoteCard } from "@/components/cards/QuoteCard"
import type { QuotePrice } from "@/types/stock"

function StockTable({ quotes, title }: { quotes: QuotePrice[]; title: string }) {
  const [sortKey, setSortKey] = useState<"change_pct" | "price" | "name">("change_pct")
  const [asc, setAsc] = useState(false)

  const sorted = [...quotes].sort((a, b) => {
    const va = a[sortKey]
    const vb = b[sortKey]
    if (typeof va === "string" && typeof vb === "string") return asc ? va.localeCompare(vb) : vb.localeCompare(va)
    return asc ? (va as number) - (vb as number) : (vb as number) - (va as number)
  })

  function toggleSort(key: typeof sortKey) {
    if (sortKey === key) setAsc(!asc)
    else { setSortKey(key); setAsc(false) }
  }

  const arrow = (key: typeof sortKey) =>
    sortKey === key ? (asc ? " ↑" : " ↓") : ""

  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
      <div className="px-5 py-4 border-b border-gray-100">
        <h2 className="font-semibold text-gray-900">{title}</h2>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-gray-50">
            <tr>
              <th className="text-left px-5 py-3 font-medium text-gray-500 cursor-pointer hover:text-gray-700" onClick={() => toggleSort("name")}>
                ชื่อ{arrow("name")}
              </th>
              <th className="text-right px-5 py-3 font-medium text-gray-500 cursor-pointer hover:text-gray-700" onClick={() => toggleSort("price")}>
                ราคา{arrow("price")}
              </th>
              <th className="text-right px-5 py-3 font-medium text-gray-500 cursor-pointer hover:text-gray-700" onClick={() => toggleSort("change_pct")}>
                เปลี่ยนแปลง{arrow("change_pct")}
              </th>
              <th className="text-right px-5 py-3 font-medium text-gray-500">รายละเอียด</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {sorted.map((q) => {
              const pos = q.change >= 0
              return (
                <tr key={q.symbol} className="hover:bg-gray-50 transition-colors">
                  <td className="px-5 py-3">
                    <p className="font-medium text-gray-900">{q.symbol}</p>
                    <p className="text-xs text-gray-400 truncate max-w-[160px]">{q.name}</p>
                  </td>
                  <td className="px-5 py-3 text-right font-medium">
                    {q.price.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    <span className="text-xs text-gray-400 ml-1">{q.currency}</span>
                  </td>
                  <td className={`px-5 py-3 text-right font-medium ${pos ? "text-green-600" : "text-red-500"}`}>
                    {pos ? "+" : ""}{q.change_pct.toFixed(2)}%
                  </td>
                  <td className="px-5 py-3 text-right">
                    <Link
                      href={`/stocks/${q.symbol}`}
                      className="text-blue-600 text-xs hover:underline"
                    >
                      ดูกราฟ
                    </Link>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default function MarketPage() {
  const { data: market, isLoading } = useMarketOverview()

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">ตลาดหลักทรัพย์</h1>
        <p className="text-gray-500 mt-1 text-sm">ราคาและความเคลื่อนไหวของหุ้นในตลาด SET และ S&amp;P 500</p>
      </div>

      {isLoading ? (
        <div className="space-y-4">
          {[0, 1].map((i) => (
            <div key={i} className="h-64 bg-white rounded-xl border border-gray-200 animate-pulse" />
          ))}
        </div>
      ) : (
        <div className="space-y-6">
          {market?.popular_set && market.popular_set.length > 0 && (
            <StockTable quotes={market.popular_set} title="หุ้นไทย (SET)" />
          )}
          {market?.popular_us && market.popular_us.length > 0 && (
            <StockTable quotes={market.popular_us} title="หุ้นสหรัฐ (S&P 500)" />
          )}
        </div>
      )}
    </div>
  )
}

import type { Fundamentals } from "@/types/stock"
import { formatMarketCap, formatNumber, formatCurrency } from "@/lib/constants"

interface Props {
  data: Fundamentals
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between py-2 border-b border-gray-100 last:border-0">
      <span className="text-sm text-gray-500">{label}</span>
      <span className="text-sm font-medium text-gray-800">{value}</span>
    </div>
  )
}

export function FundamentalCard({ data }: Props) {
  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5">
      <h3 className="font-semibold text-gray-900 mb-3">ข้อมูลพื้นฐาน</h3>
      <div>
        <Row label="ราคาปัจจุบัน" value={formatCurrency(data.current_price, data.currency)} />
        <Row label="Market Cap" value={formatMarketCap(data.market_cap)} />
        <Row label="P/E Ratio" value={formatNumber(data.pe_ratio)} />
        <Row label="Forward P/E" value={formatNumber(data.forward_pe)} />
        <Row label="P/B Ratio" value={formatNumber(data.pb_ratio)} />
        <Row label="EPS" value={formatNumber(data.eps)} />
        <Row
          label="Dividend Yield"
          value={data.dividend_yield ? `${(data.dividend_yield * 100).toFixed(2)}%` : "N/A"}
        />
        <Row label="Beta" value={formatNumber(data.beta)} />
        <Row label="52W High" value={formatCurrency(data.week_52_high, data.currency)} />
        <Row label="52W Low" value={formatCurrency(data.week_52_low, data.currency)} />
        {data.sector && <Row label="Sector" value={data.sector} />}
      </div>
    </div>
  )
}

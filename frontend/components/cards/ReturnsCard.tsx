import type { Returns } from "@/types/stock"

interface Props {
  returns: Returns
  title?: string
}

function Metric({ label, value, positive }: { label: string; value: string; positive?: boolean }) {
  const color =
    positive === undefined ? "text-gray-800" : positive ? "text-green-600" : "text-red-500"
  return (
    <div className="text-center p-3 bg-gray-50 rounded-lg">
      <p className="text-xs text-gray-500 mb-1">{label}</p>
      <p className={`text-lg font-bold ${color}`}>{value}</p>
    </div>
  )
}

export function ReturnsCard({ returns, title = "ผลตอบแทน" }: Props) {
  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5">
      <h3 className="font-semibold text-gray-900 mb-3">{title}</h3>
      <div className="grid grid-cols-2 gap-2">
        <Metric
          label="ผลตอบแทนรวม"
          value={`${returns.total_return >= 0 ? "+" : ""}${returns.total_return.toFixed(2)}%`}
          positive={returns.total_return >= 0}
        />
        <Metric
          label="ผลตอบแทนต่อปี"
          value={`${returns.annualized_return >= 0 ? "+" : ""}${returns.annualized_return.toFixed(2)}%`}
          positive={returns.annualized_return >= 0}
        />
        <Metric label="ความผันผวน" value={`${returns.volatility.toFixed(2)}%`} />
        <Metric label="Max Drawdown" value={`-${returns.max_drawdown.toFixed(2)}%`} positive={false} />
      </div>
    </div>
  )
}

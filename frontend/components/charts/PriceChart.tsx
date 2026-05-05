"use client"
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts"
import type { PricePoint } from "@/types/stock"
import { formatCurrency } from "@/lib/constants"

interface Props {
  data: PricePoint[]
  currency: string
  color?: string
}

function formatDate(dateStr: string): string {
  const d = new Date(dateStr)
  return d.toLocaleDateString("th-TH", { month: "short", day: "numeric" })
}

export function PriceChart({ data, currency, color = "#3b82f6" }: Props) {
  const minPrice = Math.min(...data.map((d) => d.close)) * 0.98
  const maxPrice = Math.max(...data.map((d) => d.close)) * 1.02

  return (
    <ResponsiveContainer width="100%" height={320}>
      <LineChart data={data} margin={{ top: 5, right: 20, left: 10, bottom: 5 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
        <XAxis
          dataKey="date"
          tickFormatter={formatDate}
          tick={{ fontSize: 11, fill: "#6b7280" }}
          tickLine={false}
          interval="preserveStartEnd"
        />
        <YAxis
          domain={[minPrice, maxPrice]}
          tickFormatter={(v) => formatCurrency(v, currency).replace(/[A-Z]{3}\s?/, "")}
          tick={{ fontSize: 11, fill: "#6b7280" }}
          tickLine={false}
          axisLine={false}
          width={70}
        />
        <Tooltip
          formatter={(value) => [formatCurrency(Number(value), currency), "ราคา"]}
          labelFormatter={(label) => new Date(label).toLocaleDateString("th-TH")}
          contentStyle={{ borderRadius: "8px", border: "1px solid #e5e7eb", fontSize: "12px" }}
        />
        <Line
          type="monotone"
          dataKey="close"
          stroke={color}
          strokeWidth={2}
          dot={false}
          activeDot={{ r: 4 }}
        />
      </LineChart>
    </ResponsiveContainer>
  )
}

"use client"
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts"
import type { ComparisonSeries } from "@/types/stock"
import { COLORS } from "@/lib/constants"

interface Props {
  series: ComparisonSeries[]
  normalized?: boolean
}

export function ComparisonChart({ series, normalized = true }: Props) {
  // Merge all dates across series
  const allDates = Array.from(new Set(series.flatMap((s) => s.dates))).sort()

  const chartData = allDates.map((date) => {
    const row: Record<string, number | string> = { date }
    series.forEach((s) => {
      const idx = s.dates.indexOf(date)
      if (idx !== -1) {
        row[s.symbol] = normalized ? s.normalized[idx] : s.prices[idx]
      }
    })
    return row
  })

  return (
    <ResponsiveContainer width="100%" height={360}>
      <LineChart data={chartData} margin={{ top: 5, right: 20, left: 10, bottom: 5 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
        <XAxis
          dataKey="date"
          tickFormatter={(v) =>
            new Date(v).toLocaleDateString("th-TH", { month: "short", day: "numeric" })
          }
          tick={{ fontSize: 11, fill: "#6b7280" }}
          tickLine={false}
          interval="preserveStartEnd"
        />
        <YAxis
          tickFormatter={(v) => (normalized ? `${v.toFixed(0)}` : v.toLocaleString())}
          tick={{ fontSize: 11, fill: "#6b7280" }}
          tickLine={false}
          axisLine={false}
          width={60}
          label={
            normalized
              ? { value: "Base=100", angle: -90, position: "insideLeft", fontSize: 10, fill: "#9ca3af" }
              : undefined
          }
        />
        <Tooltip
          formatter={(value, name) => [
            normalized ? `${Number(value).toFixed(2)}` : Number(value).toLocaleString(),
            series.find((s) => s.symbol === name)?.name || name,
          ]}
          labelFormatter={(label) => new Date(label).toLocaleDateString("th-TH")}
          contentStyle={{ borderRadius: "8px", border: "1px solid #e5e7eb", fontSize: "12px" }}
        />
        <Legend
          formatter={(value) => series.find((s) => s.symbol === value)?.name || value}
          wrapperStyle={{ fontSize: "12px" }}
        />
        {series.map((s, i) => (
          <Line
            key={s.symbol}
            type="monotone"
            dataKey={s.symbol}
            stroke={COLORS[i % COLORS.length]}
            strokeWidth={2}
            dot={false}
            activeDot={{ r: 4 }}
            connectNulls
          />
        ))}
      </LineChart>
    </ResponsiveContainer>
  )
}

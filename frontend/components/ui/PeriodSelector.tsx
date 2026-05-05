"use client"
import { PERIODS } from "@/lib/constants"
import type { Period } from "@/types/stock"

interface Props {
  value: Period
  onChange: (p: Period) => void
}

export function PeriodSelector({ value, onChange }: Props) {
  return (
    <div className="flex gap-1 rounded-lg bg-gray-100 p-1">
      {PERIODS.map((p) => (
        <button
          key={p.value}
          onClick={() => onChange(p.value as Period)}
          className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${
            value === p.value
              ? "bg-white text-blue-600 shadow-sm"
              : "text-gray-600 hover:text-gray-900"
          }`}
        >
          {p.label}
        </button>
      ))}
    </div>
  )
}

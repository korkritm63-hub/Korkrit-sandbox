export const PERIODS = [
  { label: "1 เดือน", value: "1mo" },
  { label: "3 เดือน", value: "3mo" },
  { label: "1 ปี", value: "1y" },
  { label: "5 ปี", value: "5y" },
] as const

export const COLORS = ["#3b82f6", "#f59e0b", "#10b981", "#ef4444", "#8b5cf6"]

export const SET_SYMBOLS = [
  { symbol: "^SET.BK", name: "SET Index" },
  { symbol: "PTT.BK", name: "PTT" },
  { symbol: "ADVANC.BK", name: "ADVANC" },
  { symbol: "KBANK.BK", name: "KBANK" },
  { symbol: "AOT.BK", name: "AOT" },
  { symbol: "CPALL.BK", name: "CPALL" },
]

export const US_SYMBOLS = [
  { symbol: "^GSPC", name: "S&P 500" },
  { symbol: "AAPL", name: "Apple" },
  { symbol: "MSFT", name: "Microsoft" },
  { symbol: "NVDA", name: "NVIDIA" },
  { symbol: "GOOGL", name: "Alphabet" },
]

export function formatCurrency(value: number | null, currency = "USD"): string {
  if (value === null || value === undefined) return "N/A"
  const locale = currency === "THB" ? "th-TH" : "en-US"
  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value)
}

export function formatMarketCap(value: number | null): string {
  if (!value) return "N/A"
  if (value >= 1e12) return `${(value / 1e12).toFixed(2)}T`
  if (value >= 1e9) return `${(value / 1e9).toFixed(2)}B`
  if (value >= 1e6) return `${(value / 1e6).toFixed(2)}M`
  return value.toLocaleString()
}

export function formatNumber(value: number | null, decimals = 2): string {
  if (value === null || value === undefined) return "N/A"
  return value.toFixed(decimals)
}

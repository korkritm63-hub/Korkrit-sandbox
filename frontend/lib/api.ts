import type { StockHistory, Fundamentals, QuotePrice, ComparisonResult, MarketOverview, Period } from "@/types/stock"

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000"

async function fetchJSON<T>(path: string): Promise<T> {
  const res = await fetch(`${API_BASE}${path}`, { next: { revalidate: 60 } })
  if (!res.ok) {
    const err = await res.json().catch(() => ({ detail: "Unknown error" }))
    throw new Error(err.detail || `HTTP ${res.status}`)
  }
  return res.json()
}

export const api = {
  getHistory: (symbol: string, period: Period) =>
    fetchJSON<StockHistory>(`/api/stocks/${symbol}/history?period=${period}`),

  getPrice: (symbol: string) =>
    fetchJSON<QuotePrice>(`/api/stocks/${symbol}/price`),

  getFundamentals: (symbol: string) =>
    fetchJSON<Fundamentals>(`/api/stocks/${symbol}/fundamentals`),

  getMarketOverview: () =>
    fetchJSON<MarketOverview>(`/api/market/overview`),

  compare: (symbols: string[], period: Period) =>
    fetchJSON<ComparisonResult>(
      `/api/compare?symbols=${symbols.join(",")}&period=${period}`
    ),

  search: (q: string) =>
    fetchJSON<{ results: { symbol: string; name: string; exchange: string; type: string }[] }>(
      `/api/stocks/search/query?q=${encodeURIComponent(q)}`
    ),
}

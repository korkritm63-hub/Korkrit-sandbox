export interface PricePoint {
  date: string
  open: number
  high: number
  low: number
  close: number
  volume: number
}

export interface Returns {
  total_return: number
  annualized_return: number
  max_drawdown: number
  volatility: number
}

export interface StockHistory {
  symbol: string
  name: string
  currency: string
  period: string
  prices: PricePoint[]
  returns: Returns
}

export interface Fundamentals {
  symbol: string
  name: string
  currency: string
  market_cap: number | null
  pe_ratio: number | null
  forward_pe: number | null
  pb_ratio: number | null
  eps: number | null
  dividend_yield: number | null
  beta: number | null
  week_52_high: number | null
  week_52_low: number | null
  avg_volume: number | null
  sector: string | null
  industry: string | null
  current_price: number | null
  previous_close: number | null
}

export interface QuotePrice {
  symbol: string
  name: string
  price: number
  change: number
  change_pct: number
  currency: string
  volume: number | null
  market_state: string
}

export interface ComparisonSeries {
  symbol: string
  name: string
  currency: string
  dates: string[]
  prices: number[]
  normalized: number[]
  returns: Returns
}

export interface ComparisonResult {
  period: string
  series: ComparisonSeries[]
}

export interface MarketOverview {
  set_index: QuotePrice
  sp500: QuotePrice
  popular_set: QuotePrice[]
  popular_us: QuotePrice[]
}

export type Period = "1mo" | "3mo" | "1y" | "5y"

"use client"
import { useQuery } from "@tanstack/react-query"
import { api } from "@/lib/api"
import type { Period } from "@/types/stock"

export function useStockHistory(symbol: string, period: Period) {
  return useQuery({
    queryKey: ["history", symbol, period],
    queryFn: () => api.getHistory(symbol, period),
    enabled: !!symbol,
  })
}

export function useStockPrice(symbol: string) {
  return useQuery({
    queryKey: ["price", symbol],
    queryFn: () => api.getPrice(symbol),
    enabled: !!symbol,
    refetchInterval: 60_000,
  })
}

export function useFundamentals(symbol: string) {
  return useQuery({
    queryKey: ["fundamentals", symbol],
    queryFn: () => api.getFundamentals(symbol),
    enabled: !!symbol,
  })
}

export function useMarketOverview() {
  return useQuery({
    queryKey: ["market-overview"],
    queryFn: api.getMarketOverview,
    refetchInterval: 60_000,
  })
}

export function useComparison(symbols: string[], period: Period) {
  return useQuery({
    queryKey: ["comparison", symbols.join(","), period],
    queryFn: () => api.compare(symbols, period),
    enabled: symbols.length > 0,
  })
}

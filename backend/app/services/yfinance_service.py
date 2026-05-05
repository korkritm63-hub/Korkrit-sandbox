import yfinance as yf
import pandas as pd
from datetime import datetime
from .cache_service import cache

PERIOD_MAP = {
    "1mo": "1mo",
    "3mo": "3mo",
    "1y": "1y",
    "5y": "5y",
    "ytd": "ytd",
}


def _ticker(symbol: str) -> yf.Ticker:
    return yf.Ticker(symbol)


def get_price_history(symbol: str, period: str = "1y") -> list[dict]:
    cache_key = f"history:{symbol}:{period}"
    cached = cache.get(cache_key)
    if cached is not None:
        return cached

    yf_period = PERIOD_MAP.get(period, "1y")
    ticker = _ticker(symbol)
    hist = ticker.history(period=yf_period)

    if hist.empty:
        return []

    hist.index = pd.to_datetime(hist.index)
    result = [
        {
            "date": idx.strftime("%Y-%m-%d"),
            "open": round(float(row["Open"]), 2),
            "high": round(float(row["High"]), 2),
            "low": round(float(row["Low"]), 2),
            "close": round(float(row["Close"]), 2),
            "volume": int(row["Volume"]),
        }
        for idx, row in hist.iterrows()
    ]

    cache.set(cache_key, result)
    return result


def get_fundamentals(symbol: str) -> dict:
    cache_key = f"fundamentals:{symbol}"
    cached = cache.get(cache_key)
    if cached is not None:
        return cached

    ticker = _ticker(symbol)
    info = ticker.info or {}

    result = {
        "symbol": symbol,
        "name": info.get("longName") or info.get("shortName", symbol),
        "currency": info.get("currency", "USD"),
        "market_cap": info.get("marketCap"),
        "pe_ratio": info.get("trailingPE"),
        "forward_pe": info.get("forwardPE"),
        "pb_ratio": info.get("priceToBook"),
        "eps": info.get("trailingEps"),
        "dividend_yield": info.get("dividendYield"),
        "beta": info.get("beta"),
        "week_52_high": info.get("fiftyTwoWeekHigh"),
        "week_52_low": info.get("fiftyTwoWeekLow"),
        "avg_volume": info.get("averageVolume"),
        "sector": info.get("sector"),
        "industry": info.get("industry"),
        "current_price": info.get("currentPrice") or info.get("regularMarketPrice"),
        "previous_close": info.get("previousClose") or info.get("regularMarketPreviousClose"),
    }

    cache.set(cache_key, result, ttl=300)
    return result


def get_current_price(symbol: str) -> dict:
    cache_key = f"price:{symbol}"
    cached = cache.get(cache_key)
    if cached is not None:
        return cached

    ticker = _ticker(symbol)
    info = ticker.info or {}

    price = info.get("currentPrice") or info.get("regularMarketPrice") or 0
    prev_close = info.get("previousClose") or info.get("regularMarketPreviousClose") or price
    change = price - prev_close
    change_pct = (change / prev_close * 100) if prev_close else 0

    result = {
        "symbol": symbol,
        "name": info.get("longName") or info.get("shortName", symbol),
        "price": round(price, 2),
        "change": round(change, 2),
        "change_pct": round(change_pct, 2),
        "currency": info.get("currency", "USD"),
        "volume": info.get("regularMarketVolume"),
        "market_state": info.get("marketState", "CLOSED"),
    }

    cache.set(cache_key, result, ttl=60)
    return result


def search_symbols(query: str) -> list[dict]:
    results = []
    # Search using yfinance search (uses Yahoo Finance's search API)
    try:
        search_results = yf.Search(query, news_count=0, max_results=10)
        quotes = search_results.quotes
        for q in quotes:
            results.append({
                "symbol": q.get("symbol", ""),
                "name": q.get("longname") or q.get("shortname", ""),
                "exchange": q.get("exchange", ""),
                "type": q.get("quoteType", ""),
            })
    except Exception:
        pass
    return results

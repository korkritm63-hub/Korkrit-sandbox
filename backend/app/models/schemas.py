from pydantic import BaseModel
from typing import Optional


class PricePoint(BaseModel):
    date: str
    open: float
    high: float
    low: float
    close: float
    volume: int


class StockHistory(BaseModel):
    symbol: str
    name: str
    currency: str
    period: str
    prices: list[PricePoint]
    returns: dict


class Fundamentals(BaseModel):
    symbol: str
    name: str
    currency: str
    market_cap: Optional[float] = None
    pe_ratio: Optional[float] = None
    forward_pe: Optional[float] = None
    pb_ratio: Optional[float] = None
    eps: Optional[float] = None
    dividend_yield: Optional[float] = None
    beta: Optional[float] = None
    week_52_high: Optional[float] = None
    week_52_low: Optional[float] = None
    avg_volume: Optional[float] = None
    sector: Optional[str] = None
    industry: Optional[str] = None
    current_price: Optional[float] = None
    previous_close: Optional[float] = None


class QuotePrice(BaseModel):
    symbol: str
    name: str
    price: float
    change: float
    change_pct: float
    currency: str
    volume: Optional[int] = None
    market_state: str


class ComparisonSeries(BaseModel):
    symbol: str
    name: str
    currency: str
    dates: list[str]
    prices: list[float]
    normalized: list[float]
    returns: dict


class ComparisonResult(BaseModel):
    period: str
    series: list[ComparisonSeries]


class MarketOverview(BaseModel):
    set_index: QuotePrice
    sp500: QuotePrice
    popular_set: list[QuotePrice]
    popular_us: list[QuotePrice]

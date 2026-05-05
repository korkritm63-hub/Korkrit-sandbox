from fastapi import APIRouter, HTTPException
from ..services import yfinance_service as yf_svc
from ..models.schemas import MarketOverview, QuotePrice

router = APIRouter(prefix="/market", tags=["market"])

SET_POPULAR = ["PTT.BK", "ADVANC.BK", "KBANK.BK", "AOT.BK", "CPALL.BK"]
US_POPULAR = ["AAPL", "MSFT", "NVDA", "GOOGL", "AMZN"]


def _safe_quote(symbol: str) -> QuotePrice | None:
    try:
        data = yf_svc.get_current_price(symbol)
        if data["price"] == 0:
            return None
        return QuotePrice(**data)
    except Exception:
        return None


@router.get("/overview", response_model=MarketOverview)
def get_overview():
    set_index = _safe_quote("^SET.BK")
    sp500 = _safe_quote("^GSPC")

    if not set_index:
        set_index = QuotePrice(
            symbol="^SET.BK", name="SET Index", price=0,
            change=0, change_pct=0, currency="THB", market_state="CLOSED"
        )
    if not sp500:
        sp500 = QuotePrice(
            symbol="^GSPC", name="S&P 500", price=0,
            change=0, change_pct=0, currency="USD", market_state="CLOSED"
        )

    popular_set = [q for s in SET_POPULAR if (q := _safe_quote(s)) is not None]
    popular_us = [q for s in US_POPULAR if (q := _safe_quote(s)) is not None]

    return MarketOverview(
        set_index=set_index,
        sp500=sp500,
        popular_set=popular_set,
        popular_us=popular_us,
    )

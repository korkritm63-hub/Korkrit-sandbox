from fastapi import APIRouter, HTTPException, Query
from ..services import yfinance_service as yf_svc
from ..utils.calculations import calculate_returns
from ..models.schemas import StockHistory, Fundamentals, QuotePrice

router = APIRouter(prefix="/stocks", tags=["stocks"])

VALID_PERIODS = {"1mo", "3mo", "1y", "5y", "ytd"}


@router.get("/{symbol}/price", response_model=QuotePrice)
def get_price(symbol: str):
    try:
        return yf_svc.get_current_price(symbol.upper())
    except Exception as e:
        raise HTTPException(status_code=502, detail=str(e))


@router.get("/{symbol}/history", response_model=StockHistory)
def get_history(symbol: str, period: str = Query("1y", enum=list(VALID_PERIODS))):
    symbol = symbol.upper()
    prices_data = yf_svc.get_price_history(symbol, period)

    if not prices_data:
        raise HTTPException(status_code=404, detail=f"No data found for {symbol}")

    closes = [p["close"] for p in prices_data]
    returns = calculate_returns(closes)

    fundamentals = yf_svc.get_fundamentals(symbol)

    return StockHistory(
        symbol=symbol,
        name=fundamentals.get("name", symbol),
        currency=fundamentals.get("currency", "USD"),
        period=period,
        prices=prices_data,
        returns=returns,
    )


@router.get("/{symbol}/fundamentals", response_model=Fundamentals)
def get_fundamentals(symbol: str):
    symbol = symbol.upper()
    try:
        data = yf_svc.get_fundamentals(symbol)
        if not data.get("name"):
            raise HTTPException(status_code=404, detail=f"Symbol {symbol} not found")
        return Fundamentals(**data)
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=502, detail=str(e))


@router.get("/search/query")
def search(q: str = Query(..., min_length=1)):
    results = yf_svc.search_symbols(q)
    return {"results": results}

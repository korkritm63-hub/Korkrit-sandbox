from fastapi import APIRouter, HTTPException, Query
from ..services import yfinance_service as yf_svc
from ..utils.calculations import calculate_returns, normalize_prices
from ..models.schemas import ComparisonResult, ComparisonSeries

router = APIRouter(prefix="/compare", tags=["comparison"])


@router.get("", response_model=ComparisonResult)
def compare(
    symbols: str = Query(..., description="Comma-separated symbols e.g. PTT.BK,^GSPC"),
    period: str = Query("1y", enum=["1mo", "3mo", "1y", "5y"]),
):
    symbol_list = [s.strip().upper() for s in symbols.split(",") if s.strip()]
    if len(symbol_list) < 1 or len(symbol_list) > 5:
        raise HTTPException(status_code=400, detail="Provide 1-5 symbols")

    series_list: list[ComparisonSeries] = []

    for symbol in symbol_list:
        prices_data = yf_svc.get_price_history(symbol, period)
        if not prices_data:
            continue

        fundamentals = yf_svc.get_fundamentals(symbol)
        closes = [p["close"] for p in prices_data]
        dates = [p["date"] for p in prices_data]
        normalized = normalize_prices(closes)
        returns = calculate_returns(closes)

        series_list.append(
            ComparisonSeries(
                symbol=symbol,
                name=fundamentals.get("name", symbol),
                currency=fundamentals.get("currency", "USD"),
                dates=dates,
                prices=closes,
                normalized=normalized,
                returns=returns,
            )
        )

    if not series_list:
        raise HTTPException(status_code=404, detail="No data found for given symbols")

    return ComparisonResult(period=period, series=series_list)

import math


def calculate_returns(prices: list[float]) -> dict:
    if len(prices) < 2:
        return {"total_return": 0, "annualized_return": 0, "max_drawdown": 0, "volatility": 0}

    total_return = (prices[-1] - prices[0]) / prices[0] * 100

    # Annualized return (assume daily data, 252 trading days/year)
    n_days = len(prices)
    years = n_days / 252
    annualized_return = ((prices[-1] / prices[0]) ** (1 / years) - 1) * 100 if years > 0 else 0

    # Max drawdown
    peak = prices[0]
    max_dd = 0
    for p in prices:
        if p > peak:
            peak = p
        dd = (peak - p) / peak * 100
        if dd > max_dd:
            max_dd = dd

    # Volatility (annualized std of daily returns)
    daily_returns = [(prices[i] - prices[i - 1]) / prices[i - 1] for i in range(1, len(prices))]
    if len(daily_returns) > 1:
        mean = sum(daily_returns) / len(daily_returns)
        variance = sum((r - mean) ** 2 for r in daily_returns) / (len(daily_returns) - 1)
        volatility = math.sqrt(variance) * math.sqrt(252) * 100
    else:
        volatility = 0

    return {
        "total_return": round(total_return, 2),
        "annualized_return": round(annualized_return, 2),
        "max_drawdown": round(max_dd, 2),
        "volatility": round(volatility, 2),
    }


def normalize_prices(prices: list[float], base: float = 100) -> list[float]:
    if not prices or prices[0] == 0:
        return prices
    return [round(p / prices[0] * base, 4) for p in prices]


def calculate_cagr(start_price: float, end_price: float, years: float) -> float:
    if start_price <= 0 or years <= 0:
        return 0
    return round(((end_price / start_price) ** (1 / years) - 1) * 100, 2)

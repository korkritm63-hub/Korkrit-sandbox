from fastapi import APIRouter
from .stocks import router as stocks_router
from .market import router as market_router
from .comparison import router as comparison_router

api_router = APIRouter(prefix="/api")
api_router.include_router(stocks_router)
api_router.include_router(market_router)
api_router.include_router(comparison_router)

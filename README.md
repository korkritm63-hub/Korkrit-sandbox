# StockTH — วิเคราะห์การลงทุน SET & S&P500

Web app วิเคราะห์การเงินและการลงทุนสำหรับตลาดหุ้นไทย (SET) และตลาดสหรัฐ (S&P 500)

## ฟีเจอร์

- ดูราคาดัชนี SET และ S&P500 พร้อมกราฟราคาย้อนหลัง (1เดือน / 3เดือน / 1ปี / 5ปี)
- วิเคราะห์ผลตอบแทน: total return, annualized return, max drawdown, volatility
- เปรียบเทียบหุ้น/ดัชนีหลายตัวพร้อมกัน (normalized base 100)
- ข้อมูล fundamental: P/E, Market Cap, Dividend Yield, Beta, 52W High/Low
- รองรับหุ้นไทย (`.BK`) และหุ้นสหรัฐ

## Tech Stack

- **Backend**: FastAPI + yfinance + Pydantic + TTL cache (15 นาที)
- **Frontend**: Next.js 16 (App Router) + Recharts + TailwindCSS + React Query

## Setup Local

### Backend

```bash
cd backend
python -m venv .venv && source .venv/bin/activate
pip install -r requirements.txt
cp .env.example .env
uvicorn main:app --reload
# → http://localhost:8000 (docs: http://localhost:8000/docs)
```

### Frontend

```bash
cd frontend
cp .env.example .env.local
npm install
npm run dev
# → http://localhost:3000
```

## Deploy → Production

### Backend → Railway

1. ไปที่ [railway.app](https://railway.app) → **New Project** → **Deploy from GitHub** → เลือก repo นี้
2. **Settings → Service**:
   - **Root Directory**: `backend`
   - Builder: Dockerfile (auto-detect จาก `railway.json`)
3. **Variables**:
   - `CORS_ORIGINS=https://<your-vercel-app>.vercel.app`
   - `PORT` Railway ตั้งให้อัตโนมัติ
4. **Settings → Networking → Generate Domain** → ได้ URL เช่น `https://stockth-api.up.railway.app`
5. ทดสอบ: `curl https://<railway-url>/health` → `{"status":"ok"}`

### Frontend → Vercel

1. ไปที่ [vercel.com](https://vercel.com) → **New Project** → Import Git Repository
2. Configure:
   - **Root Directory**: `frontend`
   - **Framework Preset**: Next.js (auto-detect)
3. **Environment Variables**:
   - `NEXT_PUBLIC_API_URL=https://<railway-url>.up.railway.app`
4. **Deploy** → ได้ URL เช่น `https://stockth.vercel.app`
5. กลับไปที่ Railway → อัปเดต `CORS_ORIGINS` ให้ตรงกับ Vercel URL

### Auto-deploy

หลัง setup เสร็จ ทุกครั้งที่ `git push` ไปที่ branch ที่ตั้งไว้ ทั้ง Vercel และ Railway จะ rebuild + redeploy อัตโนมัติ

## โครงสร้าง

```
.
├── backend/
│   ├── app/
│   │   ├── api/              # FastAPI routers (stocks, market, comparison)
│   │   ├── services/         # yfinance + cache
│   │   ├── models/           # Pydantic schemas
│   │   ├── utils/            # calculations (return, CAGR, drawdown)
│   │   └── config.py
│   ├── main.py
│   ├── requirements.txt
│   ├── Dockerfile
│   └── railway.json
│
└── frontend/
    ├── app/                  # Next.js App Router
    │   ├── page.tsx          # Dashboard
    │   ├── compare/page.tsx  # Comparison view
    │   ├── market/page.tsx   # Market table
    │   └── stocks/[symbol]/page.tsx
    ├── components/           # Charts, cards, UI
    ├── hooks/                # React Query hooks
    ├── lib/                  # API client, constants
    ├── types/
    └── vercel.json
```

## API Reference

| Endpoint | Description |
|---|---|
| `GET /health` | Health check |
| `GET /api/market/overview` | SET Index + S&P500 + popular stocks |
| `GET /api/stocks/{symbol}/price` | ราคาปัจจุบัน |
| `GET /api/stocks/{symbol}/history?period=1y` | ประวัติราคา (1mo/3mo/1y/5y/ytd) |
| `GET /api/stocks/{symbol}/fundamentals` | P/E, Market Cap, etc. |
| `GET /api/compare?symbols=PTT.BK,^GSPC&period=1y` | เปรียบเทียบหลาย symbol |
| `GET /api/stocks/search/query?q=PTT` | ค้นหา symbol |

## ข้อจำกัด

- **yfinance rate limit**: ~2000 req/hr ต่อ IP — TTL cache 15 นาทีรับมือได้ระดับหนึ่ง
- **In-memory cache**: รีเซ็ตเมื่อ container restart (Railway จะ restart ครั้งคราว)
- **ข้อมูลล่าช้า**: SET Index บน Yahoo Finance อาจล่าช้า ~15 นาที

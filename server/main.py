from contextlib import asynccontextmanager
from datetime import datetime
from zoneinfo import ZoneInfo

from apscheduler.schedulers.asyncio import AsyncIOScheduler
from apscheduler.triggers.cron import CronTrigger
from dotenv import load_dotenv
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

from database import (
    close_pool,
    get_monthly_summary,
    get_today_count,
    init_db,
    insert_tap,
    upsert_push_token,
)
from notifications import is_last_day_of_month, send_monthly_notifications

load_dotenv()

BRT = ZoneInfo("America/Sao_Paulo")
scheduler = AsyncIOScheduler(timezone=BRT)


async def monthly_notification_job():
    if is_last_day_of_month():
        await send_monthly_notifications()


@asynccontextmanager
async def lifespan(app: FastAPI):
    await init_db()
    scheduler.add_job(
        monthly_notification_job,
        CronTrigger(hour=20, minute=0, timezone=BRT),
        id="monthly_notifications",
        replace_existing=True,
    )
    scheduler.start()
    yield
    scheduler.shutdown()
    await close_pool()


app = FastAPI(title="App Triste API", version="1.0.0", lifespan=lifespan)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


class TapRequest(BaseModel):
    device_id: str


class TokenRequest(BaseModel):
    device_id: str
    expo_token: str


class SummaryRequest(BaseModel):
    device_id: str
    year: int | None = None
    month: int | None = None


@app.post("/api/tap")
async def register_tap(req: TapRequest):
    if not req.device_id:
        raise HTTPException(status_code=400, detail="device_id obrigatório")
    tapped_at = await insert_tap(req.device_id)
    count = await get_today_count(req.device_id)
    return {
        "status": "ok",
        "count_today": count,
        "tapped_at": tapped_at.isoformat(),
    }


@app.get("/api/today/{device_id}")
async def today_count(device_id: str):
    if not device_id:
        raise HTTPException(status_code=400, detail="device_id obrigatório")
    count = await get_today_count(device_id)
    return {"count_today": count}


@app.post("/api/monthly-summary")
async def monthly_summary(req: SummaryRequest):
    now = datetime.now(BRT)
    year = req.year or now.year
    month = req.month or now.month
    summary = await get_monthly_summary(req.device_id, year, month)
    return summary


@app.post("/api/register-token")
async def register_token(req: TokenRequest):
    if not req.device_id or not req.expo_token:
        raise HTTPException(status_code=400, detail="device_id e expo_token obrigatórios")
    await upsert_push_token(req.device_id, req.expo_token)
    return {"status": "ok"}


@app.get("/api/health")
async def health():
    return {"status": "alive", "time": datetime.now(BRT).isoformat()}

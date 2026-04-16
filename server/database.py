import asyncpg
import os
from datetime import datetime, timedelta
from zoneinfo import ZoneInfo

BRT = ZoneInfo("America/Sao_Paulo")

pool = None


async def get_pool():
    global pool
    if pool is None:
        pool = await asyncpg.create_pool(
            dsn=os.getenv("DATABASE_URL"),
            min_size=2,
            max_size=10,
        )
    return pool


async def init_db():
    p = await get_pool()
    async with p.acquire() as conn:
        await conn.execute("""
            CREATE TABLE IF NOT EXISTS sadness_taps (
                id SERIAL PRIMARY KEY,
                tapped_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
                device_id VARCHAR(255),
                is_deleted BOOLEAN DEFAULT FALSE
            );
        """)
        await conn.execute("""
            CREATE TABLE IF NOT EXISTS push_tokens (
                id SERIAL PRIMARY KEY,
                device_id VARCHAR(255) UNIQUE,
                expo_token VARCHAR(255) NOT NULL,
                created_at TIMESTAMPTZ DEFAULT NOW(),
                is_deleted BOOLEAN DEFAULT FALSE
            );
        """)
        await conn.execute("""
            CREATE INDEX IF NOT EXISTS idx_taps_device_date
            ON sadness_taps (device_id, tapped_at)
            WHERE is_deleted = FALSE;
        """)


async def insert_tap(device_id: str):
    p = await get_pool()
    now = datetime.now(BRT)
    async with p.acquire() as conn:
        await conn.execute(
            "INSERT INTO sadness_taps (tapped_at, device_id) VALUES ($1, $2)",
            now,
            device_id,
        )
    return now


async def get_today_count(device_id: str) -> int:
    p = await get_pool()
    now = datetime.now(BRT)
    start_of_day = now.replace(hour=0, minute=0, second=0, microsecond=0)
    async with p.acquire() as conn:
        row = await conn.fetchrow(
            """
            SELECT COUNT(*) as total
            FROM sadness_taps
            WHERE device_id = $1
              AND tapped_at >= $2
              AND is_deleted = FALSE
            """,
            device_id,
            start_of_day,
        )
    return row["total"] if row else 0


async def get_monthly_summary(device_id: str, year: int, month: int):
    p = await get_pool()
    start = datetime(year, month, 1, tzinfo=BRT)
    if month == 12:
        end = datetime(year + 1, 1, 1, tzinfo=BRT)
    else:
        end = datetime(year, month + 1, 1, tzinfo=BRT)

    async with p.acquire() as conn:
        total = await conn.fetchrow(
            """
            SELECT COUNT(*) as total
            FROM sadness_taps
            WHERE device_id = $1
              AND tapped_at >= $2
              AND tapped_at < $3
              AND is_deleted = FALSE
            """,
            device_id,
            start,
            end,
        )

        daily_counts = await conn.fetch(
            """
            SELECT
                DATE(tapped_at AT TIME ZONE 'America/Sao_Paulo') as day,
                COUNT(*) as count
            FROM sadness_taps
            WHERE device_id = $1
              AND tapped_at >= $2
              AND tapped_at < $3
              AND is_deleted = FALSE
            GROUP BY day
            ORDER BY count DESC
            """,
            device_id,
            start,
            end,
        )

        hourly_distribution = await conn.fetch(
            """
            SELECT
                EXTRACT(HOUR FROM tapped_at AT TIME ZONE 'America/Sao_Paulo')::int as hour,
                COUNT(*) as count
            FROM sadness_taps
            WHERE device_id = $1
              AND tapped_at >= $2
              AND tapped_at < $3
              AND is_deleted = FALSE
            GROUP BY hour
            ORDER BY count DESC
            LIMIT 1
            """,
            device_id,
            start,
            end,
        )

    most_common_hour = None
    if hourly_distribution:
        h = hourly_distribution[0]["hour"]
        most_common_hour = f"{h:02d}:00-{h+1:02d}:00"

    worst_day = None
    worst_day_count = 0
    if daily_counts:
        worst_day = daily_counts[0]["day"].strftime("%d/%m")
        worst_day_count = daily_counts[0]["count"]

    num_days = (end - start).days
    avg_per_day = round(total["total"] / num_days, 1) if total["total"] > 0 else 0

    return {
        "total": total["total"],
        "avg_per_day": avg_per_day,
        "worst_day": worst_day,
        "worst_day_count": worst_day_count,
        "most_common_hour": most_common_hour,
        "days_with_taps": len(daily_counts),
    }


async def upsert_push_token(device_id: str, expo_token: str):
    p = await get_pool()
    async with p.acquire() as conn:
        await conn.execute(
            """
            INSERT INTO push_tokens (device_id, expo_token)
            VALUES ($1, $2)
            ON CONFLICT (device_id)
            DO UPDATE SET expo_token = $2, is_deleted = FALSE
            """,
            device_id,
            expo_token,
        )


async def get_all_active_tokens():
    p = await get_pool()
    async with p.acquire() as conn:
        rows = await conn.fetch(
            "SELECT device_id, expo_token FROM push_tokens WHERE is_deleted = FALSE"
        )
    return rows


async def close_pool():
    global pool
    if pool:
        await pool.close()
        pool = None

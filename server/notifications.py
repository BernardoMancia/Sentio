import httpx
import calendar
from datetime import datetime
from zoneinfo import ZoneInfo

from database import get_all_active_tokens, get_monthly_summary

BRT = ZoneInfo("America/Sao_Paulo")
EXPO_PUSH_URL = "https://exp.host/--/api/v2/push/send"

MONTH_NAMES_PT = {
    1: "Janeiro", 2: "Fevereiro", 3: "Março", 4: "Abril",
    5: "Maio", 6: "Junho", 7: "Julho", 8: "Agosto",
    9: "Setembro", 10: "Outubro", 11: "Novembro", 12: "Dezembro",
}


async def send_push(expo_token: str, title: str, body: str):
    async with httpx.AsyncClient() as client:
        await client.post(
            EXPO_PUSH_URL,
            json={
                "to": expo_token,
                "title": title,
                "body": body,
                "sound": "default",
                "priority": "high",
            },
            headers={
                "Content-Type": "application/json",
                "Accept": "application/json",
            },
        )


async def send_monthly_notifications():
    now = datetime.now(BRT)
    year = now.year
    month = now.month

    tokens = await get_all_active_tokens()

    for token_row in tokens:
        device_id = token_row["device_id"]
        expo_token = token_row["expo_token"]

        summary = await get_monthly_summary(device_id, year, month)

        if summary["total"] == 0:
            body = (
                f"Em {MONTH_NAMES_PT[month]} você não registrou nenhum momento de tristeza. "
                f"Que bom! 💙"
            )
        else:
            body = (
                f"Em {MONTH_NAMES_PT[month]} você registrou {summary['total']} momentos de tristeza. "
            )
            if summary["worst_day"]:
                body += f"Dia mais intenso: {summary['worst_day']} ({summary['worst_day_count']} toques). "
            if summary["most_common_hour"]:
                body += f"Horário mais comum: {summary['most_common_hour']}. "
            body += "💙"

        await send_push(
            expo_token,
            "Resumo do mês 💙",
            body,
        )


def is_last_day_of_month() -> bool:
    now = datetime.now(BRT)
    last_day = calendar.monthrange(now.year, now.month)[1]
    return now.day == last_day

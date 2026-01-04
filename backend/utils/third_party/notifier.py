import httpx
from core.config import settings


def send_notification(message: str):
    try:
        httpx.post(settings.SLACK_WEBHOOK_URL_HIGH_PRIORITY, json={"text": message})
    except Exception as e:
        print(f"Error sending notification: {e}")



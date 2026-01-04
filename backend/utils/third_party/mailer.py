import json
import httpx
from core.config import settings


def send_email(to_email: str, subject: str, body: str):
    try:
        url = "https://api.brevo.com/v3/smtp/email"
        headers = {
            "content-Type": "application/json",
            "api-key": settings.BREVO_SECRET_API_KEY
        }
        payload = json.dumps(
            {
                "sender": {"name": "Sourabh", "email": settings.FROM_EMAIL},
                "to": [{"email": f"{to_email}"}],
                "subject": subject,
                "textContent": body,
            }
        )
        response = httpx.post(url, headers=headers, data=payload)
        return response.json()
    except Exception as e:
        print(f"Error sending email: {e}")
        return None
            
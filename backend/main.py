from fastapi import FastAPI, Request, Response
from core.config import settings
from utils.openrouter.completion import text_completion_with_tracing
from schemas.completion import CompletionRequest
from utils.rate_limiter import limiter
from utils.constants import constants
from schemas.mailer import EmailRequest
from utils.third_party.mailer import send_email
from utils.admin_auth import AdminAuth
from admin.user import UserAdmin
from sqladmin import Admin
from database.db import engine
from apis.base import router as api_router
from fastapi.middleware.cors import CORSMiddleware


app = FastAPI(title=settings.APP_NAME, description=settings.APP_DESCRIPTION, docs_url="/api/docs")
app.include_router(api_router)
app.add_middleware(CORSMiddleware, allow_origins=["*"], allow_credentials=True, allow_methods=["*"], allow_headers=["*"])
admin = Admin(app, engine, authentication_backend=AdminAuth(secret_key=settings.SECRET_KEY))
admin.add_view(UserAdmin)

@app.get("/")
async def root(request: Request):
    return {"message": "Hello World"}


@app.post("/completion")
@limiter.limit(constants.ONE_PER_ONE_MINUTE)
async def completion(request: Request, data: CompletionRequest):
    system_prompt = "Please respond to the user's prompt in a friendly and helpful manner."
    messages = [
        {"role": "system", "content": system_prompt},
        {"role": "user", "content": data.user_prompt},
    ]
    response = text_completion_with_tracing(messages, data.model)
    return {"response": response.choices[0].message.content}


@app.post("/email")
@limiter.limit(constants.ONE_PER_ONE_MINUTE)
def send_email_api(request: Request, data: EmailRequest):
    send_email(data.to_email, data.subject, data.body)
    return Response(status_code=200)
    
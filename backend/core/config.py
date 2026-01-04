from ast import Str
from pydantic import Field
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8"
    )
    
    ENVIRONMENT: str = Field(..., env="ENVIRONMENT")
    PLATFORM_URL: str = Field(..., env="PLATFORM_URL")
    SECRET_KEY: str = Field(..., env="SECRET_KEY")
    ADMIN_USERNAME: str = Field(..., env="ADMIN_USERNAME")
    ADMIN_PASSWORD: str = Field(..., env="ADMIN_PASSWORD")

    DB_HOST: str = Field(..., env="DB_HOST")
    DB_NAME: str = Field(..., env="DB_NAME")
    DB_USER: str = Field(..., env="DB_USER")
    DB_PASSWORD: str = Field(..., env="DB_PASSWORD")
    DB_PORT: int = Field(..., env="DB_PORT")

    APP_NAME: str = "InteractiveLabs"
    APP_VERSION: str = "1.0.0"
    APP_DESCRIPTION: str = "InteractiveLabs API for using in browser IDE"

    OPENROUTER_API_KEY: str = Field(..., env="OPENROUTER_API_KEY")

    LANGFUSE_PUBLIC_KEY: str = Field(..., env="LANGFUSE_PUBLIC_KEY")
    LANGFUSE_SECRET_KEY: str = Field(..., env="LANGFUSE_SECRET_KEY")
    LANGFUSE_HOST: str = Field(..., env="LANGFUSE_HOST")

    SLACK_WEBHOOK_URL_HIGH_PRIORITY : str = Field(..., env="SLACK_WEBHOOK_URL_HIGH_PRIORITY")
    SLACK_WEBHOOK_URL_LOW_PRIORITY : str = Field(..., env="SLACK_WEBHOOK_URL_LOW_PRIORITY")

    FROM_EMAIL: str = Field(..., env="FROM_EMAIL")
    BREVO_SECRET_API_KEY: str = Field(..., env="BREVO_API_KEY")

    @property
    def DB_URL(self):
        return f"postgresql://{self.DB_USER}:{self.DB_PASSWORD}@{self.DB_HOST}:{self.DB_PORT}/{self.DB_NAME}"


settings = Settings()
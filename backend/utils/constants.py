from enum import Enum


class Constants:
    DEFAULT_TEMPERATURE = 1.0
    HIGH_TEMPERATURE = 1.2
    LOW_TEMPERATURE = 0.8
    ONE_PER_ONE_MINUTE = "1/minute"
    SLOW_RATE_LIMIT = "5/minute"
    ACCESS_TOKEN_EXPIRE_MINUTES = 30 * 24 * 60 * 60  # 30 days in seconds


constants = Constants()


class LLMModels(str, Enum):
    CLAUDE = "claude"
    DEEPSEEK = "deepseek"
    GEMINI = "gemini"
    GEMINI_CHEAP = "gemini-cheap"
    OPENAI = "openai"
    PERPLEXITY = "perplexity"
    RANDOM = "random"
    XAI = "xai"
    WEB_SEARCH_MODELS = "web_search_models"


class Priority(Enum):
    HIGH = "high"
    LOW = "low"
# llm.py
import os
import time
import random
from dotenv import load_dotenv

from .constants import constants, LLMModels
from .router import openrouter_client

load_dotenv()


def get_random_model():
    models = [LLMModels.CLAUDE.value, LLMModels.DEEPSEEK.value, LLMModels.GEMINI.value, LLMModels.OPENAI.value, LLMModels.PERPLEXITY.value]
    return random.choice(models)


def get_web_search_model():
    return random.choice([LLMModels.GEMINI.value, LLMModels.PERPLEXITY.value, LLMModels.XAI.value, LLMModels.CLAUDE.value, LLMModels.OPENAI.value])


def rate_limit():
    print("Sleeping for 1 second")
    time.sleep(1)


def text_completion_with_tracing(
    messages: list, 
    model: str = LLMModels.GEMINI.value, 
    temperature: float = constants.DEFAULT_TEMPERATURE, 
    metadata: dict = {}, 
    rate_limit_enabled: bool = True, 
    enable_web_search: bool = False,
    web_search_engine: str = None,  # "native", "exa", or None for auto
    web_search_max_results: int = 5,
    web_search_context_size: str = "low"
):
    print(f"Model before: {model} enable_web_search: {enable_web_search}")
    
    if model == "random":
        model = get_random_model()

    if rate_limit_enabled:
        rate_limit()

    # If web search models requested, pick a compatible model
    if model == "web_search_models":
        model = get_web_search_model()

    completion_params = {
        "model": model,
        "messages": messages,
        "temperature": temperature,
        "metadata": metadata,
    }

    # Add web search configuration
    if enable_web_search:
        completion_params["enable_web_search"] = True
        completion_params["web_search_engine"] = web_search_engine
        completion_params["web_search_max_results"] = web_search_max_results
        completion_params["web_search_context_size"] = web_search_context_size

    try:
        response = openrouter_client.completion(**completion_params)
        
        if metadata.get("trace_name") == "question":
            actual_model = response.model if hasattr(response, 'model') else model
            return response, actual_model
        return response
    except Exception as e:
        print(f"Error: {e}")
        raise e
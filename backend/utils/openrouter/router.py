# openrouter.py
from langfuse.openai import openai
from dotenv import load_dotenv
from core.config import settings

load_dotenv()


class OpenRouterClient:
    def __init__(self):
        self.client = openai.OpenAI(
            base_url="https://openrouter.ai/api/v1",
            api_key=settings.OPENROUTER_API_KEY,
        )
        
        self.model_map = {
            "gemini-cheap" : "google/gemini-2.0-flash-001",
            "gemini": "google/gemini-2.5-flash",
            "openai": "openai/gpt-5-mini",
            "perplexity": "perplexity/sonar-reasoning",
            "deepseek": "deepseek/deepseek-v3.2",
            "xai": "x-ai/grok-4-fast",
            "claude": "anthropic/claude-sonnet-4.5",
        }
        
        self.fallbacks = {
            "gemini": ["perplexity"],
            "openai": ["claude"],
            "perplexity": ["gemini"],
            "deepseek": ["openai"],
            "xai": ["perplexity"],
            "claude": ["deepseek"],
        }
        self.native_search_providers = ["openai", "claude", "perplexity", "xai"]
    
    def get_openrouter_model(self, model_key: str) -> str:
        return self.model_map.get(model_key)
    
    def get_fallback_models(self, primary_model: str) -> list:
        fallback_keys = self.fallbacks.get(primary_model, [])
        return [self.get_openrouter_model(fb) for fb in fallback_keys]
    
    def supports_native_search(self, model_key: str) -> bool:
        return model_key in self.native_search_providers
    
    def completion(self, model: str, messages: list, temperature: float = 0.7, metadata: dict = None, enable_web_search: bool = False, web_search_engine: str = None, web_search_max_results: int = 5, web_search_context_size: str = "low", **kwargs):
        # web_search_engine: "native", "exa", or None for auto
        primary_model = self.get_openrouter_model(model)
        fallback_models = self.get_fallback_models(model)
        
        request_params = {
            "model": primary_model,
            "messages": messages,
            "temperature": temperature
        }
        
        extra_body = {}
        
        if enable_web_search:
            web_plugin = {
                "id": "web"
            }
            
            if web_search_engine:
                web_plugin["engine"] = web_search_engine
            
            if web_search_max_results != 5:
                web_plugin["max_results"] = web_search_max_results
                        
            extra_body["plugins"] = [web_plugin]
            
            if web_search_engine == "native" or (web_search_engine is None and self.supports_native_search(model)):
                if web_search_context_size in ["medium", "high"]:  # Only add if not default "low"
                    extra_body["web_search_options"] = {
                        "search_context_size": web_search_context_size
                    }
        
        if fallback_models:
            extra_body["models"] = [primary_model] + fallback_models
        
        if extra_body:
            request_params["extra_body"] = extra_body
        
        extra_headers = {
            "HTTP-Referer": metadata.get("site_url", settings.PLATFORM_URL) if metadata else settings.PLATFORM_URL,
            "X-Title": metadata.get("app_name", settings.APP_NAME) if metadata else settings.APP_NAME,
        }
        
        request_params["name"] = metadata.get("trace_name", "api_completion")
        
        try:
            response = self.client.chat.completions.create(
                **request_params,
                extra_headers=extra_headers,
                **kwargs
            )
            return response
        except Exception as e:
            print(f"Error with OpenRouter: {e}")
            raise e


openrouter_client = OpenRouterClient()
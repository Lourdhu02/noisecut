from pydantic_settings import BaseSettings
from functools import lru_cache

class Settings(BaseSettings):
    # Database
    POSTGRES_URL: str
    REDIS_URL: str

    # LLM
    USE_GROQ: bool = True
    GROQ_API_KEY: str = ""
    GROQ_MODEL: str = "llama3-8b-instruct"

    # Ollama (fallback)
    OLLAMA_BASE_URL: str = "http://localhost:11434"
    OLLAMA_MODEL: str = "mistral:7b-instruct-q4_K_M"

    # Embeddings
    EMBEDDING_MODEL: str = "all-MiniLM-L6-v2"

    # Scheduling
    INGESTION_INTERVAL: int = 1800
    DIGEST_TIME: str = "08:00"

    # Relevance
    RELEVANCE_THRESHOLD: int = 6

    # Telegram
    TELEGRAM_BOT_TOKEN: str = ""
    TELEGRAM_CHAT_ID: str = ""

    class Config:
        env_file = ".env"
        env_file_encoding = "utf-8"

@lru_cache()
def get_settings() -> Settings:
    return Settings()
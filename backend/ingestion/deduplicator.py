import redis as redis_lib
from backend.config import get_settings
from backend.utils.logger import get_logger

logger = get_logger(__name__)
settings = get_settings()

r = redis_lib.from_url(settings.REDIS_URL)

def is_duplicate(url: str) -> bool:
    key = f"seen:url:{url}"
    if r.exists(key):
        return True
    return False

def mark_seen(url: str, ttl_days: int = 7) -> None:
    key = f"seen:url:{url}"
    r.setex(key, ttl_days * 86400, "1")
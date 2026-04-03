import httpx
from datetime import datetime
from backend.utils.logger import get_logger

logger = get_logger(__name__)

DEVTO_API_URL = "https://dev.to/api/articles"

async def fetch_devto(limit: int = 20) -> list[dict]:
    params = {
        "per_page": limit,
        "top": 1,
    }
    try:
        async with httpx.AsyncClient(timeout=10) as client:
            response = await client.get(DEVTO_API_URL, params=params)
            response.raise_for_status()
            data = response.json()
            items = []
            for article in data:
                published_at = None
                if article.get("published_at"):
                    published_at = datetime.fromisoformat(
                        article["published_at"].replace("Z", "+00:00")
                    )
                items.append({
                    "source": "devto",
                    "title": article.get("title", ""),
                    "url": article.get("url", ""),
                    "content": article.get("description", ""),
                    "author": article.get("user", {}).get("name", ""),
                    "published_at": published_at,
                })
            logger.info(f"Fetched {len(items)} items from Dev.to")
            return items
    except Exception as e:
        logger.error(f"Error fetching Dev.to: {e}")
        return []
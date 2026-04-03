import httpx
from datetime import datetime
from backend.utils.logger import get_logger

logger = get_logger(__name__)

HN_API_URL = "https://hn.algolia.com/api/v1/search_by_date"

async def fetch_hackernews(limit: int = 30) -> list[dict]:
    params = {
        "tags": "story",
        "hitsPerPage": limit,
    }
    try:
        async with httpx.AsyncClient(timeout=10) as client:
            response = await client.get(HN_API_URL, params=params)
            response.raise_for_status()
            data = response.json()
            items = []
            for hit in data.get("hits", []):
                url = hit.get("url") or f"https://news.ycombinator.com/item?id={hit.get('objectID')}"
                items.append({
                    "source": "hackernews",
                    "title": hit.get("title", ""),
                    "url": url,
                    "content": hit.get("story_text", ""),
                    "author": hit.get("author", ""),
                    "published_at": datetime.fromisoformat(hit["created_at"].replace("Z", "+00:00")) if hit.get("created_at") else None,
                })
            logger.info(f"Fetched {len(items)} items from Hacker News")
            return items
    except Exception as e:
        logger.error(f"Error fetching Hacker News: {e}")
        return []
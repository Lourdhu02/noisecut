import httpx
from bs4 import BeautifulSoup
from datetime import datetime
from backend.utils.logger import get_logger

logger = get_logger(__name__)

GITHUB_TRENDING_URL = "https://github.com/trending"

async def fetch_github_trending(limit: int = 20) -> list[dict]:
    headers = {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36"
    }
    try:
        async with httpx.AsyncClient(timeout=15, headers=headers) as client:
            response = await client.get(GITHUB_TRENDING_URL)
            response.raise_for_status()
            soup = BeautifulSoup(response.text, "html.parser")
            items = []
            repos = soup.select("article.Box-row")[:limit]
            for repo in repos:
                name_tag = repo.select_one("h2 a")
                if not name_tag:
                    continue
                repo_path = name_tag.get("href", "").strip("/")
                url = f"https://github.com/{repo_path}"
                title = repo_path.replace("/", " / ")
                desc_tag = repo.select_one("p")
                content = desc_tag.text.strip() if desc_tag else ""
                lang_tag = repo.select_one("[itemprop='programmingLanguage']")
                language = lang_tag.text.strip() if lang_tag else ""
                items.append({
                    "source": "github",
                    "title": title,
                    "url": url,
                    "content": content,
                    "author": language,
                    "published_at": datetime.utcnow(),
                })
            logger.info(f"Fetched {len(items)} items from GitHub Trending")
            return items
    except Exception as e:
        logger.error(f"Error fetching GitHub Trending: {e}")
        return []
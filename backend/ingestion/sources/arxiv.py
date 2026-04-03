import httpx
import xml.etree.ElementTree as ET
from datetime import datetime
from backend.utils.logger import get_logger

logger = get_logger(__name__)

ARXIV_API_URL = "https://export.arxiv.org/api/query"

async def fetch_arxiv(limit: int = 20) -> list[dict]:
    params = {
        "search_query": "cat:cs.AI OR cat:cs.LG OR cat:cs.CL",
        "start": 0,
        "max_results": limit,
        "sortBy": "submittedDate",
        "sortOrder": "descending",
    }
    try:
        async with httpx.AsyncClient(timeout=15) as client:
            response = await client.get(ARXIV_API_URL, params=params)
            response.raise_for_status()
            root = ET.fromstring(response.text)
            ns = {"atom": "http://www.w3.org/2005/Atom"}
            items = []
            for entry in root.findall("atom:entry", ns):
                title = entry.find("atom:title", ns).text.strip()
                url = entry.find("atom:id", ns).text.strip()
                summary = entry.find("atom:summary", ns).text.strip()
                published_str = entry.find("atom:published", ns).text.strip()
                published_at = datetime.fromisoformat(published_str.replace("Z", "+00:00"))
                authors = [
                    a.find("atom:name", ns).text
                    for a in entry.findall("atom:author", ns)
                ]
                items.append({
                    "source": "arxiv",
                    "title": title,
                    "url": url,
                    "content": summary,
                    "author": ", ".join(authors[:3]),
                    "published_at": published_at,
                })
            logger.info(f"Fetched {len(items)} items from ArXiv")
            return items
    except Exception as e:
        logger.error(f"Error fetching ArXiv: {e}")
        return []
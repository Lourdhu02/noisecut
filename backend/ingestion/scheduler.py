from apscheduler.schedulers.asyncio import AsyncIOScheduler
from backend.ingestion.sources.hackernews import fetch_hackernews
from backend.ingestion.sources.arxiv import fetch_arxiv
from backend.ingestion.sources.devto import fetch_devto
from backend.ingestion.sources.github_trending import fetch_github_trending
from backend.ingestion.deduplicator import is_duplicate, mark_seen
from backend.db.session import SessionLocal
from backend.models.feed_item import FeedItem
from backend.models.processed_item import ProcessedItem
from backend.pipeline.relevance import score_relevance
from backend.pipeline.summarizer import summarize
from backend.pipeline.breaking_change import is_breaking_change
from backend.utils.logger import get_logger
from backend.config import get_settings
from backend.vector_store.chroma_client import upsert_item
from backend.api.routes.websocket import manager


logger = get_logger(__name__)
settings = get_settings()
scheduler = AsyncIOScheduler()

def get_user_profile():
    from backend.models.user_profile import UserProfile
    db = SessionLocal()
    try:
        profile = db.query(UserProfile).first()
        if profile:
            return profile.stack, profile.interests, profile.relevance_threshold
        return (
            "python,pytorch,fastapi,llms,mlops,ai,react",
            "llms,mlops,quantization,ai,machine learning,open source",
            4
        )
    finally:
        db.close()

async def ingest_source(fetch_fn, limit: int = 30):
    items = await fetch_fn(limit=limit)
    db = SessionLocal()
    saved = 0
    processed = 0
    try:
        for item in items:
            if not item["url"] or is_duplicate(item["url"]):
                continue
            feed_item = FeedItem(
                source=item["source"],
                title=item["title"],
                url=item["url"],
                content=item["content"],
                author=item["author"],
                published_at=item["published_at"],
                is_processed=False,
            )
            db.add(feed_item)
            db.flush()
            mark_seen(item["url"])
            saved += 1

            # LLM pipeline
            stack, interests, threshold = get_user_profile()
            score = score_relevance(
                title=item["title"],
                source=item["source"],
                content=item["content"] or "",
                stack=stack,
                interests=interests,
            )

            if score >= threshold:
                summary = summarize(item["title"], item["content"] or "")
                breaking = is_breaking_change(
                    item["title"], item["content"] or "", stack
                )
                processed_item = ProcessedItem(
                    feed_item_id=feed_item.id,
                    source=item["source"],
                    title=item["title"],
                    url=item["url"],
                    summary=summary,
                    relevance_score=score,
                    is_breaking_change=breaking,
                )
                db.add(processed_item)
                upsert_item(feed_item.id, item["title"], summary, item["source"], item["url"])
                feed_item.is_processed = True
                processed += 1

                if breaking:
                    import asyncio
                    asyncio.create_task(manager.broadcast({
                        "type": "breaking_change",
                        "title": item["title"],
                        "url": item["url"],
                        "source": item["source"],
                        "score": score,
                    }))

        db.commit()
        source_name = items[0]["source"] if items else "unknown"
        logger.info(f"Saved {saved} new, {processed} passed relevance filter from {source_name}")
    except Exception as e:
        db.rollback()
        logger.error(f"Error in ingestion pipeline: {e}")
    finally:
        db.close()

async def ingest_all():
    await ingest_source(fetch_hackernews)
    await ingest_source(fetch_arxiv)
    await ingest_source(fetch_devto)
    await ingest_source(fetch_github_trending)

def start_scheduler():
    scheduler.add_job(
        ingest_all,
        "interval",
        seconds=settings.INGESTION_INTERVAL,
        id="ingest_all",
        replace_existing=True,
    )
    scheduler.start()
    logger.info("Scheduler started")
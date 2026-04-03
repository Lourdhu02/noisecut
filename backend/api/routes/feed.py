from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session
from backend.db.session import get_db
from backend.models.feed_item import FeedItem
from backend.models.processed_item import ProcessedItem

router = APIRouter()

@router.get("/feed")
def get_feed(
    limit: int = Query(default=20, le=100),
    offset: int = Query(default=0),
    source: str = Query(default=None),
    db: Session = Depends(get_db)
):
    query = db.query(FeedItem).order_by(FeedItem.ingested_at.desc())
    if source:
        query = query.filter(FeedItem.source == source)
    total = query.count()
    items = query.offset(offset).limit(limit).all()
    return {
        "total": total,
        "offset": offset,
        "limit": limit,
        "items": [
            {
                "id": item.id,
                "source": item.source,
                "title": item.title,
                "url": item.url,
                "author": item.author,
                "published_at": item.published_at,
                "ingested_at": item.ingested_at,
                "is_processed": item.is_processed,
            }
            for item in items
        ]
    }

@router.get("/feed/processed")
def get_processed_feed(
    limit: int = Query(default=20, le=100),
    offset: int = Query(default=0),
    source: str = Query(default=None),
    db: Session = Depends(get_db)
):
    query = db.query(ProcessedItem).order_by(ProcessedItem.processed_at.desc())
    if source:
        query = query.filter(ProcessedItem.source == source)
    total = query.count()
    items = query.offset(offset).limit(limit).all()
    return {
        "total": total,
        "offset": offset,
        "limit": limit,
        "items": [
            {
                "id": item.id,
                "source": item.source,
                "title": item.title,
                "url": item.url,
                "summary": item.summary,
                "relevance_score": item.relevance_score,
                "is_breaking_change": item.is_breaking_change,
                "processed_at": item.processed_at,
            }
            for item in items
        ]
    }

@router.get("/feed/digest")
def get_digest(db: Session = Depends(get_db)):
    from datetime import datetime, timedelta
    since = datetime.utcnow() - timedelta(hours=24)
    items = (
        db.query(ProcessedItem)
        .filter(ProcessedItem.processed_at >= since)
        .order_by(ProcessedItem.relevance_score.desc())
        .limit(10)
        .all()
    )
    return {
        "period": "last_24h",
        "count": len(items),
        "items": [
            {
                "source": item.source,
                "title": item.title,
                "url": item.url,
                "summary": item.summary,
                "relevance_score": item.relevance_score,
                "is_breaking_change": item.is_breaking_change,
            }
            for item in items
        ]
    }
from sqlalchemy import Column, Integer, String, Text, DateTime, Boolean
from backend.models import Base
from datetime import datetime

class FeedItem(Base):
    __tablename__ = "feed_items"

    id = Column(Integer, primary_key=True, index=True)
    source = Column(String(50), nullable=False)
    title = Column(String(500), nullable=False)
    url = Column(String(1000), unique=True, nullable=False)
    content = Column(Text, nullable=True)
    author = Column(String(200), nullable=True)
    published_at = Column(DateTime, nullable=True)
    ingested_at = Column(DateTime, default=datetime.utcnow)
    is_processed = Column(Boolean, default=False)

    def __repr__(self):
        return f"<FeedItem {self.source}: {self.title[:50]}>"
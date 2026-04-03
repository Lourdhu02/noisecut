from sqlalchemy import Column, Integer, String, Text, DateTime, Float, Boolean, ForeignKey
from backend.models import Base
from datetime import datetime

class ProcessedItem(Base):
    __tablename__ = "processed_items"

    id = Column(Integer, primary_key=True, index=True)
    feed_item_id = Column(Integer, ForeignKey("feed_items.id"), nullable=False)
    source = Column(String(50), nullable=False)
    title = Column(String(500), nullable=False)
    url = Column(String(1000), nullable=False)
    summary = Column(Text, nullable=True)
    relevance_score = Column(Float, nullable=False)
    is_breaking_change = Column(Boolean, default=False)
    tags = Column(String(500), nullable=True)
    processed_at = Column(DateTime, default=datetime.utcnow)

    def __repr__(self):
        return f"<ProcessedItem {self.title[:50]} score={self.relevance_score}>"
from sqlalchemy import Column, Integer, String, Text, DateTime
from backend.models import Base
from datetime import datetime

class UserProfile(Base):
    __tablename__ = "user_profiles"

    id = Column(Integer, primary_key=True, index=True)
    stack = Column(Text, nullable=False)
    interests = Column(Text, nullable=True)
    relevance_threshold = Column(Integer, default=6)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    def __repr__(self):
        return f"<UserProfile stack={self.stack[:50]}>"
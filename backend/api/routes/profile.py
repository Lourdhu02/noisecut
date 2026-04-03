from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from pydantic import BaseModel
from backend.db.session import get_db
from backend.models.user_profile import UserProfile

router = APIRouter()

class ProfileUpdate(BaseModel):
    stack: str
    interests: str
    relevance_threshold: int = 4

@router.get("/profile")
def get_profile(db: Session = Depends(get_db)):
    profile = db.query(UserProfile).first()
    if not profile:
        profile = UserProfile(
            stack="python,pytorch,fastapi,llms,mlops,ai,react",
            interests="llms,mlops,quantization,ai,machine learning,open source",
            relevance_threshold=4
        )
        db.add(profile)
        db.commit()
        db.refresh(profile)
    return {
        "id": profile.id,
        "stack": profile.stack,
        "interests": profile.interests,
        "relevance_threshold": profile.relevance_threshold,
        "updated_at": profile.updated_at
    }

@router.post("/profile")
def update_profile(data: ProfileUpdate, db: Session = Depends(get_db)):
    profile = db.query(UserProfile).first()
    if not profile:
        profile = UserProfile()
        db.add(profile)
    profile.stack = data.stack
    profile.interests = data.interests
    profile.relevance_threshold = data.relevance_threshold
    db.commit()
    db.refresh(profile)
    return {
        "id": profile.id,
        "stack": profile.stack,
        "interests": profile.interests,
        "relevance_threshold": profile.relevance_threshold,
        "updated_at": profile.updated_at
    }
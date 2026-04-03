from groq import Groq
from backend.config import get_settings
from backend.utils.logger import get_logger

logger = get_logger(__name__)
settings = get_settings()
client = Groq(api_key=settings.GROQ_API_KEY)

RELEVANCE_PROMPT = """You are a tech relevance filter. Given a feed item and a user's tech stack, score how relevant the item is.

User's stack: {stack}
User's interests: {interests}

Feed item:
Title: {title}
Source: {source}
Content: {content}

Score this item from 0 to 10 based on how relevant it is to the user's stack and interests.
- 0-3: Not relevant at all
- 4-5: Slightly relevant
- 6-7: Relevant
- 8-10: Highly relevant

Reply with ONLY a single integer number between 0 and 10. Nothing else."""

def score_relevance(title: str, source: str, content: str, stack: str, interests: str) -> float:
    try:
        prompt = RELEVANCE_PROMPT.format(
            stack=stack,
            interests=interests,
            title=title,
            source=source,
            content=content[:500] if content else "",
        )
        response = client.chat.completions.create(
            model=settings.GROQ_MODEL,
            messages=[{"role": "user", "content": prompt}],
            max_tokens=5,
            temperature=0,
        )
        score_str = response.choices[0].message.content.strip()
        score = float(score_str)
        return min(max(score, 0), 10)
    except Exception as e:
        logger.error(f"Error scoring relevance: {e}")
        return 0.0
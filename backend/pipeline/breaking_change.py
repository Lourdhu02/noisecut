from groq import Groq
from backend.config import get_settings
from backend.utils.logger import get_logger

logger = get_logger(__name__)
settings = get_settings()
client = Groq(api_key=settings.GROQ_API_KEY)

BREAKING_CHANGE_PROMPT = """You are a breaking change detector for software tools.

User's stack: {stack}

Feed item:
Title: {title}
Content: {content}

Does this item contain a breaking change, deprecation, major version bump, or critical update for any tool in the user's stack?

Reply with only YES or NO."""

def is_breaking_change(title: str, content: str, stack: str) -> bool:
    try:
        prompt = BREAKING_CHANGE_PROMPT.format(
            stack=stack,
            title=title,
            content=content[:500] if content else "",
        )
        response = client.chat.completions.create(
            model=settings.GROQ_MODEL,
            messages=[{"role": "user", "content": prompt}],
            max_tokens=5,
            temperature=0,
        )
        answer = response.choices[0].message.content.strip().upper()
        return answer == "YES"
    except Exception as e:
        logger.error(f"Error detecting breaking change: {e}")
        return False
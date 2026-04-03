from groq import Groq
from backend.config import get_settings
from backend.utils.logger import get_logger

logger = get_logger(__name__)
settings = get_settings()
client = Groq(api_key=settings.GROQ_API_KEY)

SUMMARY_PROMPT = """Summarize the following tech article in 2-3 sentences. Be concise and focus on what's new or important.

Title: {title}
Content: {content}

Reply with only the summary. No preamble."""

def summarize(title: str, content: str) -> str:
    try:
        prompt = SUMMARY_PROMPT.format(
            title=title,
            content=content[:1000] if content else "No content available.",
        )
        response = client.chat.completions.create(
            model=settings.GROQ_MODEL,
            messages=[{"role": "user", "content": prompt}],
            max_tokens=150,
            temperature=0.3,
        )
        return response.choices[0].message.content.strip()
    except Exception as e:
        logger.error(f"Error summarizing: {e}")
        return ""
# NoiseCut

A self-hosted, real-time tech intelligence tool that filters the noise from Hacker News, GitHub Trending, ArXiv, and Dev.to and surfaces only what matters to your stack.

Zero cloud cost. Fully open source. Runs locally.

---

## What It Does

Engineers waste hours scanning multiple feeds daily. 90% of it is irrelevant. NoiseCut uses an LLM pipeline to score each item against your tech stack and interests, filters out the noise, summarizes what is relevant, and flags breaking changes instantly.

---

## Features

- 4 live sources: Hacker News, GitHub Trending, ArXiv, Dev.to
- LLM relevance scoring: each item scored 0-10 against your stack using Groq API
- Breaking change detection: flagged immediately via WebSocket push
- Semantic search: query your feed history in natural language
- Daily digest: top items from the last 24 hours
- Stack profile editor: configure your stack and interests from the UI
- Real-time alerts: WebSocket push for breaking changes as they arrive
- Redis deduplication: no duplicate processing across runs
- Fully Dockerized: one command to start everything

---

## Tech Stack

| Layer          | Technology                              |
|----------------|-----------------------------------------|
| Backend        | Python 3.11, FastAPI, APScheduler       |
| LLM            | Groq API (llama-3.1-8b-instant)         |
| Embeddings     | sentence-transformers (all-MiniLM-L6-v2)|
| Vector Store   | ChromaDB (local, persisted to disk)     |
| Database       | PostgreSQL 14                           |
| Cache / Dedup  | Redis                                   |
| Frontend       | React 18 + Vite                         |
| Proxy          | Nginx                                   |
| Infrastructure | Docker + Docker Compose                 |

---

## Getting Started

### Prerequisites

- Docker Desktop
- Groq API key, free at https://console.groq.com

### 1. Clone the repo

```bash
git clone https://github.com/Lourdhu02/noisecut.git
cd noisecut
```

### 2. Configure environment

```bash
cp .env.example .env
```

Open `.env` and set:

```
GROQ_API_KEY=your_groq_api_key_here
```

Everything else works out of the box.

### 3. Start

```bash
docker-compose up --build
```

### 4. Run database migrations (first time only)

```bash
docker-compose exec backend alembic upgrade head
```

### 5. Trigger first ingestion

```bash
docker-compose exec backend python -c "import asyncio; from backend.ingestion.scheduler import ingest_all; asyncio.run(ingest_all())"
```

### 6. Open the app

```
http://localhost
```

---

## Environment Variables

| Variable             | Description                          | Default               |
|----------------------|--------------------------------------|-----------------------|
| POSTGRES_URL         | PostgreSQL connection string         | set in compose        |
| REDIS_URL            | Redis connection string              | set in compose        |
| GROQ_API_KEY         | Groq API key                         | required              |
| GROQ_MODEL           | Groq model name                      | llama-3.1-8b-instant  |
| EMBEDDING_MODEL      | Sentence transformer model           | all-MiniLM-L6-v2      |
| INGESTION_INTERVAL   | Feed polling interval in seconds     | 1800                  |
| RELEVANCE_THRESHOLD  | Minimum score to keep an item (0-10) | 4                     |
| DIGEST_TIME          | Daily digest time                    | 08:00                 |

---

## Data Flow

```
[HN / GitHub / ArXiv / Dev.to]
        |
[Ingestion Service] - APScheduler, every 30 min
        |
[Redis Deduplication] - skip already seen URLs
        |
[PostgreSQL] - store raw feed items
        |
[Groq LLM Pipeline]
  - Relevance scoring (0-10)
  - Summarization
  - Breaking change detection
        |
[ChromaDB] - embed and store for semantic search
        |
[WebSocket] - push breaking changes to browser
        |
[React Dashboard] - feed, digest, search, profile
```

---

## Project Structure

```
noisecut/
├── backend/
│   ├── api/routes/        # FastAPI endpoints
│   ├── ingestion/         # Feed sources and scheduler
│   ├── pipeline/          # LLM relevance, summarizer, breaking change
│   ├── models/            # SQLAlchemy models
│   ├── vector_store/      # ChromaDB client
│   ├── db/                # Session and Alembic migrations
│   └── utils/             # Logger, text cleaner
├── frontend/
│   └── src/
│       ├── components/    # FeedList, FeedCard, SearchBar, AlertBanner, ProfileEditor
│       ├── hooks/         # useWebSocket
│       └── api/           # Axios client
├── nginx/
│   └── nginx.conf
├── docker-compose.yml
└── .env.example
```

---

## API Endpoints

| Method | Endpoint              | Description                          |
|--------|-----------------------|--------------------------------------|
| GET    | /health               | Health check                         |
| GET    | /api/feed             | All raw feed items                   |
| GET    | /api/feed/processed   | LLM-filtered items with summaries    |
| GET    | /api/feed/digest      | Top items from last 24 hours         |
| POST   | /api/search           | Semantic search                      |
| GET    | /api/profile          | Get user stack profile               |
| POST   | /api/profile          | Update user stack profile            |
| WS     | /ws/live              | Real-time breaking change alerts     |

Full interactive docs available at http://localhost:8000/docs

---

## License

MIT

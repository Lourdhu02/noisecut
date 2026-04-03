import chromadb
from sentence_transformers import SentenceTransformer
from backend.utils.logger import get_logger

logger = get_logger(__name__)

CHROMA_PATH = "./chroma_data"
COLLECTION_NAME = "noisecut_items"

chroma_client = chromadb.PersistentClient(path=CHROMA_PATH)
collection = chroma_client.get_or_create_collection(name=COLLECTION_NAME)
embedding_model = SentenceTransformer("all-MiniLM-L6-v2")

def upsert_item(item_id: int, title: str, summary: str, source: str, url: str):
    try:
        text = f"{title}. {summary}"
        embedding = embedding_model.encode(text).tolist()
        collection.upsert(
            ids=[str(item_id)],
            embeddings=[embedding],
            documents=[text],
            metadatas=[{"source": source, "url": url, "title": title}]
        )
        logger.info(f"Upserted item {item_id} to ChromaDB")
    except Exception as e:
        logger.error(f"Error upserting to ChromaDB: {e}")

def query_items(query_text: str, n_results: int = 5) -> list[dict]:
    try:
        embedding = embedding_model.encode(query_text).tolist()
        results = collection.query(
            query_embeddings=[embedding],
            n_results=n_results,
        )
        items = []
        for i, doc in enumerate(results["documents"][0]):
            items.append({
                "id": results["ids"][0][i],
                "document": doc,
                "metadata": results["metadatas"][0][i],
                "distance": results["distances"][0][i],
            })
        return items
    except Exception as e:
        logger.error(f"Error querying ChromaDB: {e}")
        return []
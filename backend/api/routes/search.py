from fastapi import APIRouter
from pydantic import BaseModel
from backend.vector_store.chroma_client import query_items

router = APIRouter()

class SearchRequest(BaseModel):
    query: str
    n_results: int = 5

@router.post("/search")
def semantic_search(request: SearchRequest):
    results = query_items(request.query, n_results=request.n_results)
    return {
        "query": request.query,
        "results": results
    }
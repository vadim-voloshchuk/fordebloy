# backend/routers/clustering.py
from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import List

from models.graph_models import Node, Edge
from services.clustering import perform_clustering

router = APIRouter()

class ClusteringRequest(BaseModel):
    nodes: List[Node]
    edges: List[Edge]
    method: str
    n_clusters: int = 2

@router.post("/run")
def clustering_route(data: ClusteringRequest):
    try:
        labels = perform_clustering(data.nodes, data.edges, data.method, data.n_clusters)
        return {"labels": labels}
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Internal server error: {str(e)}")

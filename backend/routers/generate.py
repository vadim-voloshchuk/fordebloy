# backend/routers/generate.py
from fastapi import APIRouter
from models.generate_models import GraphGenerateRequest
from services.generate import generate_random_graph

router = APIRouter()

@router.post("/generate")
def generate_graph(data: GraphGenerateRequest):
    graph = generate_random_graph(
        num_nodes=data.num_nodes,
        edge_probability=data.edge_probability,
        directed=data.directed,
        min_weight=data.min_weight,
        max_weight=data.max_weight,
        node_type_range=[0, 1, 2],     # или сделай это параметром, если хочешь
        edge_type_range=[0, 1, 2, 3]
    )
    return graph

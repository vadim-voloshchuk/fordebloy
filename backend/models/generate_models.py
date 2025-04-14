# backend/models/generate_models.py
from pydantic import BaseModel, Field

class GraphGenerateRequest(BaseModel):
    num_nodes: int = Field(..., ge=1, le=1000, description="Количество вершин")
    edge_probability: float = Field(..., ge=0.0, le=1.0, description="Вероятность создания ребра между двумя вершинами")
    directed: bool = Field(False, description="Ориентированный граф или нет")
    min_weight: float = Field(1.0, description="Минимальный вес ребра")
    max_weight: float = Field(10.0, description="Максимальный вес ребра")

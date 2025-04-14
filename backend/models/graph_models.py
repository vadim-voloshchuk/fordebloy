from pydantic import BaseModel, Field
from typing import List, Optional

class Node(BaseModel):
    id: int
    node_type: int = 0

class Edge(BaseModel):
    id: int
    from_: int = Field(..., alias='from')
    to: int
    weights: float = 1.0
    directed: bool = False
    edge_type: int = 0

    class Config:
        validate_by_name = True  # ⚠️ Pydantic v2 (замена allow_population_by_field_name)

class GraphAlgorithmRequest(BaseModel):
    nodes: List[Node]
    edges: List[Edge]
    allowed_node_types: Optional[List[int]] = None
    allowed_edge_types: Optional[List[int]] = None

class PathRequest(GraphAlgorithmRequest):
    start_node: int
    end_node: int

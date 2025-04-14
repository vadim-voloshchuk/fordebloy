# backend/services/distances.py
from typing import List, Dict
from models.graph_models import Node, Edge

def floyd_warshall(graph: Dict[int, Dict[int, float]], nodes: List[Node], edges: List[Edge]) -> Dict[int, Dict[int, float]]:
    dist = {
        node.id: {n.id: float('inf') for n in nodes}
        for node in nodes
    }

    for node in nodes:
        dist[node.id][node.id] = 0.0

    for edge in edges:
        from_node = int(edge.from_)
        to_node = int(edge.to)
        weight = float(edge.weights)
        dist[from_node][to_node] = min(dist[from_node][to_node], weight)
        if not edge.directed:
            dist[to_node][from_node] = min(dist[to_node][from_node], weight)

    node_ids = [node.id for node in nodes]
    for k in node_ids:
        for i in node_ids:
            for j in node_ids:
                if dist[i][j] > dist[i][k] + dist[k][j]:
                    dist[i][j] = dist[i][k] + dist[k][j]

    return dist

def replace_infinity(d: Dict[int, Dict[int, float]]) -> None:
    for key, value in d.items():
        if isinstance(value, dict):
            replace_infinity(value)
        else:
            if value == float('inf'):
                d[key] = "∞"

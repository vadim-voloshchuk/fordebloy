# backend/services/core.py

from typing import List, Dict, Optional
from models.graph_models import Node, Edge

def build_graph(
    nodes: List[Node],
    edges: List[Edge],
    allowed_node_types: Optional[List[int]] = None,
    allowed_edge_types: Optional[List[int]] = None
) -> Dict[int, Dict[int, float]]:
    """
    Создаёт словарь graph[u][v] = вес, 
    фильтруя по node_type и edge_type при необходимости.
    """

    # Фильтруем узлы, если указаны allowed_node_types
    if allowed_node_types is not None:
        nodes = [n for n in nodes if n.node_type in allowed_node_types]

    # Собираем множество (ID) "разрешённых" узлов
    allowed_node_ids = set(node.id for node in nodes)

    graph = {node.id: {} for node in nodes}

    for edge in edges:
        # Фильтруем рёбра, если указаны allowed_edge_types
        if allowed_edge_types is not None and edge.edge_type not in allowed_edge_types:
            continue

        # Также проверяем, что обе вершины присутствуют в allowed_node_ids
        if edge.from_ not in allowed_node_ids or edge.to not in allowed_node_ids:
            continue

        from_node = edge.from_
        to_node = edge.to
        weight = edge.weights

        graph[from_node][to_node] = weight

        # Если ребро неориентированное, добавляем обратное
        if not edge.directed:
            graph[to_node][from_node] = weight

    return graph

def bfs(graph: Dict[int, Dict[int, float]], start: int) -> List[int]:
    visited = set()
    queue = [start]
    order = []

    while queue:
        vertex = queue.pop(0)
        if vertex not in visited:
            visited.add(vertex)
            order.append(vertex)
            for neighbor in graph.get(vertex, {}):
                if neighbor not in visited:
                    queue.append(neighbor)

    return order


def dfs(graph: Dict[int, Dict[int, float]], start: int, visited=None, order=None) -> List[int]:
    if visited is None:
        visited = set()
    if order is None:
        order = []

    visited.add(start)
    order.append(start)

    for neighbor in graph.get(start, {}):
        if neighbor not in visited:
            dfs(graph, neighbor, visited, order)

    return order


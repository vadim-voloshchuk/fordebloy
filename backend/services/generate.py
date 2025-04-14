import random
from typing import List, Dict, Optional

def generate_random_graph(
    num_nodes: int,
    edge_probability: float,
    directed: bool = False,
    min_weight: float = 1.0,
    max_weight: float = 10.0,
    node_type_range: Optional[List[int]] = None,
    edge_type_range: Optional[List[int]] = None
) -> Dict[str, List[Dict]]:
    """
    Генерация случайного графа с поддержкой типов вершин и связей.
    """
    # По умолчанию все узлы/рёбра будут с type = 0
    node_type_range = node_type_range or [0]
    edge_type_range = edge_type_range or [0]

    nodes = [
        {
            "id": i,
            "node_type": random.choice(node_type_range)
        }
        for i in range(num_nodes)
    ]

    edges = []
    edge_id = 0

    for i in range(num_nodes):
        for j in range(num_nodes):
            if i == j:
                continue
            if not directed and j < i:
                continue
            if random.random() <= edge_probability:
                weight = round(random.uniform(min_weight, max_weight), 2)
                edge_type = random.choice(edge_type_range)
                edges.append({
                    "id": edge_id,
                    "from": i,
                    "to": j,
                    "weights": weight,
                    "directed": directed,
                    "edge_type": edge_type
                })
                edge_id += 1

    return {"nodes": nodes, "edges": edges}

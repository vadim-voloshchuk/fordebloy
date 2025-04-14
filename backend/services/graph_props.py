# backend/services/graph_props.py
from typing import Dict, List, Tuple
from models.graph_models import Node, Edge

def calculate_center_radius_diameter(distances: Dict[int, Dict[int, float]], nodes: List[Node]) -> Tuple[List[int], float, float]:
    eccentricities = {}
    node_ids = [n.id for n in nodes]

    for u in node_ids:
        finite_vals = [d for d in distances[u].values() if d != float('inf')]
        eccentricities[u] = max(finite_vals) if finite_vals else 0

    radius = min(eccentricities.values()) if eccentricities else 0
    diameter = max(eccentricities.values()) if eccentricities else 0
    center = [u for u, ecc in eccentricities.items() if ecc == radius]

    return center, radius, diameter

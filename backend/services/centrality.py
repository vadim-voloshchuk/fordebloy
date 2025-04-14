# backend/services/centrality.py
import networkx as nx
from typing import Dict

def calculate_centralities(graph: Dict[int, Dict[int, float]]) -> Dict[int, float]:
    G = nx.DiGraph()
    for u, neighbors in graph.items():
        for v, w in neighbors.items():
            G.add_edge(u, v, weight=w)

    betweenness = nx.betweenness_centrality(G, weight='weight', normalized=True)
    return betweenness

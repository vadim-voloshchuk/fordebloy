# backend/services/clustering.py
from typing import List
from sklearn.cluster import SpectralClustering, KMeans, DBSCAN
import numpy as np
from models.graph_models import Node, Edge

def perform_clustering(nodes: List[Node], edges: List[Edge], method: str, n_clusters: int = 2) -> List[int]:
    node_ids = [node.id for node in nodes]
    node_indices = {node_id: idx for idx, node_id in enumerate(node_ids)}
    size = len(nodes)
    adjacency_matrix = np.zeros((size, size))

    for edge in edges:
        from_idx = node_indices[int(edge.from_)]
        to_idx = node_indices[int(edge.to)]
        w = float(edge.weights)
        adjacency_matrix[from_idx][to_idx] = w
        if not edge.directed:
            adjacency_matrix[to_idx][from_idx] = w

    if method == 'spectral':
        clustering = SpectralClustering(n_clusters=n_clusters, affinity='precomputed').fit(adjacency_matrix)
    elif method == 'kmeans':
        clustering = KMeans(n_clusters=n_clusters).fit(adjacency_matrix)
    elif method == 'dbscan':
        clustering = DBSCAN().fit(adjacency_matrix)
    else:
        raise ValueError("Invalid clustering method. Use 'spectral', 'kmeans' or 'dbscan'.")

    return clustering.labels_.tolist()

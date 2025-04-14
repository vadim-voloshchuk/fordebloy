# backend/services/dijkstra.py
import heapq
from typing import Dict, Tuple

def dijkstra(graph: Dict[int, Dict[int, float]], start_vertex: int) -> Tuple[Dict[int, float], Dict[int, int]]:
    distances = {v: float('inf') for v in graph}
    distances[start_vertex] = 0.0
    shortest_path_tree = {}

    pq = [(0.0, start_vertex)]

    while pq:
        current_dist, current_vertex = heapq.heappop(pq)
        if current_dist > distances[current_vertex]:
            continue

        for neighbor, weight in graph[current_vertex].items():
            dist_via_current = current_dist + weight
            if dist_via_current < distances[neighbor]:
                distances[neighbor] = dist_via_current
                shortest_path_tree[neighbor] = current_vertex
                heapq.heappush(pq, (dist_via_current, neighbor))

    return distances, shortest_path_tree

# backend/routers/graph.py
from fastapi import APIRouter, HTTPException
from models.graph_models import GraphAlgorithmRequest, PathRequest
from services.core import build_graph, bfs, dfs
from services.distances import floyd_warshall, replace_infinity
from services.centrality import calculate_centralities
from services.graph_props import calculate_center_radius_diameter
from services.dijkstra import dijkstra

router = APIRouter()

@router.post("/characteristics")
def graph_characteristics(data: GraphAlgorithmRequest):
    print("Received data:", data)  # Это помогает видеть, что именно приходит
    if not data.nodes:
        raise HTTPException(status_code=400, detail="No nodes provided")

    graph = build_graph(data.nodes, data.edges)
    dist = floyd_warshall(graph, data.nodes, data.edges)
    center, radius, diameter = calculate_center_radius_diameter(dist, data.nodes)
    betweenness = calculate_centralities(graph)
    first_node = data.nodes[0].id
    bfs_order = bfs(graph, first_node)
    dfs_order = dfs(graph, first_node)
    replace_infinity(dist)

    print(
        {
        "distance_matrix": dist,
        "center": center,
        "radius": radius,
        "diameter": diameter,
        "betweenness_centrality": betweenness,
        "bfs_from_first_node": bfs_order,
        "dfs_from_first_node": dfs_order
    }
    )

    return {
        "distance_matrix": dist,
        "center": center,
        "radius": radius,
        "diameter": diameter,
        "betweenness_centrality": betweenness,
        "bfs_from_first_node": bfs_order,
        "dfs_from_first_node": dfs_order
    }


@router.post("/shortest-path")
def shortest_path(data: PathRequest):
    if not data.nodes or not data.edges:
        raise HTTPException(status_code=400, detail="Invalid input data")

    # Аналогично — фильтруем
    graph = build_graph(
        data.nodes,
        data.edges,
        allowed_node_types=data.allowed_node_types,
        allowed_edge_types=data.allowed_edge_types
    )

    try:
        distances, spt = dijkstra(graph, data.start_node)
        path = []
        current = data.end_node

        while current != data.start_node:
            if current in spt:
                path.append(current)
                current = spt[current]
            else:
                raise HTTPException(status_code=400, detail="No path found")

        path.append(data.start_node)
        path.reverse()

        return {"path": path}

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Internal server error: {str(e)}")

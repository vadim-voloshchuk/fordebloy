# tests/test_graph_characteristics.py
import pytest

def test_graph_characteristics_basic(client):
    payload = {
        "nodes": [
            {"id": 0, "node_type": 0},
            {"id": 1, "node_type": 0},
            {"id": 2, "node_type": 0}
        ],
        "edges": [
            {"id": 0, "from": 0, "to": 1, "weights": 1.0, "directed": False, "edge_type": 0},
            {"id": 1, "from": 1, "to": 2, "weights": 2.0, "directed": False, "edge_type": 0}
        ]
    }

    response = client.post("/graph/characteristics", json=payload)
    assert response.status_code == 200
    data = response.json()

    assert "distance_matrix" in data
    assert "center" in data
    assert "radius" in data
    assert "diameter" in data
    assert "betweenness_centrality" in data
    assert "bfs_from_first_node" in data
    assert "dfs_from_first_node" in data
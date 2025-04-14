# tests/test_shortest_path.py
import pytest

def test_shortest_path_basic(client):
    payload = {
        "nodes": [
            {"id": 0, "node_type": 0},
            {"id": 1, "node_type": 0},
            {"id": 2, "node_type": 0}
        ],
        "edges": [
            {"id": 0, "from": 0, "to": 1, "weights": 1.0, "directed": False, "edge_type": 0},
            {"id": 1, "from": 1, "to": 2, "weights": 1.0, "directed": False, "edge_type": 0}
        ],
        "start_node": 0,
        "end_node": 2
    }

    response = client.post("/graph/shortest-path", json=payload)
    assert response.status_code == 200
    data = response.json()

    assert "path" in data
    assert data["path"] == [0, 1, 2]
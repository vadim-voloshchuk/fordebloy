# tests/test_generate.py
import pytest

def test_generate_graph(client):
    payload = {
        "num_nodes": 10,
        "edge_probability": 0.5,
        "directed": False,
        "min_weight": 1.0,
        "max_weight": 5.0
    }

    response = client.post("/graph/generate", json=payload)
    assert response.status_code == 200
    data = response.json()

    assert "nodes" in data
    assert "edges" in data
    assert len(data["nodes"]) == 10
    assert all("id" in node and "node_type" in node for node in data["nodes"])
    assert all("id" in edge and "from" in edge and "to" in edge and "weights" in edge for edge in data["edges"])

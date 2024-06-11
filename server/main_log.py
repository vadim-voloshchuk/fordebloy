import json
from flask import Flask, request, jsonify
from flask_cors import CORS
import heapq
import networkx as nx
from sklearn.cluster import SpectralClustering, KMeans, DBSCAN

app = Flask(__name__)
CORS(app, resources={r"/*": {"origins": "http://localhost:3000"}})

def dijkstra(graph, start_vertex):
    distances = {vertex: float('infinity') for vertex in graph}
    distances[start_vertex] = 0
    priority_queue = [(0, start_vertex)]
    shortest_path_tree = {}

    while priority_queue:
        current_distance, current_vertex = heapq.heappop(priority_queue)

        if current_distance > distances[current_vertex]:
            continue

        for neighbor, weight in graph[current_vertex].items():
            distance = current_distance + weight

            if distance < distances[neighbor]:
                distances[neighbor] = distance
                heapq.heappush(priority_queue, (distance, neighbor))
                shortest_path_tree[neighbor] = current_vertex

    return distances, shortest_path_tree

def build_graph(edges, nodes):
    print(edges, nodes)
    graph = {node['id']: {} for node in nodes}  # Ensure all nodes are included
    for edge in edges:
        from_node = edge.get('from')
        to_node = edge.get('to')
        weight = int(edge.get('weights', 0))  # Default to 1 if weight is not provided
        
        if from_node is None or to_node is None:
            raise ValueError(f"Invalid edge data: {edge}")

        graph.setdefault(from_node, {})[to_node] = weight
        if not edge.get('directed', False):
            graph.setdefault(to_node, {})[from_node] = weight

    print(graph)
    return graph



def floyd_warshall(graph, nodes, edges):
    dist = {node['id']: {n['id']: float('infinity') for n in nodes} for node in nodes}
    for node in nodes:
        dist[node['id']][node['id']] = 0
    for edge in edges:
        weight = int(edge.get('weights', 1))  # Default to 1 if weight is not provided
        dist[edge['from']][edge['to']] = weight
        if not edge.get('directed', False):
            dist[edge['to']][edge['from']] = weight
    for k in [node['id'] for node in nodes]:
        for i in [node['id'] for node in nodes]:
            for j in [node['id'] for node in nodes]:
                if dist[i][j] > dist[i][k] + dist[k][j]:
                    dist[i][j] = dist[i][k] + dist[k][j]
    print(dist)
    return dist


def calculate_centralities(graph):
    G = nx.DiGraph()
    for node, neighbors in graph.items():
        for neighbor, weight in neighbors.items():
            G.add_edge(node, neighbor, weight=weight)
    centrality = nx.betweenness_centrality(G, weight='weight')
    return centrality

def calculate_center_radius_diameter(distances, nodes):
    # Вычисление эксцентриситетов с учетом того, что Infinity считается минимальным
    eccentricities = {
        node['id']: max(
            [dist for dist in distances[node['id']].values() if dist != float('inf')],
            default=float('inf')
        ) for node in nodes
    }

    # Замена случаев, когда все расстояния равны Infinity
    for node_id, ecc in eccentricities.items():
        if ecc == float('inf'):
            eccentricities[node_id] = 0
    print(eccentricities)
    radius = min(eccentricities.values())
    diameter = max(eccentricities.values())
    center = [node['id'] for node in nodes if eccentricities[node['id']] == radius]
    return center, radius, diameter

@app.route('/graph-characteristics', methods=['POST'])
def graph_characteristics():
    try:
        data = request.json
        nodes = data['nodes']
        edges = data['edges']

        graph = build_graph(edges, nodes)
        distances = floyd_warshall(graph, nodes, edges)
        
        centrality = calculate_centralities(graph)
        
        max_degree = max(len(graph[node['id']]) for node in nodes)
        
        center, radius, diameter = calculate_center_radius_diameter(distances, nodes)

        return jsonify({
            "center": center,
            "radius": radius,
            "diameter": diameter,
            "centralities": centrality            
        })
    except ValueError as e:
        return jsonify({'error': str(e)}), 400
    except Exception as e:
        app.logger.error(f'Error calculating graph characteristics: {str(e)}')
        return jsonify({"error": "Internal server error"}), 500

# Замена значений `Infinity` на строку
def replace_infinity(d):
    for key, value in d.items():
        if isinstance(value, dict):
            replace_infinity(value)
        else:
            if value == float('inf'):
                d[key] = "∞"

@app.route('/matrixlog', methods=['POST'])
def matrixlog():
    try:
        data = request.json
        nodes = data['nodes']
        edges = data['edges']

        graph = build_graph(edges, nodes)
        distances = floyd_warshall(graph, nodes, edges)

        replace_infinity(distances)
        
        return jsonify(distances)
    
    except ValueError as e:
        return jsonify({'error': str(e)}), 400
    except Exception as e:
        app.logger.error(f'Error calculating graph characteristics: {str(e)}')
        return jsonify({"error": "Internal server error"}), 500


@app.route('/shortest-path', methods=['POST'])
def shortest_path():
    data = request.json
    app.logger.debug(f'Received data: {json.dumps(data, indent=2)}')
    
    nodes = data.get('nodes', [])
    edges = data.get('edges', [])
    start_node = data.get('start_node')
    end_node = data.get('end_node')

    if not nodes or not edges or start_node is None or end_node is None:
        app.logger.error("Invalid input data: missing nodes, edges, start_node, or end_node")
        app.logger.error(f'nodes: {nodes}')
        app.logger.error(f'edges: {edges}')
        app.logger.error(f'start_node: {start_node}')
        app.logger.error(f'end_node: {end_node}')
        return jsonify({"error": "Invalid input data"}), 400

    app.logger.debug(f'Received nodes: {nodes}')
    app.logger.debug(f'Received edges: {edges}')
    app.logger.debug(f'Start node: {start_node}')
    app.logger.debug(f'End node: {end_node}')

    try:
        graph = build_graph(edges, nodes)
        distances, shortest_path_tree = dijkstra(graph, start_node)

        path = []
        current_node = end_node
        while current_node != start_node:
            if current_node in shortest_path_tree:
                path.append(current_node)
                current_node = shortest_path_tree[current_node]
            else:
                return jsonify({"error": "No path found"}), 400
        path.append(start_node)
        path.reverse()

        return jsonify({"path": path})
    except Exception as e:
        app.logger.error(f'Error calculating shortest path: {str(e)}')
        return jsonify({"error": "Internal server error"}), 500
    
def perform_clustering(nodes, edges, method, n_clusters=None):
    # Build adjacency matrix from edges
    node_ids = [node['id'] for node in nodes]
    node_indices = {node_id: idx for idx, node_id in enumerate(node_ids)}
    adjacency_matrix = [[0] * len(nodes) for _ in range(len(nodes))]
    for edge in edges:
        from_idx = node_indices[edge['from']]
        to_idx = node_indices[edge['to']]
        weight = edge.get('weight', 1)  # Default to 1 if weight is not provided
        adjacency_matrix[from_idx][to_idx] = weight
        if not edge.get('directed', False):
            adjacency_matrix[to_idx][from_idx] = weight
    
    if method == 'spectral':
        clustering = SpectralClustering(n_clusters=n_clusters, affinity='precomputed').fit(adjacency_matrix)
    elif method == 'kmeans':
        clustering = KMeans(n_clusters=n_clusters).fit(adjacency_matrix)
    elif method == 'dbscan':
        clustering = DBSCAN().fit(adjacency_matrix)
    else:
        raise ValueError("Invalid clustering method")

    return clustering.labels_.tolist()


@app.route('/clustering', methods=['POST'])
def clustering():
    try:
        data = request.json
        nodes = data['nodes']
        edges = data['edges']
        method = data['method']
        n_clusters = int(data.get('n_clusters'))

        labels = perform_clustering(nodes, edges, method, n_clusters)

        return jsonify({'labels': labels})
    except ValueError as e:
        return jsonify({'error': str(e)}), 400
    except Exception as e:
        app.logger.error(f'Error performing clustering: {str(e)}')
        return jsonify({"error": "Internal server error"}), 500


if __name__ == '__main__':
    app.run(debug=True, host="0.0.0.0")

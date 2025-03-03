import json
import heapq

from flask import Flask, request, jsonify
from flask_cors import CORS

import networkx as nx
from sklearn.cluster import SpectralClustering, KMeans, DBSCAN

app = Flask(__name__)
CORS(app, resources={r"/*": {"origins": "http://localhost:3000"}})


# ---------------------------
# Вспомогательные функции
# ---------------------------

def build_graph(nodes, edges):
    """
    Создаёт словарь graph:
      graph[u][v] = вес ребра (u->v)
    Если edge['directed'] == False, добавляем и v->u.
    """
    # Убедимся, что у нас есть все узлы в качестве ключей, даже если без рёбер
    graph = {node['id']: {} for node in nodes}
    
    for edge in edges:
        from_node = int(edge['from'])   # В JSON уже 5 или 1 (числа), но бывает и строка "5"
        to_node   = int(edge['to'])
        weight    = float(edge.get('weights', 1.0))  # Парсим строку "1" -> 1.0

        graph[from_node][to_node] = weight

        # Если ребро неориентированное, дублируем в обратную сторону
        if not edge.get('directed', False):
            graph[to_node][from_node] = weight

    return graph


def floyd_warshall(graph, nodes, edges):
    """
    Построение матрицы кратчайших путей (Floyd–Warshall).
    Возвращаем dict формата dist[u][v] = расстояние.
    """
    dist = {
        node['id']: {n['id']: float('inf') for n in nodes}
        for node in nodes
    }
    # Расстояние до себя = 0
    for node in nodes:
        dist[node['id']][node['id']] = 0.0

    # Учтём рёбра
    for edge in edges:
        from_node = int(edge['from'])
        to_node   = int(edge['to'])
        weight    = float(edge.get('weights', 1.0))
        dist[from_node][to_node] = min(dist[from_node][to_node], weight)  # на всякий случай min
        # Для неориентированных:
        if not edge.get('directed', False):
            dist[to_node][from_node] = min(dist[to_node][from_node], weight)

    # Алгоритм Флойда — Уоршелла
    node_ids = [node['id'] for node in nodes]
    for k in node_ids:
        for i in node_ids:
            for j in node_ids:
                if dist[i][j] > dist[i][k] + dist[k][j]:
                    dist[i][j] = dist[i][k] + dist[k][j]

    return dist


def calculate_centralities(graph):
    """
    Вычисление бетвеенности (betweenness_centrality) через NetworkX.
    Можно добавить и другие метрики – closeness, eigenvector и т.п.
    """
    # Собираем DiGraph (ориентированный граф)
    G = nx.DiGraph()
    for u, neighbors in graph.items():
        for v, w in neighbors.items():
            G.add_edge(u, v, weight=w)
    # Бетвеенность
    betw_cent = nx.betweenness_centrality(G, weight='weight', normalized=True)
    return betw_cent


def calculate_center_radius_diameter(distances, nodes):
    """
    По матрице кратчайших путей вычисляем эксцентриситет, радиус, диаметр и центр.
    dist[u][v] = расстояние от u до v.
    Эксцентриситет вершины u = max(dist[u][x] для всех x).
    Радиус = min(эксцентриситет), диаметр = max(эксцентриситет).
    Центр = все вершины, у кого эксцентриситет = радиус.
    """
    eccentricities = {}
    node_ids = [n['id'] for n in nodes]
    for u in node_ids:
        # Из dist[u].values() убираем float('inf'), чтобы не ломать max()
        finite_vals = [d for d in distances[u].values() if d != float('inf')]
        if finite_vals:
            eccentricities[u] = max(finite_vals)
        else:
            # Если у вершины все расстояния бесконечны (отдельная компонента графа)
            eccentricities[u] = 0

    radius   = min(eccentricities.values()) if eccentricities else 0
    diameter = max(eccentricities.values()) if eccentricities else 0
    center   = [u for u, ecc in eccentricities.items() if ecc == radius]

    return center, radius, diameter


def bfs(graph, start):
    """
    Обход в ширину (BFS) из заданной вершины.
    Возвращает список вершин в порядке обхода.
    """
    visited = set()
    queue   = [start]
    order   = []

    while queue:
        vertex = queue.pop(0)
        if vertex not in visited:
            visited.add(vertex)
            order.append(vertex)
            # Все соседи (учитывая направления, если это ориентированный граф)
            neighbors = graph.get(vertex, {}).keys()
            for n in neighbors:
                if n not in visited:
                    queue.append(n)
    return order


def dfs(graph, start, visited=None, order=None):
    """
    Обход в глубину (DFS) рекурсивно (можно и итеративно).
    Возвращает список вершин в порядке обхода.
    """
    if visited is None:
        visited = set()
    if order is None:
        order = []

    visited.add(start)
    order.append(start)

    for neighbor in graph.get(start, {}):
        if neighbor not in visited:
            dfs(graph, neighbor, visited, order)

    return order


# Замена float('inf') на строку '∞' для удобства JSON
def replace_infinity(d):
    """
    Проходим рекурсивно по словарю (словарь словарей) и заменяем float('inf') на '∞'.
    """
    for key, value in d.items():
        if isinstance(value, dict):
            replace_infinity(value)
        else:
            if value == float('inf'):
                d[key] = "∞"


# ---------------------------
# Роуты приложения
# ---------------------------

@app.route('/graph-characteristics', methods=['POST'])
def graph_characteristics():
    """
    Возвращает комплексные характеристики графа:
    - Матрицу кратчайших путей (Floyd–Warshall)
    - Радиус, диаметр, центр
    - Бетвеенность (betweenness_centrality)
    - BFS / DFS из первой вершины (пример)
    """
    try:
        data = request.json
        nodes = data.get('nodes', [])
        edges = data.get('edges', [])

        if not nodes:
            return jsonify({"error": "No nodes provided"}), 400

        # 1) Собираем граф в словарь
        graph = build_graph(nodes, edges)


        # 2) Считаем матрицу кратчайших путей
        dist = floyd_warshall(graph, nodes, edges)

        # 3) Вычисляем центр, радиус, диаметр
        center, radius, diameter = calculate_center_radius_diameter(dist, nodes)

        # 4) Бетвеенность (betweenness_centrality)
        betweenness = calculate_centralities(graph)

        # 5) Для демонстрации: BFS и DFS из "первой" вершины списка (если есть)
        first_node_id = nodes[0]['id']  # условно возьмём первую
        bfs_order = bfs(graph, first_node_id)
        dfs_order = dfs(graph, first_node_id)

        # 6) Преобразуем dist так, чтобы inf стало '∞'
        replace_infinity(dist)

        # Готовим ответ
        return jsonify({
            "distance_matrix": dist,
            "center": center,
            "radius": radius,
            "diameter": diameter,
            "betweenness_centrality": betweenness,
            "bfs_from_first_node": bfs_order,
            "dfs_from_first_node": dfs_order
        })

    except ValueError as e:
        # Например, если int(...) не смог распарсить "3.5"
        return jsonify({'error': str(e)}), 400
    except Exception as e:
        app.logger.error(f'Error in /graph-characteristics: {str(e)}')
        return jsonify({"error": "Internal server error"}), 500


@app.route('/shortest-path', methods=['POST'])
def shortest_path():
    """
    Пример эндпоинта для нахождения кратчайшего пути (Дейкстра).
    Ожидает формат:
    {
      "start_node": "1",
      "end_node": "2",
      "nodes": [
        {"id": 1, "label": "...", ...},
        ...
      ],
      "edges": [
        {"id": 5, "from": 1, "to": 5, "weights": "1", "directed": true, ...},
        ...
      ]
    }
    """
    data = request.get_json()
    app.logger.debug(f"Received data: {json.dumps(data, indent=2)}")

    # Извлекаем поля
    nodes = data.get('nodes', [])
    edges = data.get('edges', [])
    start_node = data.get('start_node')
    end_node   = data.get('end_node')

    # Проверяем валидность
    if not nodes or not edges or start_node is None or end_node is None:
        app.logger.error("Invalid input data in /shortest-path")
        return jsonify({"error": "Invalid input data"}), 400

    try:
        # Приведём start_node, end_node к int (т.к. в nodes['id'] у нас числа)
        start_node = int(start_node)
        end_node   = int(end_node)

        # Собираем граф
        graph = build_graph(nodes, edges)

        # Запускаем Дейкстру
        distances, spt = dijkstra(graph, start_node)

        # Восстанавливаем путь от start_node к end_node
        path = []
        current = end_node
        while current != start_node:
            if current in spt:
                path.append(current)
                current = spt[current]
            else:
                # Если мы не можем дойти до current => пути нет
                return jsonify({"error": "No path found"}), 400
        
        # Добавляем start_node в конец (так как цикл останавливается на нем)
        path.append(start_node)
        # Разворачиваем порядок
        path.reverse()

        # Возвращаем путь
        return jsonify({"path": path})

    except ValueError:
        # int(...) вызвал ошибку, значит в JSON было что-то не то
        return jsonify({"error": "Could not parse node IDs as integer"}), 400
    except Exception as e:
        app.logger.error(f"Error in /shortest-path: {str(e)}")
        return jsonify({"error": "Internal server error"}), 500


def dijkstra(graph, start_vertex):
    """
    Алгоритм Дейкстры для нахождения кратчайших путей от start_vertex.
    Возвращает кортеж (distances, spt), где:
      - distances[v] = дистанция от start_vertex до вершины v
      - spt[v] = "предок" v на кратчайшем пути от start_vertex
    """
    distances = {v: float('inf') for v in graph}
    distances[start_vertex] = 0.0
    shortest_path_tree = {}

    # Приоритетная очередь: (расстояние, вершина)
    pq = [(0.0, start_vertex)]
    
    while pq:
        current_dist, current_vertex = heapq.heappop(pq)
        
        # Если эта запись уже неактуальна — пропускаем
        if current_dist > distances[current_vertex]:
            continue

        # Перебираем всех соседей
        for neighbor, w in graph[current_vertex].items():
            dist_via_current = current_dist + w
            if dist_via_current < distances[neighbor]:
                distances[neighbor] = dist_via_current
                shortest_path_tree[neighbor] = current_vertex
                heapq.heappush(pq, (dist_via_current, neighbor))
    
    return distances, shortest_path_tree

@app.route('/clustering', methods=['POST'])
def clustering():
    """
    Пример использования методов кластеризации (Spectral, K-Means, DBSCAN) на матрице смежности.
    По умолчанию мы берём поле 'weight', но вы можете подстроить, если у вас другое название поля рёбер.
    """
    try:
        data = request.json
        nodes = data['nodes']
        edges = data['edges']
        method = data['method']
        # n_clusters актуально для KMeans / Spectral
        n_clusters = int(data.get('n_clusters', 2))

        labels = perform_clustering(nodes, edges, method, n_clusters)
        return jsonify({'labels': labels})

    except ValueError as e:
        return jsonify({'error': str(e)}), 400
    except Exception as e:
        app.logger.error(f'Error in /clustering: {str(e)}')
        return jsonify({"error": "Internal server error"}), 500


def perform_clustering(nodes, edges, method, n_clusters=None):
    """
    Собираем матрицу смежности из edges, затем используем выбранный метод кластеризации:
    - SpectralClustering(affinity='precomputed')
    - KMeans
    - DBSCAN
    """
    node_ids = [node['id'] for node in nodes]
    node_indices = {node_id: idx for idx, node_id in enumerate(node_ids)}

    # Инициализируем квадратную матрицу смежности размером len(nodes) x len(nodes)
    adjacency_matrix = [[0.0] * len(nodes) for _ in range(len(nodes))]

    for edge in edges:
        from_idx = node_indices[int(edge['from'])]
        to_idx   = node_indices[int(edge['to'])]
        w        = float(edge.get('weights', 1.0))

        adjacency_matrix[from_idx][to_idx] = w
        if not edge.get('directed', False):
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


# Простой дополнительный эндпоинт для вывода непосредственно матрицы Floyd–Warshall, 
# если вдруг нужно отдельно (с заменой inf на '∞').
@app.route('/matrixlog', methods=['POST'])
def matrixlog():
    try:
        data = request.json
        nodes = data['nodes']
        edges = data['edges']

        graph = build_graph(nodes, edges)

        distances = floyd_warshall(graph, nodes, edges)

        replace_infinity(distances)

        return jsonify(distances)
    
    except ValueError as e:
        return jsonify({'error': str(e)}), 400
    except Exception as e:
        app.logger.error(f'Error in /matrixlog: {str(e)}')
        return jsonify({"error": "Internal server error"}), 500


# ---------------------------
# Запуск приложения
# ---------------------------

if __name__ == '__main__':
    # host="0.0.0.0" чтобы Flask слушал на всех сетевых интерфейсах
    # debug=True для автоматической перезагрузки при изменениях
    app.run(debug=True, host="0.0.0.0")

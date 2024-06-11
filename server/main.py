from flask import Flask, jsonify, request
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS, cross_origin

app = Flask(__name__)
CORS(app)  # Добавление CORS к вашему приложению

app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = 'mysql://sfeduadmin_user:password123@5.182.87.23/graph_db'
db = SQLAlchemy(app)

class Graphs(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(255))
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'))
    nodes = db.relationship('Nodes', backref='graphs', lazy=True)
    edges = db.relationship('Edges', backref='graphs', lazy=True)

class Nodes(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    graph_id = db.Column(db.Integer, db.ForeignKey('graphs.id'), nullable=False)
    type = db.Column(db.Integer, nullable=False)
    weight = db.Column(db.Float)
    
class Edges(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    graph_id = db.Column(db.Integer, db.ForeignKey('graphs.id'), nullable=False)
    node1_id = db.Column(db.Integer, nullable=False)
    node2_id = db.Column(db.Integer, nullable=False)
    weight = db.Column(db.Float)
    Por = db.Column(db.Integer, nullable=False)
    Pt = db.Column(db.Integer, nullable=False)
    Pv = db.Column(db.Integer, nullable=False)

class Users(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(255), unique=True)
    password = db.Column(db.String(255))

# GET all graphs
@app.route('/graphs', methods=['GET'])
@cross_origin()
def get_graphs():
    graphs = Graphs.query.all()
    result = []
    for graph in graphs:
        result.append({'id': graph.id, 'name': graph.name, 'user_id': graph.user_id})
    return jsonify(result)

# GET single graph by id
@app.route('/graphs/<int:id>', methods=['GET'])
@cross_origin()
def get_graph(id):
    graph = Graphs.query.get(id)
    if not graph:
        return jsonify({'message': 'Graph not found'})
    return jsonify({'id': graph.id, 'name': graph.name, 'user_id': graph.user_id})

# POST new graph
@app.route('/graphs', methods=['POST'])
@cross_origin()
def create_graph():
    data = request.json
    new_graph = Graphs(name=data['name'], user_id=data['user_id'])
    db.session.add(new_graph)
    db.session.commit()
    return jsonify({'message': 'Graph created successfully'})

# PUT update graph by id
@app.route('/graphs/<int:id>', methods=['PUT'])
@cross_origin()
def update_graph(id):
    graph = Graphs.query.get(id)
    if not graph:
        return jsonify({'message': 'Graph not found'})
    data = request.json
    graph.name = data['name']
    graph.user_id = data['user_id']
    db.session.commit()
    return jsonify({'message': 'Graph updated successfully'})

# DELETE graph by id
@app.route('/graphs/<int:id>', methods=['DELETE'])
@cross_origin()
def delete_graph(id):
    graph = Graphs.query.get(id)
    if not graph:
        return jsonify({'message': 'Graph not found'})
    db.session.delete(graph)
    db.session.commit()
    return jsonify({'message': 'Graph deleted successfully'})

# GET all users
@app.route('/users', methods=['GET'])
@cross_origin()
def get_users():
    users = Users.query.all()
    result = []
    for user in users:
        result.append({'id': user.id, 'username': user.username, 'password': user.password})
    return jsonify(result)

# GET single user by id
@app.route('/users/<int:id>', methods=['GET'])
@cross_origin()
def get_user(id):
    user = Users.query.get(id)
    if not user:
        return jsonify({'message': 'User not found'})
    return jsonify({'id': user.id, 'username': user.username, 'password': user.password})

# POST new user
@app.route('/users', methods=['POST'])
@cross_origin()
def create_user():
    data = request.json
    new_user = Users(username=data['username'], password=data['password'])
    db.session.add(new_user)
    db.session.commit()
    return jsonify({'message': 'User created successfully'})

# PUT update user by id
@app.route('/users/<int:id>', methods=['PUT'])
@cross_origin()
def update_user(id):
    user = Users.query.get(id)
    if not user:
        return jsonify({'message': 'User not found'})
    data = request.json
    user.username = data['username']
    user.password = data['password']
    db.session.commit()
    return jsonify({'message': 'User updated successfully'})

# DELETE user by id
@app.route('/users/<int:id>', methods=['DELETE'])
@cross_origin()
def delete_user(id):
    user = Users.query.get(id)
    if not user:
        return jsonify({'message': 'User not found'})
    db.session.delete(user)
    db.session.commit()
    return jsonify({'message': 'User deleted successfully'})

# GET all nodes
@app.route('/nodes', methods=['GET'])
@cross_origin()
def get_nodes():
    nodes = Nodes.query.all()
    result = []
    for node in nodes:
        result.append({'id': node.id, 'graph_id': node.graph_id, 'type': node.type, 'weight': node.weight})
    return jsonify(result)

# GET single node by id
@app.route('/nodes/<int:id>', methods=['GET'])
@cross_origin()
def get_node(id):
    node = Nodes.query.get(id)
    if not node:
        return jsonify({'message': 'Node not found'})
    return jsonify({'id': node.id, 'graph_id': node.graph_id, 'type': node.type, 'weight': node.weight})

# POST new node
@app.route('/nodes', methods=['POST'])
@cross_origin()
def create_node():
    data = request.json
    new_node = Nodes(graph_id=data['graph_id'], type=data['type'], weight=data['weight'])
    db.session.add(new_node)
    db.session.commit()
    return jsonify({'message': 'Node created successfully'})

# PUT update node by id
@app.route('/nodes/<int:id>', methods=['PUT'])
@cross_origin()
def update_node(id):
    node = Nodes.query.get(id)
    if not node:
        return jsonify({'message': 'Node not found'})
    data = request.json
    node.graph_id = data['graph_id']
    node.type = data['type']
    node.weight = data['weight']
    db.session.commit()
    return jsonify({'message': 'Node updated successfully'})

# DELETE node by id
@app.route('/nodes/<int:id>', methods=['DELETE'])
@cross_origin()
def delete_node(id):
    node = Nodes.query.get(id)
    if not node:
        return jsonify({'message': 'Node not found'})
    db.session.delete(node)
    db.session.commit()
    return jsonify({'message': 'Node deleted successfully'})

# GET all edges
@app.route('/edges', methods=['GET'])
@cross_origin()
def get_edges():
    edges = Edges.query.all()
    result = []
    for edge in edges:
        result.append({'id': edge.id, 'graph_id': edge.graph_id, 'node1_id': edge.node1_id, 'node2_id': edge.node2_id, 'weight': edge.weight, 'Por': edge.Por, 'Pt': edge.Pt, 'Pv': edge.Pv})
    return jsonify(result)

# GET single edge by id
@app.route('/edges/<int:id>', methods=['GET'])
@cross_origin()
def get_edge(id):
    edge = Edges.query.get(id)
    if not edge:
        return jsonify({'message': 'Edge not found'})
    return jsonify({'id': edge.id, 'graph_id': edge.graph_id, 'node1_id': edge.node1_id, 'node2_id': edge.node2_id, 'weight': edge.weight, 'Por': edge.Por, 'Pt': edge.Pt, 'Pv': edge.Pv})

# POST new edge
@app.route('/edges', methods=['POST'])
@cross_origin()
def create_edge():
    data = request.json
    new_edge = Edges(graph_id=data['graph_id'], node1_id=data['node1_id'], node2_id=data['node2_id'], weight=data['weight'], Por=data['Por'], Pt=data['Pt'], Pv=data['Pv'])
    db.session.add(new_edge)
    db.session.commit()
    return jsonify({'message': 'Edge created successfully'})

# PUT update edge by id
@app.route('/edges/<int:id>', methods=['PUT'])
@cross_origin()
def update_edge(id):
    edge = Edges.query.get(id)
    if not edge:
        return jsonify({'message': 'Edge not found'})
    data = request.json
    edge.graph_id = data['graph_id']
    edge.node1_id = data['node1_id']
    edge.node2_id = data['node2_id']
    edge.weight = data['weight']
    edge.Por = data['Por']
    edge.Pt = data['Pt']
    edge.Pv = data['Pv']
    db.session.commit()
    return jsonify({'message': 'Edge updated successfully'})

# DELETE edge by id
@app.route('/edges/<int:id>', methods=['DELETE'])
@cross_origin()
def delete_edge(id):
    edge = Edges.query.get(id)
    if not edge:
        return jsonify({'message': 'Edge not found'})
    db.session.delete(edge)
    db.session.commit()
    return jsonify({'message': 'Edge deleted successfully'})

if __name__ == '__main__':
    app.run(debug=True)

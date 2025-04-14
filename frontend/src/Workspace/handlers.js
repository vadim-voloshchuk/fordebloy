// src/Workspace/handlers.js

export const handleAddNode = (nodes, setNodes, setFilteredNodes, node) => {
    setNodes((prevNodes) => [...prevNodes, node]);
    setFilteredNodes((prevNodes) => [...prevNodes, node]);
};

export const handleUpdateNode = (nodes, setNodes, setFilteredNodes, updatedNode) => {
    setNodes((prevNodes) =>
        prevNodes.map((node) => (node.id === updatedNode.id ? updatedNode : node))
    );
    setFilteredNodes((prevNodes) =>
        prevNodes.map((node) => (node.id === updatedNode.id ? updatedNode : node))
    );
};

export const handleDeleteNode = (nodes, setNodes, setFilteredNodes, nodeId) => {
    setNodes((prevNodes) => prevNodes.filter((node) => node.id !== nodeId));
    setFilteredNodes((prevNodes) => prevNodes.filter((node) => node.id !== nodeId));
};

export const handleAddEdge = (edges, setEdges, setFilteredEdges, edge) => {
    setEdges((prevEdges) => [...prevEdges, edge]);
    setFilteredEdges((prevEdges) => [...prevEdges, edge]);
};

export const handleUpdateEdge = (edges, setEdges, setFilteredEdges, updatedEdge) => {
    setEdges((prevEdges) =>
        prevEdges.map((edge) => (edge.id === updatedEdge.id ? updatedEdge : edge))
    );
    setFilteredEdges((prevEdges) =>
        prevEdges.map((edge) => (edge.id === updatedEdge.id ? updatedEdge : edge))
    );
};

export const handleDeleteEdge = (edges, setEdges, setFilteredEdges, edgeId) => {
    setEdges((prevEdges) => prevEdges.filter((edge) => edge.id !== edgeId));
    setFilteredEdges((prevEdges) => prevEdges.filter((edge) => edge.id !== edgeId));
};

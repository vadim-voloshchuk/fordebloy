import React, { useState, useEffect, useCallback, useRef } from 'react';
import axios from 'axios';
import NodeSearch from './Nodes/NodeSearch';
import NetworkChart from './NetworkChart';
import GraphInfoPanel from './GraphInfoPanel';
import ShortestPathDialog from './ShortestPathDialog';
import ClusteringDialog from './ClusteringDialog';
import DistanceMatrixDialog from './DistanceMatrixDialog';

const getRandomInt = (max) => Math.floor(Math.random() * max) + 1;

const generateRandomGraph = (n, m) => {
    const nodes = [];
    const edges = [];
    const edgeSet = new Set();

    // Генерация узлов
    for (let i = 1; i <= n; i++) {
        nodes.push({
            id: i,
            label: `gv${i}`,
            title: `tp${getRandomInt(5)}`,
            type: `type${getRandomInt(6)}`
        });
    }

    // Генерация рёбер
    while (edges.length < m) {
        const from = getRandomInt(n);
        let to = getRandomInt(n);
        while (to === from) to = getRandomInt(n);

        const edgeId = `${from}-${to}`;
        if (!edgeSet.has(edgeId)) {
            edgeSet.add(edgeId);
            edges.push({
                id: edges.length + 1,
                from,
                to,
                label: `ge${edges.length + 1}`,
                title: `Weight: ${getRandomInt(100)}`,
                weights: `${getRandomInt(1)}`,
                directed: true,
                type: `type${getRandomInt(3)}`
            });
        }
    }

    return { nodes, edges };
};

const Workspace = () => {
    const [nodes, setNodes] = useState([]);
    const [edges, setEdges] = useState([]);
    const [filteredNodes, setFilteredNodes] = useState([]);
    const [filteredEdges, setFilteredEdges] = useState([]);
    const [graphCharacteristics, setGraphCharacteristics] = useState({
        nodeCount: 0,
        edgeCount: 0,
        nodeTypes: new Set(),
        edgeTypes: new Set(),
        maxDegree: 0,
        center: 'N/A',
        radius: 'N/A',
        diameter: 'N/A',
        centralities: {}
    });

    const [isMobileView, setIsMobileView] = useState(window.innerWidth <= 800);
    const [shortestPathDialogOpen, setShortestPathDialogOpen] = useState(false);
    const [clusteringDialogOpen, setClusteringDialogOpen] = useState(false);
    const [distanceMatrixDialogOpen, setDistanceMatrixDialogOpen] = useState(false);
    const [distanceMatrix, setDistanceMatrix] = useState(null);
    const [shortestPath, setShortestPath] = useState([]);

    const graphRef = useRef(null);

    useEffect(() => {
        const handleResize = () => setIsMobileView(window.innerWidth <= 800);
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    useEffect(() => {
        const n = 25;
        const m = 25;
        const { nodes, edges } = generateRandomGraph(n, m);
        setNodes(nodes);
        setEdges(edges);
        setFilteredNodes(nodes);
        setFilteredEdges(edges);
        setGraphCharacteristics({
            nodeCount: nodes.length,
            edgeCount: edges.length,
            nodeTypes: new Set(nodes.map((node) => node.type)),
            edgeTypes: new Set(edges.map((edge) => edge.type)),
            maxDegree: 0,
            center: 'N/A',
            radius: 'N/A',
            diameter: 'N/A',
            centralities: {}
        });
    }, []);

    useEffect(() => {
        calculateGraphCharacteristics();
    }, [nodes, edges]);

    const calculateGraphCharacteristics = async () => {
        const degrees = nodes.map((node) =>
            edges.filter((edge) => edge.from === node.id || edge.to === node.id).length
        );
        const maxDegree = Math.max(...degrees);
        try {
            const response = await axios.post('http://localhost:5000/graph-characteristics', {
                nodes,
                edges,
            });
            setGraphCharacteristics({
                nodeCount: nodes.length,
                edgeCount: edges.length,
                nodeTypes: new Set(nodes.map((node) => node.type)),
                edgeTypes: new Set(edges.map((edge) => edge.type)),
                maxDegree,
                center: response.data.center.join(','),
                radius: response.data.radius,
                diameter: response.data.diameter,
                centralities: response.data.centralities,
            });
            setDistanceMatrix(response.data.distances);
        } catch (error) {
            console.error('Ошибка при расчёте характеристик графа', error);
        }
    };

    const loadDistanceMatrix = async () => {
        try {
            const response = await axios.post('http://localhost:5000/matrixlog', {
                nodes,
                edges
            });
            setDistanceMatrix(response.data);
        } catch (error) {
            console.error("Ошибка при запросе матрицы расстояний:", error);
            setDistanceMatrix(null);
        }
    };

    const handleAddNode = (node) => {
        setNodes((prevNodes) => [...prevNodes, node]);
        setFilteredNodes((prevNodes) => [...prevNodes, node]);
    };

    const handleUpdateNode = (updatedNode) => {
        setNodes((prevNodes) =>
            prevNodes.map((node) => (node.id === updatedNode.id ? updatedNode : node))
        );
        setFilteredNodes((prevNodes) =>
            prevNodes.map((node) => (node.id === updatedNode.id ? updatedNode : node))
        );
    };

    const handleDeleteNode = (nodeId) => {
        setNodes((prevNodes) => prevNodes.filter((node) => node.id !== nodeId));
        setFilteredNodes((prevNodes) => prevNodes.filter((node) => node.id !== nodeId));
    };

    const handleAddEdge = (edge) => {
        setEdges((prevEdges) => [...prevEdges, edge]);
        setFilteredEdges((prevEdges) => [...prevEdges, edge]);
    };

    const handleUpdateEdge = (updatedEdge) => {
        setEdges((prevEdges) =>
            prevEdges.map((edge) => (edge.id === updatedEdge.id ? updatedEdge : edge))
        );
        setFilteredEdges((prevEdges) =>
            prevEdges.map((edge) => (edge.id === updatedEdge.id ? updatedEdge : edge))
        );
    };

    const handleDeleteEdge = (edgeId) => {
        setEdges((prevEdges) => prevEdges.filter((edge) => edge.id !== edgeId));
        setFilteredEdges((prevEdges) => prevEdges.filter((edge) => edge.id !== edgeId));
    };

    const handleSaveGraph = () => {
        const graphData = { nodes, edges };
        const json = JSON.stringify(graphData, null, 2);
        const blob = new Blob([json], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = 'graph.json';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
    };

    const handleLoadGraph = (event) => {
        const file = event.target.files[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onload = (e) => {
            try {
                const graphData = JSON.parse(e.target.result);
                if (graphData.nodes && graphData.edges) {
                    setNodes(graphData.nodes);
                    setEdges(graphData.edges);
                    setFilteredNodes(graphData.nodes);
                    setFilteredEdges(graphData.edges);
                    calculateGraphCharacteristics();
                } else {
                    console.error('Неверный формат файла');
                }
            } catch (error) {
                console.error('Ошибка чтения файла', error);
            }
        };
        reader.readAsText(file);
    };

    const resetHandler = useCallback(() => {
        setFilteredNodes(nodes);
        setFilteredEdges(edges);
        setGraphCharacteristics({
            nodeCount: nodes.length,
            edgeCount: edges.length,
            nodeTypes: new Set(nodes.map((node) => node.type)),
            edgeTypes: new Set(edges.map((edge) => edge.type)),
            maxDegree: 0,
            center: 'N/A',
            radius: 'N/A',
            diameter: 'N/A',
            centralities: {}
        });
    }, [nodes, edges]);

    return (
        <div style={{ position: 'relative', width: '100%', height: '100%' }}>
            {isMobileView ? (
                <div style={{ textAlign: 'center', marginTop: '20%', fontSize: '24px' }}>
                    Пожалуйста, воспользуйтесь версией для ПК :)
                </div>
            ) : (
                <>
                    <GraphInfoPanel {...graphCharacteristics} />
                    <NodeSearch
                        nodes={nodes}
                        edges={edges}
                        onFilterNodes={setFilteredNodes}
                        onFilterEdges={setFilteredEdges}
                        onShortestPathClick={() => setShortestPathDialogOpen(true)}
                        onClusteringClick={() => setClusteringDialogOpen(true)}
                        onCalculateMatrix={() => setDistanceMatrixDialogOpen(true)}
                        onResetFilters={resetHandler}
                    />
                    <div style={{ margin: '10px' }}>
                        <button onClick={handleSaveGraph}>Сохранить граф</button>
                        <input
                            type="file"
                            accept="application/json"
                            onChange={handleLoadGraph}
                            style={{ marginLeft: '10px' }}
                        />
                    </div>
                    <NetworkChart
                        ref={graphRef}
                        nodes={filteredNodes}
                        edges={filteredEdges}
                        onNodeClick={() => {}}
                        shortestPath={shortestPath}
                        onDeleteNode={handleDeleteNode}
                        onUpdateNode={handleUpdateNode}
                        onDeleteEdge={handleDeleteEdge}
                        onUpdateEdge={handleUpdateEdge}
                        onAddNode={handleAddNode}
                        onAddEdge={handleAddEdge}
                    />
                    <ShortestPathDialog
                        open={shortestPathDialogOpen}
                        onClose={() => setShortestPathDialogOpen(false)}
                        onCalculate={(data) => {
                            console.log("Пришёл ответ от сервера:", data);
                            if (data.path) {
                                const result = [];
                                for (let i = 0; i < data.path.length - 1; i++) {
                                    result.push({ from: data.path[i], to: data.path[i + 1] });
                                }
                                setShortestPath(result);
                            } else {
                                setShortestPath([]);
                            }
                        }}
                        nodes={nodes}
                        edges={edges}
                    />
                    <ClusteringDialog
                        open={clusteringDialogOpen}
                        onClose={() => setClusteringDialogOpen(false)}
                        onCluster={() => {}}
                    />
                    <DistanceMatrixDialog
                        open={distanceMatrixDialogOpen}
                        onClose={() => setDistanceMatrixDialogOpen(false)}
                        matrixString={distanceMatrix}
                    />
                </>
            )}
        </div>
    );
};

export default Workspace;

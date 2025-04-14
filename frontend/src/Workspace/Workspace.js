// src/Workspace/Workspace.js
import React, { useState, useEffect, useCallback, useRef } from 'react';
import axios from 'axios';
import NodeSearch from './Nodes/NodeSearch';
import NetworkChart from './NetworkChart';
import GraphInfoPanel from './GraphInfoPanel';
import ShortestPathDialog from './ShortestPathDialog';
import ClusteringDialog from './ClusteringDialog';
import DistanceMatrixDialog from './DistanceMatrixDialog';
import GraphActions from './GraphActions'; // Импортируем новый компонент для загрузки/сохранения графов
import { handleAddNode, handleUpdateNode, handleDeleteNode, handleAddEdge, handleUpdateEdge, handleDeleteEdge } from './handlers'; // Импортируем хендлеры

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
    const [graphIds, setGraphIds] = useState([]); // Храним ID графов для загрузки

    const graphRef = useRef(null);

    useEffect(() => {
        const handleResize = () => setIsMobileView(window.innerWidth <= 800);
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    useEffect(() => {
        loadGraphData();
        loadGraphIds();
    }, []);

    useEffect(() => {
        calculateGraphCharacteristics(nodes, edges);
    }, [nodes, edges]); // Теперь запрос будет отправляться каждый раз при изменении узлов или рёбер

     // Функция для загрузки списка графов с сервера
    const loadGraphIds = async () => {
        try {
            const response = await axios.get('http://localhost:8000/graph/list'); // Используем /list для получения всех графов
            setGraphIds(response.data.graph_ids); // Сохраняем список графов
        } catch (error) {
            console.error("Ошибка при получении графов", error);
        }
    };

     // Функция для загрузки данных графа по ID
    const loadGraphData = async (graphId) => {
        try {
            const response = await axios.get(`http://localhost:8000/graph/load/${graphId}`); // Загружаем граф по ID
            const { nodes, edges } = response.data;
            setNodes(nodes);
            setEdges(edges);
            setFilteredNodes(nodes);
            setFilteredEdges(edges);
            calculateGraphCharacteristics(nodes, edges); // Перерасчитаем характеристики графа
        } catch (error) {
            console.error("Ошибка при загрузке графа", error);
        }
    };
    

    const calculateGraphCharacteristics = async (nodes, edges) => {
        const degrees = nodes.map((node) =>
            edges.filter((edge) => edge.from === node.id || edge.to === node.id).length
        );
        const maxDegree = Math.max(...degrees);
    
        const payload = {
            nodes: nodes.map(node => ({
                id: node.id,
                node_type: node.type,  // передаем node_type
            })),
            edges: edges.map(edge => ({
                id: edge.id,
                from: edge.from,
                to: edge.to,
                weights: edge.weights,
                directed: edge.directed,
                edge_type: edge.type,  // передаем edge_type
            })),
            allowed_node_types: [],  // Если есть необходимость, передавайте сюда фильтр типов
            allowed_edge_types: [],  // Если есть необходимость, передавайте сюда фильтр типов
        };
    
        console.log('Sending data to server:', payload);  // Выводим данные перед отправкой
    
        try {
            const response = await axios.post('http://localhost:8000/graph/characteristics', payload);
    
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
            const response = await axios.post('http://localhost:8000/matrixlog', {
                nodes,
                edges
            });
            setDistanceMatrix(response.data);
        } catch (error) {
            console.error("Ошибка при запросе матрицы расстояний:", error);
            setDistanceMatrix(null);
        }
    };

    useEffect(() => {
        if (distanceMatrixDialogOpen) {
            loadDistanceMatrix();
        }
    }, [distanceMatrixDialogOpen]);

    const handleSaveGraph = async () => {
        const graphData = { nodes, edges };
        try {
            const response = await axios.post('http://localhost:8000/graph/save', graphData);
            console.log('Graph saved with ID:', response.data.graph_id);
        } catch (error) {
            console.error('Ошибка при сохранении графа', error);
        }
    };

    const handleLoadGraph = async (graphId) => {
        try {
            const response = await axios.get(`http://localhost:8000/graph/load/${graphId}`);
            const { nodes, edges } = response.data;
            setNodes(nodes);
            setEdges(edges);
            setFilteredNodes(nodes);
            setFilteredEdges(edges);
            calculateGraphCharacteristics(nodes, edges);
        } catch (error) {
            console.error("Ошибка при загрузке графа", error);
        }
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
                    <GraphActions
                        graphIds={graphIds}
                        onSave={handleSaveGraph}
                        onLoad={handleLoadGraph}
                    />
                    <NetworkChart
                        ref={graphRef}
                        nodes={filteredNodes}
                        edges={filteredEdges}
                        onNodeClick={() => {}}
                        shortestPath={shortestPath}
                        onDeleteNode={(nodeId) => handleDeleteNode(nodes, setNodes, setFilteredNodes, nodeId)}
                        onUpdateNode={(updatedNode) => handleUpdateNode(nodes, setNodes, setFilteredNodes, updatedNode)}
                        onDeleteEdge={(edgeId) => handleDeleteEdge(edges, setEdges, setFilteredEdges, edgeId)}
                        onUpdateEdge={(updatedEdge) => handleUpdateEdge(edges, setEdges, setFilteredEdges, updatedEdge)}
                        onAddNode={(node) => handleAddNode(nodes, setNodes, setFilteredNodes, node)}
                        onAddEdge={(edge) => handleAddEdge(edges, setEdges, setFilteredEdges, edge)}
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
                    matrix={distanceMatrix}
                    />
                </>
            )}
        </div>
    );
};

export default Workspace;

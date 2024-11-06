import React, { useState, useEffect } from 'react';
import axios from 'axios';
import NodeSearch from './Nodes/NodeSearch';
import NetworkChart from './NetworkChart';
import GraphInfoPanel from './GraphInfoPanel';
import ShortestPathDialog from './ShortestPathDialog';
import ClusteringDialog from './ClusteringDialog';
import DistanceMatrixDialog from './DistanceMatrixDialog';

/**
 * Генерация случайного целого числа от 1 до max.
 * @param {number} max - Верхний предел для случайного числа.
 * @returns {number} Случайное целое число от 1 до max.
 */
const getRandomInt = (max) => Math.floor(Math.random() * max) + 1;

/**
 * Генерация случайного графа с n узлами и m рёбрами.
 * @param {number} n - Количество узлов.
 * @param {number} m - Количество рёбер.
 * @returns {Object} Сгенерированные узлы и рёбра.
 */
const generateRandomGraph = (n, m) => {
    const nodes = [];
    const edges = [];
    const edgeSet = new Set();

    // Генерация узлов
    for (let i = 1; i <= n; i++) {
        nodes.push({
            id: i,
            label: `gv${i}`,
            title: `tp${getRandomInt(5)}`, // Случайный title от tp1 до tp5
            type: `type${getRandomInt(6)}`  // Случайный type от type1 до type6
        });
    }

    // Генерация рёбер
    while (edges.length < m) {
        const from = getRandomInt(n);
        let to = getRandomInt(n);
        while (to === from) to = getRandomInt(n); // Чтобы не было самоссылающихся рёбер

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
    // Состояния для хранения данных о графе
    const [nodes, setNodes] = useState([]);
    const [edges, setEdges] = useState([]);
    const [filteredNodes, setFilteredNodes] = useState([]);
    const [filteredEdges, setFilteredEdges] = useState([]);
    const [selectedNodeIds, setSelectedNodeIds] = useState([]);
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

    // Диалоговые окна
    const [shortestPathDialogOpen, setShortestPathDialogOpen] = useState(false);
    const [clusteringDialogOpen, setClusteringDialogOpen] = useState(false);
    const [distanceMatrixDialogOpen, setDistanceMatrixDialogOpen] = useState(false);
    const [distanceMatrix, setDistanceMatrix] = useState(null);

    // Эффект для отслеживания изменения размера окна
    useEffect(() => {
        const handleResize = () => setIsMobileView(window.innerWidth <= 800);
        window.addEventListener('resize', handleResize);

        return () => window.removeEventListener('resize', handleResize);
    }, []);

    // Эффект для генерации случайного графа при монтировании компонента
    useEffect(() => {
        const n = 35; // Количество узлов
        const m = 45; // Количество рёбер
        const { nodes, edges } = generateRandomGraph(n, m);
        setNodes(nodes);
        setEdges(edges);
        setFilteredNodes(nodes);
        setFilteredEdges(edges);

        // Установка характеристик графа
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

    // Эффект для пересчёта характеристик графа при изменении узлов или рёбер
    useEffect(() => {
        calculateGraphCharacteristics();
    }, [nodes, edges]);

    /**
     * Расчёт характеристик графа, таких как степень, центральность и т. д.
     */
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
            setDistanceMatrix(response.data.distances);  // Сохраняем матрицу расстояний
        } catch (error) {
            console.error('Ошибка при расчёте характеристик графа', error);
        }
    };

    /**
     * Обработчик клика по узлу.
     * @param {Array} nodeIds - Массив выбранных узлов.
     */
    const handleNodeClick = (nodeIds) => setSelectedNodeIds(nodeIds);

    // Функции для добавления, обновления и удаления узлов и рёбер
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

    // Открытие диалога матрицы расстояний
    const handleOpenDistanceMatrixDialog = async () => {
        try {
            const response = await axios.post('http://localhost:5000/matrixlog', {
                nodes,
                edges,
            });
            setDistanceMatrix(response.data);
            setDistanceMatrixDialogOpen(true);
        } catch (error) {
            console.error('Ошибка при загрузке матрицы расстояний', error);
        }
    };

    /**
     * Сброс фильтров узлов и рёбер.
     */
    const handleResetFilters = (originalEdges, originalNodes) => {
        setNodes(originalNodes);
        setEdges(originalEdges);
    };

    return (
        <div style={{ position: 'relative', width: '100%', height: '100%' }}>
            {isMobileView ? (
                <div style={{ textAlign: 'center', marginTop: '20%', fontSize: '24px' }}>
                    Пожалуйста воспользуйтесь версией для ПК :)
                </div>
            ) : (
                <>
                    <GraphInfoPanel {...graphCharacteristics} />
                    <NodeSearch
                        nodes={nodes}
                        edges={edges}
                        onFilterNodes={setNodes}
                        onFilterEdges={setEdges}
                        onShortestPathClick={() => setShortestPathDialogOpen(true)}
                        onClusteringClick={() => setClusteringDialogOpen(true)}
                        onCalculateMatrix={handleOpenDistanceMatrixDialog}
                        onResetFilters={handleResetFilters}
                    />
                    <NetworkChart
                        nodes={nodes}
                        edges={edges}
                        onNodeClick={handleNodeClick}
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
                        onCalculate={() => {}}
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

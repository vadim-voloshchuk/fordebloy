import React, { useState, useEffect } from 'react';
import axios from 'axios';
import NodeSearch from './Nodes/NodeSearch';
import NetworkChart from './NetworkChart';
import GraphInfoPanel from './GraphInfoPanel';
import ShortestPathDialog from './ShortestPathDialog';
import ClusteringDialog from './ClusteringDialog';
import DistanceMatrixDialog from './DistanceMatrixDialog'; // Import the DistanceMatrixDialog component

const getRandomInt = (max) => {
    return Math.floor(Math.random() * max) + 1;
};

const generateRandomGraph = (n, m) => {
    const nodes = [];
    const edges = [];
    const edgeSet = new Set();

    for (let i = 1; i <= n; i++) {
        nodes.push({
            id: i,
            label: `gv${i}`,
            title: `tp${getRandomInt(5)}`, // Randomly select from tp1 to tp5
            type: `type${getRandomInt(6)}` // Randomly select from type1 to type3
        });
    }

    while (edges.length < m) {
        const from = getRandomInt(n);
        let to = getRandomInt(n);
        while (to === from) {
            to = getRandomInt(n);
        }
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
                type: `type${getRandomInt(3)}` // Randomly select from type1 to type3
            });
        }
    }

    return { nodes, edges };
}

const Workspace = () => {
    const [selectedNodeIds, setSelectedNodeIds] = useState([]);
    const [nodes, setNodes] = useState([]);
    const [edges, setEdges] = useState([]);
    const [filteredNodes, setFilteredNodes] = useState([]);
    const [filteredEdges, setFilteredEdges] = useState([]);
    const [isMobileView, setIsMobileView] = useState(window.innerWidth <= 800);

    useEffect(() => {
        const handleResize = () => {
            setIsMobileView(window.innerWidth <= 800);
        };

        window.addEventListener('resize', handleResize);

        // Удаляем слушатель при размонтировании компонента
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    const [shortestPathDialogOpen, setShortestPathDialogOpen] = useState(false);
    const [clusteringDialogOpen, setClusteringDialogOpen] = useState(false);
    const [distanceMatrixDialogOpen, setDistanceMatrixDialogOpen] = useState(false); // State to control the Distance Matrix Dialog
    const [distanceMatrix, setDistanceMatrix] = useState(null); // State to store the distance matrix

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

    useEffect(() => {
        const n = 20; // Number of nodes
        const m = 28; // Number of edges
        const { nodes, edges } = generateRandomGraph(n, m);
        setNodes(nodes);
        setEdges(edges);
        setFilteredNodes(nodes);
        setFilteredEdges(edges);

        setGraphCharacteristics({
            nodeCount: nodes.length,
            edgeCount: edges.length,
            nodeTypes: new Set(nodes.map(node => node.type)),
            edgeTypes: new Set(edges.map(edge => edge.type)),
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

    const handleNodeClick = (nodeIds) => {
        setSelectedNodeIds(nodeIds);
    };

    const handleAddNode = (node) => {
        setNodes((prevNodes) => [...prevNodes, node]);
        setFilteredNodes((prevNodes) => [...prevNodes, node]);
    };

    const handleUpdateNode = (updatedNode) => {
        setNodes((prevNodes) =>
            prevNodes.map((node) =>
                node.id === updatedNode.id ? updatedNode : node
            )
        );
        setFilteredNodes((prevNodes) =>
            prevNodes.map((node) =>
                node.id === updatedNode.id ? updatedNode : node
            )
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
            prevEdges.map((edge) =>
                edge.id === updatedEdge.id ? updatedEdge : edge
            )
        );
        setFilteredEdges((prevEdges) =>
            prevEdges.map((edge) =>
                edge.id === updatedEdge.id ? updatedEdge : edge
            )
        );
    };

    const handleDeleteEdge = (edgeId) => {
        setEdges((prevEdges) => prevEdges.filter((edge) => edge.id !== edgeId));
        setFilteredEdges((prevEdges) => prevEdges.filter((edge) => edge.id !== edgeId));
    };

    const calculateGraphCharacteristics = async () => {
        const degrees = nodes.map(node => edges.filter(edge => edge.from === node.id || edge.to === node.id).length);
        const maxDegree = Math.max(...degrees);

        try {
            const response = await axios.post('http://localhost:5000/graph-characteristics', {
                nodes,
                edges
            });

            console.log(response.data);

            setGraphCharacteristics({
                nodeCount: nodes.length,
                edgeCount: edges.length,
                nodeTypes: new Set(nodes.map(node => node.type)),
                edgeTypes: new Set(edges.map(edge => edge.type)),
                maxDegree,
                center: response.data.center.map(node => `${node},`),
                radius: response.data.radius,
                diameter: response.data.diameter,
                centralities: response.data.centralities
            });

            setDistanceMatrix(response.data.distances);  // Store the distance matrix
        } catch (error) {
            console.error('Error calculating graph characteristics', error);
        }
    };


    const handleShortestPathClick = () => {
        setShortestPathDialogOpen(true);
    };

    const handleClusteringClick = () => {
        setClusteringDialogOpen(true);
    };

    const handleShortestPathCalculate = (startNode, endNode) => {
        console.log(`Calculate shortest path from ${startNode} to ${endNode}`);
        // Implement shortest path calculation logic here
    };

    const handleClustering = async (method, nClusters) => {
        try {
            const response = await axios.post('http://localhost:5000/clustering', {
                nodes,
                edges,
                method,
                n_clusters: nClusters,
            });
            const labels = response.data.labels;
            const clusterColors = generateClusterColors(nClusters || Math.max(...labels) + 1);

            const clusteredNodes = nodes.map((node, index) => ({
                ...node,
                color: clusterColors[labels[index]],
            }));

            setNodes(clusteredNodes);
            setFilteredNodes(clusteredNodes);
            setClusteringDialogOpen(false);
        } catch (error) {
            console.error('Error performing clustering', error);
        }
    };

    const generateClusterColors = (numClusters) => {
        const colors = [];
        for (let i = 0; i < numClusters; i++) {
            colors.push(`hsl(${(i * 360) / numClusters}, 100%, 50%)`);
        }
        return colors;
    };

    const handleFilterNodes = (filteredNodes) => {
        console.log('Filtered Nodes:', filteredNodes); // Debugging line
        setNodes(filteredNodes);
    };

    const handleFilterEdges = (filteredEdges) => {
        console.log('Filtered Edges:', filteredEdges); // Debugging line
        setEdges(filteredEdges);
    };

    const handleOpenDistanceMatrixDialog = async () => {
        try {
            const response = await axios.post('http://localhost:5000/matrixlog', {
                nodes,
                edges
            });

            console.log(response.data);
            setDistanceMatrix(response.data);
            setDistanceMatrixDialogOpen(true);
        } catch (error) {
            console.error('Error fetching distance matrix', error);
        }
    };

    const handleResetFilters = (originalEdges, originalNodes) => {
        setNodes(originalNodes);
        setEdges(originalEdges);
    };

    return (
        <div style={{ position: 'relative', width: '100%', height: '100%' }}>
            {isMobileView ? (
                <div style={{ textAlign: 'center', marginTop: '20%', fontSize: '24px' }}>Пожалуйста воспользуйтесь версией для ПК :)</div>
            ) : (
                <>
                <GraphInfoPanel {...graphCharacteristics} />
                <NodeSearch
                    nodes={nodes}
                    edges={edges}
                    onFilterNodes={handleFilterNodes}
                    onFilterEdges={handleFilterEdges}
                    onShortestPathClick={handleShortestPathClick}
                    onClusteringClick={handleClusteringClick}
                    onCalculateMatrix={handleOpenDistanceMatrixDialog}
                    onResetFilters = {handleResetFilters}
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
                    onCalculate={handleShortestPathCalculate}
                />
                <ClusteringDialog
                    open={clusteringDialogOpen}
                    onClose={() => setClusteringDialogOpen(false)}
                    onCluster={handleClustering}
                />
                <DistanceMatrixDialog
                    open={distanceMatrixDialogOpen}
                    onClose={() => setDistanceMatrixDialogOpen(false)}
                    matrixString  ={distanceMatrix}
                />
            </>
            )}
        </div>
    );
};

export default Workspace;

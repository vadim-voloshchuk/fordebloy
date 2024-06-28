import React, { useEffect, useRef, useState } from 'react';
import { DataSet } from 'vis-data';
import { Network } from 'vis-network';
import axios from 'axios';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import Button from '@mui/material/Button';
import Checkbox from '@mui/material/Checkbox';
import FormControlLabel from '@mui/material/FormControlLabel';
import Tooltip from '@mui/material/Tooltip';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import './networkChart.css';

const NetworkChart = ({ nodes = [], edges = [], onNodeClick, onDeleteNode, onUpdateNode, onAddNode, onDeleteEdge, onUpdateEdge, onAddEdge }) => {
    const networkRef = useRef(null);
    const [selectedNodes, setSelectedNodes] = useState([]);
    const [contextMenu, setContextMenu] = useState({ mouseX: null, mouseY: null, item: null });
    const [dialogOpen, setDialogOpen] = useState(false);
    const [dialogMode, setDialogMode] = useState('');
    const [currentNode, setCurrentNode] = useState({ id: '', label: '', type: '' });
    const [newEdge, setNewEdge] = useState({ from: '', to: '', weights: '', directed: false, type: '' });
    const [hoveredNode, setHoveredNode] = useState(null);
    const [nodeDegrees, setNodeDegrees] = useState({});
    const [nodeCentralities, setNodeCentralities] = useState({});
    const [shortestPath, setShortestPath] = useState([]);

    useEffect(() => {
        const data = {
            nodes: new DataSet(nodes),
            edges: new DataSet(edges.map((edge, index) => {
                const weightsArray = edge.weights.split(',').map(Number);
                const isMultiple = weightsArray.length > 1;
                const edgeLabel = isMultiple ? `ge${index + 1}/v${index + 1}` : `ge${index + 1}/tp${edge.type.replace(/\D/g, '')}`;
                const edgeWidth = isMultiple ? 3 : 1;
                const edgeColor = isMultiple ? 'blue' : 'black';

                return {
                    ...edge,
                    label: edgeLabel,
                    color: edgeColor,
                    font: {
                        align: 'horizontal',
                        strokeWidth: 0,
                        background: '#ffffffaa'
                    },
                    width: edgeWidth
                };
            }))
        };

        const options = {
            nodes: {
                shape: 'ellipse',
                borderWidth: 2,
                font: {
                    color: 'black',
                    align: 'center'
                },
            },
            edges: {
                font: {
                    align: 'top',
                    background: '#ffffffaa'
                },
                color: 'black',
                arrows: {
                    to: { enabled: true, scaleFactor: 1 },
                    from: { enabled: false, scaleFactor: 1 },
                },
            },
            interaction: {
                hover: true,
                multiselect: true,
                selectable: true
            },
        };

        const network = new Network(networkRef.current, data, options);

        network.on("selectNode", (event) => {
            const { nodes } = event;
            setSelectedNodes(prevNodes => {
                const nodeIndex = prevNodes.indexOf(nodes[0]);
                if (nodeIndex !== -1) {
                    return [...prevNodes.slice(0, nodeIndex), ...prevNodes.slice(nodeIndex + 1)];
                } else {
                    return [...prevNodes, nodes[0]];
                }
            });
        });

        network.on("hoverNode", (params) => {
            const nodeId = params.node;
            const nodePosition = network.getPositions([nodeId])[nodeId];
            const degree = network.getConnectedEdges(nodeId).length;
            const centrality = nodeCentralities[nodeId] || 'N/A';
            setHoveredNode({ id: nodeId, degree, centrality, position: nodePosition });
        });

        network.on("blurNode", () => {
            setHoveredNode(null);
        });

        network.on("oncontext", (params) => {
            params.event.preventDefault();
            const nodeId = network.getNodeAt(params.pointer.DOM);
            const edgeId = network.getEdgeAt(params.pointer.DOM);
            if (nodeId || edgeId) {
                setContextMenu({
                    mouseX: params.event.clientX,
                    mouseY: params.event.clientY,
                    item: { type: nodeId ? 'node' : 'edge', id: nodeId || edgeId }
                });
            } else {
                setContextMenu({
                    mouseX: params.event.clientX,
                    mouseY: params.event.clientY,
                    item: { type: 'empty', pointer: params.pointer.canvas }
                });
            }
        });

        network.on("afterDrawing", (ctx) => {
            nodes.forEach((node) => {
                const nodePosition = network.getPositions([node.id])[node.id];
                ctx.font = '12px Arial';
                ctx.fillStyle = 'black';
                ctx.textAlign = 'center';
                ctx.fillText(`tp${node.type.replace(/\D/g, '')}`, nodePosition.x, nodePosition.y + 20);
            });

            // Highlight shortest path nodes and edges
            if (shortestPath.length > 0) {
                ctx.strokeStyle = 'red';
                ctx.lineWidth = 2;
                shortestPath.forEach((edge) => {
                    const fromPosition = network.getPositions([edge.from])[edge.from];
                    const toPosition = network.getPositions([edge.to])[edge.to];
                    ctx.beginPath();
                    ctx.moveTo(fromPosition.x, fromPosition.y);
                    ctx.lineTo(toPosition.x, toPosition.y);
                    ctx.stroke();
                });
            }
        });

        document.addEventListener('click', () => setContextMenu({ mouseX: null, mouseY: null, item: null }));

        // Calculate degrees
        const degrees = {};
        nodes.forEach(node => {
            degrees[node.id] = network.getConnectedEdges(node.id).length;
        });
        setNodeDegrees(degrees);

        // Placeholder for centrality calculation
        const centralities = {};
        nodes.forEach(node => {
            centralities[node.id] = 'N/A'; // Replace with actual centrality calculation
        });
        setNodeCentralities(centralities);

        return () => {
            if (network) {
                network.destroy();
            }
        };
    }, [nodes, edges, shortestPath]);

    useEffect(() => {
        if (selectedNodes.length === 2) {
            setNewEdge({ from: selectedNodes[0], to: selectedNodes[1], weights: '', directed: false, type: '' });
            setDialogOpen(true);
        }
    }, [selectedNodes]);

    useEffect(() => {
        console.log("Selected Nodes:", selectedNodes);
        onNodeClick(selectedNodes);
    }, [selectedNodes, onNodeClick]);

    useEffect(() => {
        const existingNetwork = networkRef.current;

        if (!existingNetwork || !existingNetwork.body || !existingNetwork.body.data || !existingNetwork.body.data.nodes) return;

        const allNodes = existingNetwork.body.data.nodes;

        allNodes.forEach((nodeId) => {
            const isSelected = selectedNodes.includes(nodeId);
            const node = existingNetwork.body.nodes[nodeId];
            node.setOptions({
                color: {
                    background: isSelected ? 'lightblue' : 'white',
                    border: isSelected ? 'blue' : 'black',
                },
            });
        });
    }, [selectedNodes]);

    const handleContextMenuAction = (action) => {
        if (contextMenu.item) {
            const { type, id, pointer } = contextMenu.item;
            switch (action) {
                case 'create':
                    setDialogMode('create');
                    setCurrentNode({ id: '', label: '', type: '', x: pointer.x, y: pointer.y });
                    setDialogOpen(true);
                    break;
                case 'update':
                    if (type === 'node') {
                        const nodeToUpdate = nodes.find(node => node.id === id);
                        setDialogMode('update');
                        setCurrentNode(nodeToUpdate);
                        setDialogOpen(true);
                    } else if (type === 'edge') {
                        const edgeToUpdate = edges.find(edge => edge.id === id);
                        setDialogMode('updateEdge');
                        setNewEdge(edgeToUpdate);
                        setDialogOpen(true);
                    }
                    break;
                case 'delete':
                    if (type === 'node') {
                        onDeleteNode(id);
                    } else if (type === 'edge') {
                        onDeleteEdge(id);
                    }
                    break;
                default:
                    break;
            }
        }
        setContextMenu({ mouseX: null, mouseY: null, item: null });
    };

    const handleDialogClose = () => {
        setDialogOpen(false);
        setSelectedNodes([]); // Clear the selected nodes
    };

    const handleDialogSave = () => {
        if (dialogMode === 'create') {
            const newNode = { ...currentNode, id: nodes.length + 1 };
            onAddNode(newNode);
        } else if (dialogMode === 'update') {
            onUpdateNode(currentNode);
        } else if (dialogMode === 'updateEdge') {
            onUpdateEdge(newEdge);
        } else if (dialogMode === '') {
            const edge = {
                ...newEdge,
                id: edges.length + 1,
                arrows: newEdge.directed ? 'to' : '',
                label: newEdge.type ? `ge${edges.length + 1}/tp${newEdge.type.replace(/\D/g, '')}` : `ge${edges.length + 1}`,
                title: `Weights: ${newEdge.weights}`
            };
            onAddEdge(edge);
        }
        setDialogOpen(false);
        setSelectedNodes([]); // Clear the selected nodes
    };

    const handleCalculateShortestPath = async (startNode, endNode) => {
        if (!startNode || !endNode) {
            console.error("Start node and end node must be defined");
            return;
        }

        const requestData = {
            nodes: nodes.map(node => ({ id: node.id })),
            edges: edges.map(edge => ({
                from: edge.from,
                to: edge.to,
                weight: Math.min(...edge.weights.split(',').map(Number)),  // Use the smallest weight for shortest path calculation
                directed: edge.directed || false
            })),
            start_node: startNode,  // Use snake_case keys as expected by the backend
            end_node: endNode       // Use snake_case keys as expected by the backend
        };

        console.log("Request Data:", JSON.stringify(requestData, null, 2)); // Log request data for debugging

        try {
            const response = await axios.post('http://185.36.147.31:5000/shortest-path', requestData);

            if (response.data.path) {
                const pathEdges = [];
                for (let i = 0; i < response.data.path.length - 1; i++) {
                    pathEdges.push({ from: response.data.path[i], to: response.data.path[i + 1] });
                }
                setShortestPath(pathEdges);
            } else {
                console.error('No path found');
            }
        } catch (error) {
            console.error('Error calculating shortest path', error.response ? error.response.data : error.message);
        }
    };

    const handleFindShortestPath = () => {
        if (selectedNodes.length === 2) {
            handleCalculateShortestPath(selectedNodes[0], selectedNodes[1]);
        } else {
            console.error("Please select exactly two nodes to find the shortest path");
        }
    };

    return (
        <div style={{ position: "relative" }}>
            <div ref={networkRef} style={{ width: '100%', height: '75vh' }} />
            <Menu
                open={contextMenu.mouseY !== null}
                onClose={() => setContextMenu({ mouseX: null, mouseY: null, item: null })}
                anchorReference="anchorPosition"
                anchorPosition={
                    contextMenu.mouseY !== null && contextMenu.mouseX !== null
                        ? { top: contextMenu.mouseY, left: contextMenu.mouseX }
                        : undefined
                }
            >
                {contextMenu.item?.type === 'node' && (
                    <>
                        <MenuItem onClick={() => handleContextMenuAction('update')}>Обновить</MenuItem>
                        <MenuItem onClick={() => handleContextMenuAction('delete')}>Удалить</MenuItem>
                    </>
                )}
                {contextMenu.item?.type === 'edge' && (
                    <>
                        <MenuItem onClick={() => handleContextMenuAction('update')}>Обновить</MenuItem>
                        <MenuItem onClick={() => handleContextMenuAction('delete')}>Удалить</MenuItem>
                    </>
                )}
                {contextMenu.item?.type === 'empty' && (
                    <MenuItem onClick={() => handleContextMenuAction('create')}>Создать Вершину</MenuItem>
                )}
            </Menu>

            <Dialog open={dialogOpen} onClose={handleDialogClose}>
                <DialogTitle>{dialogMode === 'create' ? 'Создать Вершину' : dialogMode === 'update' ? 'Обновить Вершину' : dialogMode === 'updateEdge' ? 'Обновить Связь' : 'Создать Связь'}</DialogTitle>
                <DialogContent>
                    {dialogMode === 'updateEdge' || dialogMode === '' ? (
                        <>
                            <TextField
                                margin="dense"
                                label="От"
                                type="number"
                                fullWidth
                                value={newEdge.from}
                                onChange={(e) => setNewEdge({ ...newEdge, from: e.target.value })}
                                disabled={dialogMode === 'updateEdge'}
                            />
                            <TextField
                                margin="dense"
                                label="К"
                                type="number"
                                fullWidth
                                value={newEdge.to}
                                onChange={(e) => setNewEdge({ ...newEdge, to: e.target.value })}
                                disabled={dialogMode === 'updateEdge'}
                            />
                            <TextField
                                margin="dense"
                                label="Вес связи"
                                type="text"
                                fullWidth
                                value={newEdge.weights}
                                onChange={(e) => setNewEdge({ ...newEdge, weights: e.target.value })}
                            />
                            <FormControlLabel
                                control={
                                    <Checkbox
                                        checked={newEdge.directed}
                                        onChange={(e) => setNewEdge({ ...newEdge, directed: e.target.checked })}
                                    />
                                }
                                label="Ориентированная"
                            />
                            <TextField
                                margin="dense"
                                label="Тип связи"
                                type="text"
                                fullWidth
                                value={newEdge.type}
                                onChange={(e) => setNewEdge({ ...newEdge, type: e.target.value })}
                            />
                        </>
                    ) : (
                        <>
                            <TextField
                                margin="dense"
                                label="ID"
                                type="text"
                                fullWidth
                                value={currentNode.id}
                                onChange={(e) => setCurrentNode({ ...currentNode, id: e.target.value })}
                                disabled={dialogMode === 'update'}
                            />
                            <TextField
                                margin="dense"
                                label="Тег"
                                type="text"
                                fullWidth
                                value={currentNode.label}
                                onChange={(e) => setCurrentNode({ ...currentNode, label: e.target.value })}
                            />
                            <TextField
                                margin="dense"
                                label="Тип вершины"
                                type="text"
                                fullWidth
                                value={currentNode.type}
                                onChange={(e) => setCurrentNode({ ...currentNode, type: e.target.value })}
                            />
                        </>
                    )}
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleDialogClose} color="primary">
                        Отмена
                    </Button>
                    <Button onClick={handleDialogSave} color="primary">
                        Сохранить
                    </Button>
                </DialogActions>
            </Dialog>

            {!dialogMode && hoveredNode && (
                <Tooltip
                    title={
                        <Card>
                            <CardContent>
                                <Typography variant="h6">ID Вершины: {hoveredNode.id}</Typography>
                                <Typography variant="body2">Степень: {hoveredNode.degree}</Typography>
                                <Typography variant="body2">Центральность: {hoveredNode.centrality}</Typography>
                            </CardContent>
                        </Card>
                    }
                    className={dialogOpen || dialogMode? 'hide-on-dialog' : ''}
                    sx={{position: 'relative'}}
                    open={Boolean(hoveredNode)}
                    placement="top"
                    disableHoverListener
                >
                    <div
                        style={{
                            position: 'absolute',
                            left: hoveredNode.position.x + 800,
                            top: hoveredNode.position.y + 500,
                            pointerEvents: 'none'
                        }}
                    />
                </Tooltip>
            )}
        </div>
    );
};

export default NetworkChart;

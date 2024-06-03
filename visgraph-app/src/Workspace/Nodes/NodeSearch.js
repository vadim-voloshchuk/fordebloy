import React, { useState, useEffect } from 'react';
import { TextField, Button, Box, Typography, MenuItem, Select, InputLabel, FormControl, Checkbox, ListItemText } from '@mui/material';

const NodeSearch = ({ nodes, edges, onFilterNodes, onFilterEdges, onShortestPathClick, onClusteringClick, onCalculateMatrix, onResetFilters }) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [searchType, setSearchType] = useState([]);
    const [searchWeight, setSearchWeight] = useState('');
    const [searchEdgeType, setSearchEdgeType] = useState([]);
    const [originalNodes, setOriginalNodes] = useState(nodes);
    const [originalEdges, setOriginalEdges] = useState(edges);

    useEffect(() => {
        setOriginalNodes(originalNodes);
        setOriginalEdges(originalEdges);
    }, [originalNodes, originalEdges]);

    useEffect(() => {
        onFilterNodes(nodes);
        onFilterEdges(edges);
    }, [nodes, edges, onFilterNodes, onFilterEdges]);

    const handleSearchChange = (e) => {
        const value = e.target.value;
        setSearchTerm(value);
        filterData(value, searchType, searchWeight, searchEdgeType);
    };

    const handleTypeChange = (e) => {
        const value = e.target.value;
        setSearchType(typeof value === 'string' ? value.split(',') : value);
        filterData(searchTerm, typeof value === 'string' ? value.split(',') : value, searchWeight, searchEdgeType);
    };

    const handleWeightChange = (e) => {
        const value = e.target.value;
        setSearchWeight(value);
        filterData(searchTerm, searchType, value, searchEdgeType);
    };

    const handleEdgeTypeChange = (e) => {
        const value = e.target.value;
        setSearchEdgeType(typeof value === 'string' ? value.split(',') : value);
        filterData(searchTerm, searchType, searchWeight, typeof value === 'string' ? value.split(',') : value);
    };

    const filterData = (term, type, weight, edgeType) => {
        let filteredNodes = nodes;
        let filteredEdges = edges;

        if (term) {
            filteredNodes = filteredNodes.filter(node => node.label.toLowerCase().includes(term.toLowerCase()));
        }
        if (type.length > 0) {
            filteredNodes = filteredNodes.filter(node => type.includes(node.type));
        }
        if (weight) {
            filteredEdges = filteredEdges.filter(edge => edge.weights.split(',').some(w => w.includes(weight)));
        }
        if (edgeType.length > 0) {
            filteredEdges = filteredEdges.filter(edge => edgeType.includes(edge.type));
        }

        onFilterNodes(filteredNodes);
        onFilterEdges(filteredEdges);
    };

    const handleResetFilters = () => {
        setSearchTerm('');
        setSearchType([]);
        setSearchWeight('');
        setSearchEdgeType([]);
        onResetFilters(originalEdges, originalNodes); // Use the parent component's reset function
        console.log("Filters reset to original nodes and edges");
    };

    return (
        <Box display="flex" flexDirection="row" alignItems="center" gap={2} sx={{ p: 2, border: '1px dashed grey' }}>

            <TextField
                label="Фильтрация по имени вершины"
                variant="outlined"
                value={searchTerm}
                onChange={handleSearchChange}
            />
            <FormControl variant="outlined" sx={{ minWidth: 200 }}>
                <InputLabel>Поиск по типу вершины</InputLabel>
                <Select
                    multiple
                    value={searchType}
                    onChange={handleTypeChange}
                    renderValue={(selected) => selected.join(', ')}
                >
                    {Array.from(new Set(nodes.map(node => node.type))).map((type) => (
                        <MenuItem key={type} value={type}>
                            <Checkbox checked={searchType.indexOf(type) > -1} />
                            <ListItemText primary={type} />
                        </MenuItem>
                    ))}
                </Select>
            </FormControl>
            <TextField
                label="Фильтрация по весу"
                variant="outlined"
                value={searchWeight}
                onChange={handleWeightChange}
            />
            <FormControl variant="outlined" sx={{ minWidth: 200 }}>
                <InputLabel>Поиск по типу связи</InputLabel>
                <Select
                    multiple
                    value={searchEdgeType}
                    onChange={handleEdgeTypeChange}
                    renderValue={(selected) => selected.join(', ')}
                >
                    {Array.from(new Set(edges.map(edge => edge.type))).map((type) => (
                        <MenuItem key={type} value={type}>
                            <Checkbox checked={searchEdgeType.indexOf(type) > -1} />
                            <ListItemText primary={type} />
                        </MenuItem>
                    ))}
                </Select>
            </FormControl>
            <Button variant="contained" color="primary" onClick={onShortestPathClick}>
                Кратчайший путь
            </Button>
            <Button variant="contained" color="primary" onClick={onClusteringClick}>
                Кластерзиация
            </Button>
            <Button variant="contained" color="primary" onClick={onCalculateMatrix}>
                Матрица расстояний
            </Button>
            <Button variant="contained" onClick={handleResetFilters}>
                Очистить фильтры
            </Button>
        </Box>
    );
};

export default NodeSearch;

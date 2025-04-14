import React, { useEffect, useState } from 'react';
import { Button, Box, Select, MenuItem, InputLabel, FormControl, Typography, Grid, TextField } from '@mui/material';
import axios from 'axios';

const GraphActions = ({ onSave, onLoad, graphIds }) => {
    const [selectedGraph, setSelectedGraph] = useState('');
    const [graphName, setGraphName] = useState('');
    const [error, setError] = useState('');

    const handleSaveGraph = async () => {
        if (!graphName) {
            setError('Please provide a name for the graph');
            return;
        }
        setError('');
        try {
            await onSave(graphName);
        } catch (err) {
            console.error("Error saving graph", err);
        }
    };

    const handleLoadGraph = async () => {
        if (!selectedGraph) {
            setError('Please select a graph to load');
            return;
        }
        setError('');
        try {
            await onLoad(selectedGraph);
        } catch (err) {
            console.error("Error loading graph", err);
        }
    };

    return (
        <Box sx={{ margin: '20px 0' }}>
            <Grid container spacing={2} justifyContent="center">
                {/* Save Graph */}
                <Grid item xs={12} sm={6} md={4}>
                    <TextField
                        label="Graph Name"
                        variant="outlined"
                        fullWidth
                        value={graphName}
                        onChange={(e) => setGraphName(e.target.value)}
                        error={!!error}
                        helperText={error && 'Graph name is required'}
                    />
                    <Button
                        variant="contained"
                        fullWidth
                        sx={{ marginTop: '20px' }}
                        onClick={handleSaveGraph}
                    >
                        Save Graph
                    </Button>
                </Grid>

                {/* Load Graph */}
                <Grid item xs={12} sm={6} md={4}>
                    <FormControl fullWidth>
                        <InputLabel>Select Graph</InputLabel>
                        <Select
                            value={selectedGraph}
                            onChange={(e) => setSelectedGraph(e.target.value)}
                            label="Select Graph"
                            fullWidth
                        >
                            {graphIds.map((id) => (
                                <MenuItem key={id} value={id}>
                                    {id}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>

                    <Button
                        variant="outlined"
                        fullWidth
                        sx={{ marginTop: '20px' }}
                        onClick={handleLoadGraph}
                    >
                        Load Graph
                    </Button>
                </Grid>
            </Grid>
        </Box>
    );
};

export default GraphActions;

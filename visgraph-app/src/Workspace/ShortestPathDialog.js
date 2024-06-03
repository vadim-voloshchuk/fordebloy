import React, { useState } from 'react';
import axios from 'axios';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField } from '@mui/material';

const ShortestPathDialog = ({ open, onClose, onCalculate, nodes, edges }) => {
    const [startNode, setStartNode] = useState('');
    const [endNode, setEndNode] = useState('');

    const handleCalculate = async () => {
        try {
            const response = await axios.post('http://localhost:5000/shortest-path', {
                startNode,
                endNode,
                nodes,
                edges
            });
            onCalculate(response.data);
        } catch (error) {
            console.error('Error calculating shortest path', error);
        }
        onClose();
    };

    return (
        <Dialog open={open} onClose={onClose}>
            <DialogTitle>Calculate Shortest Path</DialogTitle>
            <DialogContent>
                <TextField
                    label="Start Node"
                    fullWidth
                    value={startNode}
                    onChange={(e) => setStartNode(e.target.value)}
                />
                <TextField
                    label="End Node"
                    fullWidth
                    value={endNode}
                    onChange={(e) => setEndNode(e.target.value)}
                />
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose} color="primary">Cancel</Button>
                <Button onClick={handleCalculate} color="primary">Calculate</Button>
            </DialogActions>
        </Dialog>
    );
};

export default ShortestPathDialog;

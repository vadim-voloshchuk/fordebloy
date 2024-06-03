import React, { useState } from 'react';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import MenuItem from '@mui/material/MenuItem';

const ClusteringDialog = ({ open, onClose, onCluster }) => {
    const [method, setMethod] = useState('spectral');
    const [nClusters, setNClusters] = useState(3);

    const handleCluster = () => {
        onCluster(method, nClusters);
    };

    return (
        <Dialog open={open} onClose={onClose}>
            <DialogTitle>Кластеризация графа</DialogTitle>
            <DialogContent sx={{ marginTop: '10px', paddingTop: '10px !important' }}>
                <TextField
                    select
                    label="Метод кластеризации"
                    value={method}
                    onChange={(e) => setMethod(e.target.value)}
                    fullWidth
                >
                    <MenuItem value="spectral">Spectral Clustering</MenuItem>
                    <MenuItem value="kmeans">K-Means Clustering</MenuItem>
                    <MenuItem value="dbscan">DBSCAN</MenuItem>
                </TextField>
                {(method === 'spectral' || method === 'kmeans') && (
                    <TextField
                        margin="dense"
                        label="Количество кластеров"
                        type="number"
                        value={nClusters}
                        onChange={(e) => setNClusters(e.target.value)}
                        fullWidth
                    />
                )}
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose} color="primary">
                    Закрыть
                </Button>
                <Button onClick={handleCluster} color="primary">
                    Кластеризация
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default ClusteringDialog;

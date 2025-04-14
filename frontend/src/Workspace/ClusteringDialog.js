import React, { useState } from 'react';
import axios from 'axios';

import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import MenuItem from '@mui/material/MenuItem';

const ClusteringDialog = ({ open, onClose, onCluster, nodes, edges }) => {
    const [method, setMethod] = useState('spectral');
    const [nClusters, setNClusters] = useState(3);

    const handleCluster = async () => {
        try {
            // Отправляем запрос на /clustering
            const response = await axios.post('http://localhost:5000/clustering', {
                method,
                n_clusters: nClusters,
                nodes,
                edges
            });
            // Предположим, сервер возвращает { labels: [...]} – массив меток кластеров
            // Вызываем onCluster, чтобы сообщить родителю результат
            onCluster(response.data);
        } catch (error) {
            console.error('Ошибка при кластеризации:', error);
        }
        // Закрыть диалог после отправки
        onClose();
    };

    return (
        <Dialog open={open} onClose={onClose}>
            <DialogTitle>Кластеризация графа</DialogTitle>
            <DialogContent>
                <TextField
                    select
                    label="Метод кластеризации"
                    value={method}
                    onChange={(e) => setMethod(e.target.value)}
                    fullWidth
                    style={{ marginBottom: '10px' }}
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

import React from 'react';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    Typography,
} from '@mui/material';

// // Function to convert JSON string with 'Infinity' values to a proper object
// const parseMatrixString = (matrixString) => {
//     if (!matrixString) {
//         return null;
//     }
//     try {
//         return JSON.parse(matrixString, (key, value) =>
//             value === "Infinity" ? Infinity : value
//         );
//     } catch (error) {
//         console.error("Invalid JSON string:", matrixString);
//         return null;
//     }
// };

const DistanceMatrixDialog = ({ open, onClose, matrixString }) => {
    const matrix = matrixString;
    const hasMatrix = matrix && Object.keys(matrix).length > 0;

    return (
        <Dialog open={open} onClose={onClose} maxWidth="lg">
            <DialogTitle>Distance Matrix</DialogTitle>
            <DialogContent>
                {hasMatrix ? (
                    <TableContainer component={Paper}>
                        <Table>
                            <TableHead>
                                <TableRow>
                                    <TableCell>Node</TableCell>
                                    {Object.keys(matrix).map((node) => (
                                        <TableCell key={node}>{node}</TableCell>
                                    ))}
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {Object.keys(matrix).map((node) => (
                                    <TableRow key={node}>
                                        <TableCell>{node}</TableCell>
                                        {Object.keys(matrix[node]).map((targetNode) => (
                                            <TableCell key={targetNode}>
                                                {matrix[node][targetNode] === Infinity
                                                    ? '∞'
                                                    : matrix[node][targetNode]}
                                            </TableCell>
                                        ))}
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                ) : (
                    <Typography>Матрицы нет</Typography>
                )}
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose} color="primary">
                    Закрыть
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default DistanceMatrixDialog;

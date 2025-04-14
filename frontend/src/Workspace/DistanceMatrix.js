import React from 'react';

const DistanceMatrix = ({ matrix }) => {
    return (
        <div>
            <h3>Distance Matrix</h3>
            <table>
                <thead>
                    <tr>
                        <th>Node</th>
                        {Object.keys(matrix).map(node => (
                            <th key={node}>{node}</th>
                        ))}
                    </tr>
                </thead>
                <tbody>
                    {Object.keys(matrix).map(rowNode => (
                        <tr key={rowNode}>
                            <td>{rowNode}</td>
                            {Object.keys(matrix[rowNode]).map(colNode => (
                                <td key={colNode}>{matrix[rowNode][colNode]}</td>
                            ))}
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default DistanceMatrix;

import React from 'react';

const GraphInfoPanel = ({ nodeCount, edgeCount, nodeTypes, edgeTypes, maxDegree, center, radius, diameter }) => {
    return (
        <div style={{ 
            position: 'absolute', 
            bottom: '10px', 
            left: '10px', 
            backgroundColor: 'white', 
            border: '1px solid black', 
            padding: '10px', 
            zIndex: 10 
        }}>
            <h3>Характеристики графа</h3>
            <p>Количество вершин: {nodeCount}</p>
            <p>Количество связей: {edgeCount}</p>
            <p>Количество типов вершин: {nodeTypes.size}</p>
            <p>Количество типов связей: {edgeTypes.size}</p>
            <p>Максимальная степень: {maxDegree}</p>
            <p>Центр: {center}</p>
            <p>Радиус: {radius}</p>
            <p>Диаметр: {diameter}</p>
        </div>
    );
};

export default GraphInfoPanel;

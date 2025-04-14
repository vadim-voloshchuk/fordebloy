import React, { useState, useEffect } from 'react';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';

const NodeForm = ({ selectedNodeId, onAddNode, onUpdateNode, onDeleteNode }) => {
  const [nodeType, setNodeType] = useState('');

  useEffect(() => {
    if (selectedNodeId !== null) {
      // Оставляем пустые поля, если выбрана существующая вершина
      setNodeType('');
    }
  }, [selectedNodeId]);

  const handleAddNode = () => {
    // Генерируем id и label автоматически
    const id = Math.floor(Math.random() * 1000); // Генерируем случайный id
    const label = `gv${id}`; // Формируем label из id

    // Проверяем, что введен корректный тип вершины
    if (!nodeType.trim()) {
      alert('Please enter node type');
      return;
    }

    // Вызываем функцию добавления вершины
    onAddNode({ id, label, title: nodeType });

    // Очищаем поле ввода типа вершины после добавления
    setNodeType('');
  };

  return (
    <Box display="flex" flexDirection="column" gap={2}>
      <TextField
        label="Node Type"
        variant="outlined"
        value={nodeType}
        onChange={(e) => setNodeType(e.target.value)}
      />
      <Button variant="contained" color="primary" onClick={handleAddNode}>
        Add Node
      </Button>
    </Box>
  );
};

export default NodeForm;

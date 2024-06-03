// ProfilePage.js
import React, { useState } from 'react';
import { Typography, Button, Grid } from '@mui/material'; // Import Material UI components

const ProfilePage = () => {
  // Список графов пользователя (предположим, что у пользователя есть массив графов)
  const userGraphs = [
    { id: 1, name: 'Граф 1', /* данные графа */ },
    { id: 2, name: 'Граф 2', /* данные графа */ },
    { id: 3, name: 'Граф 3', /* данные графа */ },
    // Добавьте нужное количество графов пользователя сюда
  ];

  // Состояние для отслеживания выбранного графа для отображения
  const [selectedGraph, setSelectedGraph] = useState(null);

  return (
    <div>
      <Typography variant="h4" gutterBottom>
        Мой профиль
      </Typography>

      <Grid container spacing={2}>
        {/* Отображаем список графов пользователя */}
        {userGraphs.map(graph => (
          <Grid item key={graph.id}>
            <Button variant="outlined" onClick={() => setSelectedGraph(graph)}>
              {graph.name}
            </Button>
          </Grid>
        ))}
      </Grid>

      {/* Отображаем выбранный граф */}
      {selectedGraph && (
        <div>
          <Typography variant="h5" gutterBottom>
            Вы выбрали граф: {selectedGraph.name}
          </Typography>
          {/* Здесь можно отобразить выбранный граф */}
        </div>
      )}
    </div>
  );
};

export default ProfilePage;

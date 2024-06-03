import React from 'react';
import { Typography, Button, Grid, Container, Paper } from '@mui/material'; // Импортируем компоненты Material UI
import { Link } from 'react-router-dom'; // Импортируем компонент Link для маршрутизации

const LandingPage = () => {
  return (
    <Container maxWidth="md"> {/* Обертка контейнера для центрирования содержимого */}
      <Paper elevation={3} style={{ padding: '20px', marginTop: '20px' }}> {/* Бумага с тенью */}
        <Typography variant="h2" gutterBottom>
          Добро пожаловать на наш лендинг
        </Typography>
        <Typography variant="body1" paragraph>
          Здесь вы можете узнать о нашем проекте и его возможностях.
        </Typography>
        <Typography variant="body1" paragraph>
          Присоединяйтесь к нам, чтобы начать использовать наш продукт прямо сейчас!
        </Typography>
        <Grid container spacing={2}>
          <Grid item>
            <Button variant="contained" color="primary" component={Link} to="/workspace">
              Начать использовать
            </Button>
          </Grid>
          <Grid item>
            <Button variant="outlined" color="primary" component={Link} to="/help">
              Узнать больше
            </Button>
          </Grid>
        </Grid>
      </Paper>
    </Container>
  );
};

export default LandingPage;

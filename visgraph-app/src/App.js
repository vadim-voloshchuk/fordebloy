import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom'; 
import { AppBar, Toolbar, Typography, Button } from '@mui/material'; // Импортируем компоненты Material UI
import Workspace from './Workspace/Workspace';
import HelpPage from './HelpPage';
import ProfilePage from './ProfilePage';
import LandingPage from './LandingPage'; // Импортируем компонент лендинг страницы

const App = () => {
  return (
    <Router>
      <div>
        {/* Material UI AppBar */}
        <AppBar position="static">
          <Toolbar>
            <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
              GNETWORK
            </Typography>
            <Button color="inherit" component={Link} to="/">Home</Button> {/* Link to Home page */}
            <Button color="inherit" component={Link} to="/help">Docs</Button> {/* Link to Help page */}
            <Button color="inherit" component={Link} to="/profile">Profile</Button> {/* Link to Profile page */}
          </Toolbar>
        </AppBar>

        {/* Routes */}
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/help" element={<HelpPage />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/workspace" element={<Workspace />} /> {/* Route to Landing page */}
        </Routes>
      </div>
    </Router>
  );
};

export default App;

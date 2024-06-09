import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import Workspace from './Workspace/Workspace';
import HelpPage from './HelpPage';
import ProfilePage from './ProfilePage';
import LandingPage from './LandingPage'; // Импортируем компонент лендинг страницы
import Header from './Header/header';

const App = () => {
  return (
    <Router>
      <div>
        {/* Material UI AppBar */}
        <Header />

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

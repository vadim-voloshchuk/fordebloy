import "./header.css";
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { AppBar, Toolbar, Typography, Button } from '@mui/material';

const Header = () => {
  return (
    <div className="header">
      <span className="logo">GNETWORK</span>

      <div className="menu">
        <Link to="/" className="menu_main">
          Главная
        </Link>

        <Link to="/help" className="menu_main">Документация</Link>

        <Link to="/profile" className="menu_main">
            Профиль
        </Link>
      </div>
    </div>
  );
};

export default Header;

import "./header.css";
import {Link } from 'react-router-dom';

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

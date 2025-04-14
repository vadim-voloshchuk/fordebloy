import "./header.css";
import { Link } from 'react-router-dom';

const Header = () => {
  return (
    <div className="header">
      <span className="logo">NeuroWeave</span>

      <div className="menu">
        <Link to="/" className="menu_main">
          Главная
        </Link>

        <Link to="/help" className="menu_main">Документация</Link>
      </div>
    </div>
  );
};

export default Header;

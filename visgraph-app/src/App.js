/**
 * App Component
 *
 * Главный компонент приложения, который использует React Router для навигации
 * между различными страницами приложения. Включает в себя маршруты для
 * LandingPage, HelpPage, ProfilePage и Workspace.
 */

import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Workspace from './Workspace/Workspace';   // Страница рабочего пространства
import HelpPage from './HelpPage';                // Страница с помощью
import ProfilePage from './ProfilePage';          // Страница профиля пользователя
import LandingPage from './LandingPage';          // Лендинг страница
import Header from './Header/header';             // Компонент шапки приложения

const App = () => {
  return (
    <Router>
      <div>
        {/* Header: Шапка страницы с навигацией */}
        <Header />

        {/* Механизм маршрутизации для разных страниц */}
        <Routes>
          <Route path="/" element={<LandingPage />} />         {/* Лендинг страница */}
          <Route path="/help" element={<HelpPage />} />        {/* Страница помощи */}
          <Route path="/profile" element={<ProfilePage />} />  {/* Страница профиля */}
          <Route path="/workspace" element={<Workspace />} />  {/* Рабочее пространство */}
        </Routes>
      </div>
    </Router>
  );
};

export default App;

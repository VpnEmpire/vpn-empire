// src/components/BottomNav.jsx
import React from 'react';
import './BottomNav.css';

const BottomNav = ({ currentTab, setCurrentTab }) => {
  return (
    <div className="bottom-nav">
      <div
        className={`nav-item ${currentTab === 'home' ? 'active' : ''}`}
        onClick={() => setCurrentTab('home')}
      >
        🏠
        <div className="label">Главная</div>
      </div>

      <div
        className={`nav-item ${currentTab === 'tasks' ? 'active' : ''}`}
        onClick={() => setCurrentTab('tasks')}
      >
        📋
        <div className="label">Задания</div>
      </div>

      <div
        className={`nav-item ${currentTab === 'roulette' ? 'active' : ''}`}
        onClick={() => setCurrentTab('roulette')}
      >
        🎰
        <div className="label">Рулетка</div>
      </div>

      <div
        className={`nav-item ${currentTab === 'top' ? 'active' : ''}`}
        onClick={() => setCurrentTab('top')}
      >
        🏆
        <div className="label">Топ</div>
      </div>

      <div
        className={`nav-item ${currentTab === 'profile' ? 'active' : ''}`}
        onClick={() => setCurrentTab('profile')}
      >
        👤
        <div className="label">Профиль</div>
      </div>
    </div>
  );
};

export default BottomNav;

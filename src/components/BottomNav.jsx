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
        <div className="icon">🏠</div>
        <div className="label">Главная</div>
      </div>

      <div
        className={`nav-item ${currentTab === 'tasks' ? 'active' : ''}`}
        onClick={() => setCurrentTab('tasks')}
      >
        <div className="icon">📋</div>
        <div className="label">Задания</div>
      </div>

      <div
        className={`nav-item ${currentTab === 'roulette' ? 'active' : ''}`}
        onClick={() => setCurrentTab('roulette')}
      >
        <div className="icon">🎰</div>
        <div className="label">Рулетка</div>
      </div>

      <div
        className={`nav-item ${currentTab === 'top' ? 'active' : ''}`}
        onClick={() => setCurrentTab('top')}
      >
        <div className="icon">🏆</div>
        <div className="label">Топ</div>
      </div>

      <div
        className={`nav-item ${currentTab === 'withdraw' ? 'active' : ''}`}
        onClick={() => setCurrentTab('withdraw')}
      >
        <div className="icon">💸</div>
        <div className="label">Вывести</div>
      </div>
    </div>
  );
};

export default BottomNav;


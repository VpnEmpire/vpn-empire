// BottomNav.jsx
import React from 'react';
import './BottomNav.css';

const BottomNav = ({ currentTab, setCurrentTab }) => {
  return (
    <div className="bottom-nav">
      <button className={currentTab === 'main' ? 'active' : ''} onClick={() => setCurrentTab('main')}>🏠 Главная</button>
      <button className={currentTab === 'tasks' ? 'active' : ''} onClick={() => setCurrentTab('tasks')}>🎯 Задания</button>
      <button className={currentTab === 'roulette' ? 'active' : ''} onClick={() => setCurrentTab('roulette')}>🎰 Рулетка</button>
      <button className={currentTab === 'top' ? 'active' : ''} onClick={() => setCurrentTab('top')}>🏆 Топ</button>
    </div>
  );
};

export default BottomNav;

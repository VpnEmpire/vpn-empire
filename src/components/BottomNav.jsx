// src/components/BottomNav.jsx
import React from 'react';
import './BottomNav.css';

function BottomNav({ activeTab, setActiveTab }) {
  return (
    <div className="bottom-nav">
      <button onClick={() => setActiveTab('main')}>🏠 Главная</button>
      <button onClick={() => setActiveTab('tasks')}>📋 Задания</button>
      <button onClick={() => setActiveTab('roulette')}>🎰 Рулетка</button>
      <button onClick={() => setActiveTab('top')}>🏆 Топ</button>
      <button onClick={() => setActiveTab('withdraw')}>💸 Вывести</button>
    </div>
  );
}

export default BottomNav;

const BottomNav = ({ activeTab, setActiveTab }) => {
  return (
    <div className="bottom-nav">
      <div
        className={`nav-item ${activeTab === 'home' ? 'active' : ''}`}
        onClick={() => setActiveTab('home')}
      >
        <div className="icon">🏠</div>
        <div className="label">Главная</div>
      </div>

      <div
        className={`nav-item ${activeTab === 'tasks' ? 'active' : ''}`}
        onClick={() => setActiveTab('tasks')}
      >
        <div className="icon">📋</div>
        <div className="label">Задания</div>
      </div>

      <div
        className={`nav-item ${activeTab === 'roulette' ? 'active' : ''}`}
        onClick={() => setActiveTab('roulette')}
      >
        <div className="icon">🎰</div>
        <div className="label">Рулетка</div>
      </div>
      
      <div
        className={`nav-item ${activeTab === 'top' ? 'active' : ''}`}
        onClick={() => setActiveTab('top')}
      >
        <div className="icon">🏆</div>
        <div className="label">Топ</div>
      </div>

      <div
        className={`nav-item ${activeTab === 'withdraw' ? 'active' : ''}`}
        onClick={() => setActiveTab('withdraw')}
      >
        <div className="icon">💸</div>
        <div className="label">Вывести</div>
      </div>
    </div>
  );
};

export default BottomNav;


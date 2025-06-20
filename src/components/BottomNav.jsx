import React from 'react';

export default function BottomNav({ currentTab, setTab }) {
  return (
    <div className="bottom-nav">
      <button onClick={() => setTab('home')} className={currentTab === 'home' ? 'active' : ''}>🏠 Главная</button>
      <button onClick={() => setTab('roulette')} className={currentTab === 'roulette' ? 'active' : ''}>🎰 Рулетка</button>
      <button onClick={() => setTab('tasks')} className={currentTab === 'tasks' ? 'active' : ''}>📋 Задания</button>
      <button onClick={() => setTab('top')} className={currentTab === 'top' ? 'active' : ''}>🏆 Топ</button>
    </div>
  );
}

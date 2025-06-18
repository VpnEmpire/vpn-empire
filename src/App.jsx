import React, { useState } from 'react';
import './App.css';

function App() {
  const [coins, setCoins] = useState(0);

  const handleClick = () => {
    setCoins(coins + 1);
  };

  return (
    <div className="app">
      <h1>VPN Empire 🚀</h1>
      <p>Добро пожаловать в мини-приложение!</p>
      <div className="main-screen">
        <img
          src="/robot.png"
          alt="Робот"
          style={{ width: '100%', cursor: 'pointer' }}
          onClick={handleClick}
        />
        <h2>{coins} $RICH</h2>
        <p>Кликай по роботу, чтобы зарабатывать!</p>
      </div>
    </div>
  );
}

export default App; 

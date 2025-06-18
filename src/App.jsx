import React, { useState } from 'react';
import './App.css';

function App() {
  const [coins, setCoins] = useState(0);

  const handleClick = () => {
    if (coins < 100) {
      setCoins(coins + 1);
      const robot = document.getElementById('robot');
      robot.classList.add('shake');
      setTimeout(() => robot.classList.remove('shake'), 300);
    }
  };

  return (
    <div className="app">
      <h1>VPN Empire 🚀</h1>
      <p>Добро пожаловать в мини-приложение!</p>
      <img
        id="robot"
        src="/robot.png"
        alt="Робот"
        className="robot"
        onClick={handleClick}
      />
      <p className="counter">{coins}/100 монет</p>
    </div>
  );
}

export default App;

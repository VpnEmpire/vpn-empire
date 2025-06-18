import React, { useState } from 'react';
import './App.css';

function App() {
  const [coins, setCoins] = useState(0);

  const handleClick = () => {
    setCoins(coins + 1); // Можно заменить на +10 или +100
  };

  return (
    <div className="app">
      <div className="start-screen main-screen">
        <h1>VPN Empire 🚀</h1>
        <p>Монеты: <strong>{coins} $RICH</strong></p>
        <button onClick={handleClick}>Кликни, чтобы заработать</button>
      </div>
    </div>
  );
}

export default App;


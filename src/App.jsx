import { useState } from 'react';
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
      <img
        src="/robot.png"
        alt="robot"
        className="clickable-robot"
        onClick={handleClick}
      />
      <p className="counter">{coins} $RICH</p>
    </div>
  );
}

export default App;

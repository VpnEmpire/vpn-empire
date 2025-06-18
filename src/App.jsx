import { useState } from 'react';
import './App.css';

function App() {
  const [coins, setCoins] = useState(0);

  const handleClick = () => {
    if (coins < 100) {
      setCoins(coins + 1);
    }
  };

  return (
    <div className="app">
      <h1>VPN Empire 🚀</h1>
      <p>Добро пожаловать в мини-приложение!</p>
      <div className="main-screen">
        <img
          src="/robot.png"
          alt="robot"
          width={150}
          onClick={handleClick}
          style={{ cursor: 'pointer' }}
        />
        <h2>{coins}/100 монет</h2>
      </div>
    </div>
  );
}

export default App;

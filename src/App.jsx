import { useState } from 'react';
import './App.css';

function App() {
  const [started, setStarted] = useState(false);
  const [coins, setCoins] = useState(0);
  const [limitReached, setLimitReached] = useState(false);

  const maxDailyCoins = 100;

  const handleStart = () => {
    setStarted(true);
  };

  const handleClick = () => {
    if (coins < maxDailyCoins) {
      setCoins(prev => prev + 1);
    } else {
      setLimitReached(true);
    }
  };

  return (
    <div className="app">
      {!started ? (
        <div className="start-screen">
          <h1>VPN Empire</h1>
          <p>Нажимай на робота и получай $RICH</p>
          <button onClick={handleStart}>Начать</button>
        </div>
      ) : (
        <div className="main-screen">
          <img
            src="/robot.png"
            alt="Robot"
            className="robot"
            onClick={handleClick}
          />
          <div className="counter">
            {coins}/{maxDailyCoins} монет
            {limitReached && <p>На сегодня лимит!</p>}
          </div>
        </div>
      )}
    </div>
  );
}

export default App; 

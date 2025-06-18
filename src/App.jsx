import { useState } from 'react';
import './App.css';
import robotImg from '/robot.png';

function App() {
  const [coins, setCoins] = useState(0);
  const [shake, setShake] = useState(false);

  const handleClick = () => {
    if (coins < 100) {
      setCoins(coins + 1);
      setShake(true);
      setTimeout(() => setShake(false), 300);
    }
  };

  return (
     <div className="app">
    <img
      src="/robot.png"
      alt="Robot"
      className={`robot ${isShaking ? 'shake' : ''}`}
      onClick={handleClick}
    />
    <p className="counter">{count} монет</p>
      <div className="main-screen">
        <h1>Кликай и зарабатывай $RICH</h1>
        <img
          src={robotImg}
          alt="Robot"
          className={`robot ${shake ? 'shake' : ''}`}
          onClick={handleClick}
        />
        <div className="counter">{coins}/100 монет</div>
      </div>
    </div>
  );
}

export default App;

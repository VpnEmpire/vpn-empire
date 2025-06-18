import React, { useState } from 'react';
import './App.css';

function App() {
  const [coins, setCoins] = useState(0);
  const [isClicked, setIsClicked] = useState(false);

  const handleClick = () => {
    setCoins(coins + 1);
    setIsClicked(true);
    setTimeout(() => setIsClicked(false), 150);
  };

  return (
    <div className="container">
      <div className="counter">{coins} $RICH</div>
      <img
        src="/robot.png"
        alt="robot"
        className={`robot ${isClicked ? 'clicked' : ''}`}
        onClick={handleClick}
      />
    </div>
  );
}

export default App;

import { useState, useEffect, useRef } from 'react';
import './App.css';

function App() {
  const [coins, setCoins] = useState(0);
  const [dailyLimit, setDailyLimit] = useState(100);
  const [isShaking, setIsShaking] = useState(false);
  const clickSoundRef = useRef(null);

  const getRank = (coins) => {
    if (coins >= 1000) return '👑 Легенда VPN';
    if (coins >= 500) return '🚀 Профи';
    if (coins >= 250) return '🛡️ Спецагент';
    if (coins >= 100) return '🔐 Агент';
    return '👶 Новичок';
  };

  useEffect(() => {
    const storedCoins = parseInt(localStorage.getItem('coins')) || 0;
    const storedDate = localStorage.getItem('lastClickDate');
    const today = new Date().toDateString();

    if (storedDate !== today) {
      setCoins(0);
      setDailyLimit(100);
      localStorage.setItem('lastClickDate', today);
      localStorage.setItem('coins', '0');
    } else {
      setCoins(storedCoins);
      setDailyLimit(100 - storedCoins);
    }
  }, []);

  const handleClick = () => {
    if (coins < 100) {
      const newCoins = coins + 1;
      setCoins(newCoins);
      setDailyLimit(100 - newCoins);
      localStorage.setItem('coins', newCoins.toString());

      if (clickSoundRef.current) {
        clickSoundRef.current.currentTime = 0;
        clickSoundRef.current.play();
      }

      setIsShaking(true);
      setTimeout(() => setIsShaking(false), 300);
    }
  };

  return (
    <div className="app">
      <h1>👾 VPN Empire 🚀</h1>
      <p>Монеты: {coins} $RICH</p>
      <p>Звание: {getRank(coins)}</p>

      <img
        src="/robot.png"
        alt="Робот"
        className={`robot ${isShaking ? 'shake' : ''}`}
        onClick={handleClick}
      />

      <div className="counter">
        {dailyLimit > 0
          ? 'Кликай, чтобы заработать'
          : 'Лимит на сегодня исчерпан'}
      </div>

      <audio ref={clickSoundRef} src="/click.mp3" preload="auto" />
    </div>
  );
}

export default App; 

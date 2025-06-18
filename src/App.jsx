import { useState, useEffect, useRef } from 'react';
import './App.css';

function App() {
  const [coins, setCoins] = useState(0);
  const [dailyLimit, setDailyLimit] = useState(100);
  const [isShaking, setIsShaking] = useState(false);
  const containerRef = useRef(null); // 🎯 Для позиционирования вспышек

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

  const handleClick = (e) => {
    if (coins < 100) {
      const newCoins = coins + 1;
      setCoins(newCoins);
      setDailyLimit(100 - newCoins);
      localStorage.setItem('coins', newCoins.toString());

      setIsShaking(true);
      setTimeout(() => setIsShaking(false), 300);

      // 🌟 Создаём вспышку
      const sparkle = document.createElement('div');
      sparkle.className = 'sparkle';
      const rect = containerRef.current.getBoundingClientRect();
      sparkle.style.left = `${e.clientX - rect.left - 12}px`;
      sparkle.style.top = `${e.clientY - rect.top - 12}px`;
      containerRef.current.appendChild(sparkle);
      setTimeout(() => sparkle.remove(), 600);
    }
  };

  return (
    <div className="app">
      <h1>👾 VPN Empire</h1>
      <p>Кликай на робота и зарабатывай монеты!</p>
      <div className="main-screen" ref={containerRef}>
        <img
          src="/robot.png"
          alt="Робот"
          className={`robot ${isShaking ? 'shake' : ''}`}
          onClick={handleClick}
        />
        <div className="counter">
          {coins}/100 монет
        </div>
      </div>
    </div>
  );
}

export default App;

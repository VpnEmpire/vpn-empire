import { useState, useEffect, useRef } from 'react';

const RANKS = [
  { title: 'Новичок', threshold: 0 },
  { title: 'Агент', threshold: 300 },
  { title: 'Профи', threshold: 600 },
  { title: 'Эксперт', threshold: 1000 },
  { title: 'Легенда VPN', threshold: 1500 }
];

const Home = ({ coins, setCoins }) => {
  const [dailyLimit, setDailyLimit] = useState(100);
  const [isShaking, setIsShaking] = useState(false);
  const clickSoundRef = useRef(null);

  useEffect(() => {
    const storedDate = localStorage.getItem('lastClickDate');
    const today = new Date().toDateString();

    if (storedDate !== today) {
      setCoins(0);
      setDailyLimit(100);
      localStorage.setItem('lastClickDate', today);
      localStorage.setItem('coins', '0');
    } else {
      const storedCoins = parseInt(localStorage.getItem('coins')) || 0;
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

  const getRank = () =>
    RANKS.slice().reverse().find(rank => coins >= rank.threshold)?.title || 'Новичок';

  const getHelperMessage = () => {
    if (coins >= 1500) return '🎉 Ты — Легенда VPN! Мир свободы открыт для тебя.';
    if (coins >= 1000) return '🧠 Ты стал Экспертом! Осталось немного до легенды.';
    if (coins >= 600) return '🚀 Отличная работа, Профи! Продолжай в том же духе.';
    if (coins >= 300) return '🕵️ Ты уже Агент! Поделись VPN с друзьями.';
    if (coins > 0) return '🔥 Хорошее начало! Продолжай клики и выполняй задания.';
    return '👋 Я твой помощник! Кликай на робота и зарабатывай монеты.';
  };

  return (
    <div>
      <div className="stats">
        <p><strong>Монет:</strong> {coins} $RICH</p>
        <p><strong>Звание:</strong> {getRank()}</p>
      </div>
      <img
        src="/robot.png"
        alt="Робот"
        className={`robot ${isShaking ? 'shake' : ''}`}
        onClick={handleClick}
      />
      <div className="counter">{coins}/100 монет {dailyLimit <= 0 && '(лимит на сегодня)'}</div>
      <div className="helper">
        <p>{getHelperMessage()}</p>
      </div>
      <audio ref={clickSoundRef} src="/click.mp3" preload="auto" />
    </div>
  );
};

export default Home;

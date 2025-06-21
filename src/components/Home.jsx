import { useState, useEffect, useRef } from 'react';

const RANKS = [
  { title: 'Новичок', threshold: 0 },
  { title: 'Агент', threshold: 300 },
  { title: 'Профи', threshold: 600 },
  { title: 'Эксперт', threshold: 1000 },
  { title: 'Легенда VPN', threshold: 1500 }
];

const Home = ({ coins, setCoins }) => {
  const [clickCoins, setClickCoins] = useState(0);
  const [dailyLimit, setDailyLimit] = useState(100);
  const [isShaking, setIsShaking] = useState(false);
  const clickSoundRef = useRef(null);

  useEffect(() => {
    const today = new Date().toDateString();
    const storedDate = localStorage.getItem('lastClickDate');

    if (storedDate !== today) {
      localStorage.setItem('lastClickDate', today);
      localStorage.setItem('clickCoins', '0');
      setClickCoins(0);
      setDailyLimit(100);
    } else {
      const storedClickCoins = parseInt(localStorage.getItem('clickCoins')) || 0;
      setClickCoins(storedClickCoins);
      setDailyLimit(100 - storedClickCoins);
    }

    const storedCoins = parseInt(localStorage.getItem('coins')) || 0;
    setCoins(storedCoins);
  }, []);

  const handleClick = () => {
    if (clickCoins < 100) {
      const newClickCoins = clickCoins + 1;
      const newTotalCoins = coins + 1;

      setClickCoins(newClickCoins);
      setCoins(newTotalCoins);
      setDailyLimit(100 - newClickCoins);

      localStorage.setItem('clickCoins', newClickCoins.toString());
      localStorage.setItem('coins', newTotalCoins.toString());

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
      <div className="counter">{clickCoins}/100 монет (лимит на сегодня)</div>
      <div className="helper">
        <p>{getHelperMessage()}</p>
      </div>
      <audio ref={clickSoundRef} src="/coin.mp3" preload="auto" />
    </div>
  );
};

export default Home

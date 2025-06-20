import { useState, useEffect, useRef } from 'react';
import './App.css';

function App() {
  const [coins, setCoins] = useState(0);
  const [dailyLimit, setDailyLimit] = useState(100);
  const [isShaking, setIsShaking] = useState(false);
  const [tasks, setTasks] = useState([]);
  const clickSoundRef = useRef(null);

  // Звания
  const getRank = (coins) => {
    if (coins >= 1000) return '👑 Легенда VPN';
    if (coins >= 500) return '🛡️ Элитный агент';
    if (coins >= 200) return '🔐 Продвинутый агент';
    if (coins >= 50) return '🛰️ Агент-новичок';
    return '💼 Рекрут';
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

    // Установим задания
    setTasks([
      { text: 'Пригласить 1 друга — 50 монет', reward: 50 },
      { text: 'Пригласить 2 друзей — 100 монет', reward: 100 },
      { text: 'Пригласить 3 друзей — 200 монет', reward: 200 },
      { text: 'Пригласить 4 друзей — 300 монет', reward: 300 },
      { text: 'Пригласить 5 друзей — 400 монет', reward: 400 },
      { text: 'Пригласить 6 друзей — 500 монет', reward: 500 },
      { text: 'Пригласить 7 друзей — 600 монет', reward: 600 },
      { text: '📨 Подписаться на Telegram-канал — 100 монет', reward: 100, link: 'https://t.me/OrdoHereticusVPN' },
      { text: 'Подписаться на Instagram — 100 монет', reward: 100, link: 'https://www.instagram.com/internet.bot.001?igsh=MXRhdzRhdmc1aGhybg==' },
      { text: 'Рассказать о нас в соцсетях — 100 монет', reward: 100 },
      { text: 'Оставить комментарий под постом — 50 монет', reward: 50 },
      { text: 'Поставить реакцию на запись — 50 монет', reward: 50 },
      { text: 'Заходить в VPN каждый день — 100 монет', reward: 100 },
    ]);
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
        {dailyLimit > 0 ? 'Кликай, чтобы заработать' : 'Лимит на сегодня исчерпан'}
      </div>

      <h2>🎯 Задания</h2>
      <ul className="tasks">
        {tasks.map((task, index) => (
          <li key={index}>
            {task.link ? (
              <a href={task.link} target="_blank" rel="noopener noreferrer">{task.text}</a>
            ) : (
              task.text
            )}
          </li>
        ))}
      </ul>

      <audio ref={clickSoundRef} src="/click.mp3" preload="auto" />
    </div>
  );
}

export default App;

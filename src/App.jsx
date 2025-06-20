import { useState, useEffect, useRef } from 'react';
import './App.css';

const RANKS = [
  { title: 'Новичок', threshold: 0 },
  { title: 'Агент', threshold: 300 },
  { title: 'Профи', threshold: 600 },
  { title: 'Эксперт', threshold: 1000 },
  { title: 'Легенда VPN', threshold: 1500 }
];

const TASKS_TEMPLATE = [
  { id: 'ref1', title: 'Пригласить 1 друга', reward: 50 },
  { id: 'ref2', title: 'Пригласить 2 друзей', reward: 100 },
  { id: 'ref3', title: 'Пригласить 3 друзей', reward: 200 },
  { id: 'ref4', title: 'Пригласить 4 друзей', reward: 300 },
  { id: 'ref5', title: 'Пригласить 5 друзей', reward: 400 },
  { id: 'ref6', title: 'Пригласить 6 друзей', reward: 500 },
  { id: 'ref7', title: 'Пригласить 7 друзей', reward: 600 },
  { id: 'tg', title: '📨 Подписаться на Telegram-канал', reward: 100, link: 'https://t.me/OrdoHereticusVPN' },
  { id: 'ig', title: 'Подписаться на Instagram', reward: 100, link: 'https://www.instagram.com/internet.bot.001?igsh=MXRhdzRhdmc1aGhybg==' },
  { id: 'share', title: 'Рассказать о нас в соцсетях', reward: 100 },
  { id: 'comment', title: 'Оставить комментарий под постом', reward: 50 },
  { id: 'react', title: 'Поставить реакцию на запись', reward: 50 },
  { id: 'daily', title: 'Заходить в VPN каждый день', reward: 100, repeatable: true }
];

function App() {
  const [coins, setCoins] = useState(0);
  const [dailyLimit, setDailyLimit] = useState(100);
  const [isShaking, setIsShaking] = useState(false);
  const [tasks, setTasks] = useState([]);
  const [canSpin, setCanSpin] = useState(true);
  const [spinResult, setSpinResult] = useState(null);
  const clickSoundRef = useRef(null);

  useEffect(() => {
    const storedCoins = parseInt(localStorage.getItem('coins')) || 0;
    const storedDate = localStorage.getItem('lastClickDate');
    const storedSpinDate = localStorage.getItem('lastSpinDate');
    const today = new Date().toDateString();

    if (storedDate !== today) {
      setCoins(0);
      setDailyLimit(100);
      localStorage.setItem('lastClickDate', today);
      localStorage.setItem('coins', '0');
      resetTasks();
    } else {
      setCoins(storedCoins);
      setDailyLimit(100 - storedCoins);
      const savedTasks = JSON.parse(localStorage.getItem('tasks')) || [];
      setTasks(savedTasks);
    }

    if (storedSpinDate === today) {
      setCanSpin(false);
    } else {
      setCanSpin(true);
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

  const getRank = () => {
    return RANKS.slice().reverse().find(rank => coins >= rank.threshold)?.title || 'Новичок';
  };

  const getHelperMessage = () => {
    if (coins >= 1500) return '🎉 Ты — Легенда VPN! Мир свободы открыт для тебя.';
    if (coins >= 1000) return '🧠 Ты стал Экспертом! Осталось немного до легенды.';
    if (coins >= 600) return '🚀 Отличная работа, Профи! Продолжай в том же духе.';
    if (coins >= 300) return '🕵️ Ты уже Агент! Поделись VPN с друзьями.';
    if (coins > 0) return '🔥 Хорошее начало! Продолжай клики и выполняй задания.';
    return '👋 Я твой помощник! Кликай на робота и зарабатывай монеты.';
  };

  const resetTasks = () => {
    const reset = TASKS_TEMPLATE.map(task => {
      const storedTasks = JSON.parse(localStorage.getItem('tasks')) || [];
      const old = storedTasks.find(t => t.id === task.id);
      return {
        ...task,
        completed: task.repeatable ? false : old?.completed || false
      };
    });
    localStorage.setItem('tasks', JSON.stringify(reset));
    setTasks(reset);
  };

  const completeTask = (taskId) => {
    const updatedTasks = tasks.map(task =>
      task.id === taskId ? { ...task, completed: true } : task
    );
    setTasks(updatedTasks);
    localStorage.setItem('tasks', JSON.stringify(updatedTasks));
    const task = TASKS_TEMPLATE.find(t => t.id === taskId);
    const reward = task?.reward || 0;
    const newCoins = coins + reward;
    setCoins(newCoins);
    localStorage.setItem('coins', newCoins.toString());
  };

  const spinWheel = () => {
    if (!canSpin) return;
    const rewardOptions = [50, 100, 150, 200, 250, 300];
    const reward = rewardOptions[Math.floor(Math.random() * rewardOptions.length)];
    const newCoins = coins + reward;
    setCoins(newCoins);
    localStorage.setItem('coins', newCoins.toString());
    setSpinResult(reward);
    setCanSpin(false);
    localStorage.setItem('lastSpinDate', new Date().toDateString());
  };

  return (
    <div className="app">
      <h1>👾 VPN Empire 🚀</h1>
      <div className="stats">
        <p><strong>Монет:</strong> {coins} $RICH</p>
        <p><strong>Звание:</strong> {getRank()}</p>
        <p><strong>Выполнено заданий:</strong> {tasks.filter(t => t.completed).length} / {tasks.length}</p>
      </div>

      <p>Твое звание: <strong>{getRank()}</strong></p>
      <img
        src="/robot.png"
        alt="Робот"
        className={`robot ${isShaking ? 'shake' : ''}`}
        onClick={handleClick}
      />
      <div className="counter">
        {coins}/100 монет {dailyLimit <= 0 && '(лимит на сегодня)'}
      </div>

      <div className="helper">
        <p>{getHelperMessage()}</p>
      </div>

      <h2>🎯 Задания</h2>
      {tasks.map(task => (
        <div key={task.id} className="task-card">
          <span>{task.title}</span>
          {task.completed ? (
            <span className="done">✅</span>
          ) : (
            <button onClick={() => completeTask(task.id)}>
              {task.link ? (
                <a href={task.link} target="_blank" rel="noreferrer">Выполнить</a>
              ) : 'Выполнить'}
            </button>
          )}
        </div>
      ))}

      <div className="roulette">
        <h2>🎰 Рулетка</h2>
        <button
          className="spin-button"
          onClick={spinWheel}
          disabled={!canSpin}
        >
          {canSpin ? 'Крутить рулетку' : 'Завтра снова можно крутить'}
        </button>
        {spinResult && (
          <div className="spin-result">+{spinResult} монет!</div>
        )}
      </div>

      <audio ref={clickSoundRef} src="/click.mp3" preload="auto" />
    </div>
  );
}

export default App;

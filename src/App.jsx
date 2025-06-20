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
  const clickSoundRef = useRef(null);

  useEffect(() => {
    const storedCoins = parseInt(localStorage.getItem('coins')) || 0;
    const storedDate = localStorage.getItem('lastClickDate');
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

  return (
    <div className="app">
      <h1>👾 VPN Empire 🚀</h1>
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

      <audio ref={clickSoundRef} src="/click.mp3" preload="auto" />
    </div>
  );
}

export default App;

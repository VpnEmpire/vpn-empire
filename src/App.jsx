import { useState, useEffect, useRef } from 'react';
import './App.css';
import Home from './components/Home';
import Tasks from './components/Tasks';
import Roulette from './components/Roulette';
import Top from './components/Top';
import Profile from './components/Profile';
import BottomNav from './components/BottomNav';
import Withdraw from './components/Withdraw'; // ✅ ДОБАВЛЕНО

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
  const [currentTab, setCurrentTab] = useState('home');
  const [coins, setCoins] = useState(0);
  const [tasks, setTasks] = useState([]);
  const [canSpin, setCanSpin] = useState(true);
  const [dailyLimit, setDailyLimit] = useState(100);
  const [isShaking, setIsShaking] = useState(false);
  const [isSpinning, setIsSpinning] = useState(false);
  const [spinResult, setSpinResult] = useState(null);
  const [username, setUsername] = useState(localStorage.getItem('username') || 'Ты');
  const clickSoundRef = useRef(null);

  useEffect(() => {
    const storedCoins = parseInt(localStorage.getItem('coins')) || 0;
    const storedDate = localStorage.getItem('lastClickDate');
    const today = new Date().toDateString();
    const lastSpinDate = localStorage.getItem('lastSpinDate');

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

    if (lastSpinDate === today) setCanSpin(false);
  }, []);

  useEffect(() => {
    localStorage.setItem('coins', coins.toString());
  }, [coins]);

  useEffect(() => {
    localStorage.setItem('username', username);
  }, [username]);

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

  const updateCoins = (newCoins) => {
    setCoins(newCoins);
    localStorage.setItem('coins', newCoins.toString());
  };

  const updateTasks = (newTasks) => {
    setTasks(newTasks);
    localStorage.setItem('tasks', JSON.stringify(newTasks));
  };

  const commonProps = {
    coins,
    setCoins: updateCoins,
    tasks,
    setTasks: updateTasks,
    dailyLimit,
    setDailyLimit,
    isShaking,
    setIsShaking,
    canSpin,
    setCanSpin,
    isSpinning,
    setIsSpinning,
    spinResult,
    setSpinResult,
    clickSoundRef,
    resetTasks,
    RANKS,
    TASKS_TEMPLATE
  };

  const renderTab = () => {
    switch (currentTab) {
      case 'home':
        return <Home {...commonProps} />;
      case 'tasks':
        return <Tasks {...commonProps} />;
      case 'roulette':
        return <Roulette {...commonProps} />;
      case 'top':
        return <Top username={username} />;
      case 'profile':
        return <Profile username={username} setUsername={setUsername} />;
      case 'withdraw':
        return <Withdraw coins={coins} />; // ✅ ДОБАВЛЕНО
      default:
        return <Home {...commonProps} />;
    }
  };

  return (
    <div className="app">
      {renderTab()}
      <BottomNav currentTab={currentTab} setCurrentTab={setCurrentTab} />
      <audio ref={clickSoundRef} src="/click.mp3" preload="auto" />
    </div>
  );
}

export default App;

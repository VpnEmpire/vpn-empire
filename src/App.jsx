// src/App.jsx
import React, { useState, useEffect, useRef } from 'react';
import './App.css';
import BottomNav from './components/BottomNav.jsx';
import TopTab from './components/Top.jsx';
import TasksTab from './components/Tasks.jsx';
  
function App() {
  const [activeTab, setActiveTab] = useState('home');
  const [coins, setCoins] = useState(() => Number(localStorage.getItem('coins')) || 0);
  const [rank, setRank] = useState('');
  const [clicksToday, setClicksToday] = useState(() => Number(localStorage.getItem('clicksToday')) || 0);
  const [hasSubscription, setHasSubscription] = useState(() => localStorage.getItem('hasSubscription') === 'true');
  const [completedTasks, setCompletedTasks] = useState(() => JSON.parse(localStorage.getItem('completedTasks')) || {});
  const [flashes, setFlashes] = useState([]);
  const maxClicksPerDay = 100;
  
  // Звук и логика рулетки
  const spinSoundRef = useRef(null);
  const winSoundRef = useRef(null);
  const [canSpin, setCanSpin] = useState(true);
  const [isSpinning, setIsSpinning] = useState(false);
  const [spinResult, setSpinResult] = useState(null);
  
  useEffect(() => {
    localStorage.setItem('coins', coins);
    localStorage.setItem('clicksToday', clicksToday);
    localStorage.setItem('completedTasks', JSON.stringify(completedTasks));
  }, [coins, clicksToday, completedTasks]);
  
  useEffect(() => {
    const lastSpinDate = localStorage.getItem('lastSpinDate');
    const today = new Date().toDateString();
    if (lastSpinDate === today) setCanSpin(false);
  }, []);
  
useEffect(() => {
    const today = new Date().toDateString();
    if (localStorage.getItem('lastClickDate') !== today) {
      setClicksToday(0);
      localStorage.setItem('lastClickDate', today);
    }
    if (localStorage.getItem('dailyTaskDate') !== today) {
      setCompletedTasks({});
      localStorage.setItem('dailyTaskDate', today);
    }
    if (localStorage.getItem('lastSpinDate') === today) {
      setCanSpin(false);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('clicksToday', clicksToday);
  }, [clicksToday]);
  
const updateRank = (totalCoins) => {
    if (totalCoins >= 5000) setRank('Легенда VPN');
    else if (totalCoins >= 2000) setRank('Эксперт');
    else if (totalCoins >= 1000) setRank('Профи');
    else if (totalCoins >= 500) setRank('Агент');
    else setRank('Новичок');
  };
  
  const handleClick = () => {
    if (clicksToday < maxClicksPerDay) {
      setCoins(prev => prev + 1);
      setClicksToday(prev => prev + 1);
      triggerAnimation();
      playClickSound();
    }
  };
  
const flash = { x: e.clientX, y: e.clientY, id: Date.now() };
    setFlashes(prev => [...prev, flash]);
    setTimeout(() => {
      setFlashes(prev => prev.filter(f => f.id !== flash.id));
    }, 400);

    const audio = new Audio('/click.mp3');
    audio.play();
  };


  const triggerAnimation = () => {
    const flash = document.createElement('div');
    flash.className = 'flash';
    document.body.appendChild(flash);
    setTimeout(() => document.body.removeChild(flash), 300);
  };

  const playClickSound = () => {
    const audio = new Audio('/click.mp3');
    audio.play();
  };
  
 const handleComplete = (key, reward) => {
    if (completedTasks[key]) return;
    const updated = { ...completedTasks, [key]: true };
    setCoins(prev => prev + reward);
    setCompletedTasks(updated);
  };

  const spinWheel = () => {
    if (!canSpin) return;
    if (spinSoundRef.current) spinSoundRef.current.play();

    const options = [20, 50, 100, 200, 300, 400];
    const result = options[Math.floor(Math.random() * options.length)];

    setTimeout(() => {
      setCoins(prev => prev + result);
      setSpinResult(result);
      setCanSpin(false);
      localStorage.setItem('lastSpinDate', new Date().toDateString());
      if (winSoundRef.current) winSoundRef.current.play();
    }, 2000);
  };

  const handleSubscriptionConfirm = () => {
    setHasSubscription(true);
    localStorage.setItem('hasSubscription', 'true');
  };

  const renderSubscriptionPrompt = () => (
    <div className="subscription-block">
      <h2>🔒 Доступ ограничен</h2>
      <p>Чтобы играть, необходимо оплатить подписку от 100₽ в Telegram-боте:</p>
      <a className="tg-link" href="https://t.me/OrdoHereticusVPN" target="_blank" rel="noopener noreferrer">
        Перейти в бот
      </a>
      <button className="confirm-btn" onClick={handleSubscriptionConfirm}>
        ✅ Я оплатил
      </button>
    </div>
  );

  const renderHome = () => (
    <div className="main-content">
      <div className="heander-box">
        <div className="coins">💰 Монет: {coins} $RICH</div>
        <div className="rank">🎖 Звание: {rank}</div>
      </div>
  <div className="robot-container">
      <img src="/robot.png" alt="robot" className="robot" onClick={handleClick} />
      <div className="clicks-left">💥 {clicksToday}/{maxClicksPerDay} монет</div>
    </div>
    <div className="helper-box">
      🤖 <strong>Я твой помощник!</strong><br />
      Кликай на робота и зарабатывай монеты.
    </div>
 {flashes.map(f => (
        <div key={f.id} className="flash" style={{ left: f.x, top: f.y }} />
      ))}
    </div>
  );
  
 const renderTasks = () => {
    const tasks = [
      { key: 'invite1', label: 'Пригласи 1 друга', reward: 50 },
      { key: 'invite2', label: 'Пригласи 2 друзей', reward: 100 },
      { key: 'invite3', label: 'Пригласи 3 друзей', reward: 200 },
      { key: 'invite4', label: 'Пригласи 4 друзей', reward: 300 },
      { key: 'invite5', label: 'Пригласи 5 друзей', reward: 400 },
      { key: 'invite6', label: 'Пригласи 6 друзей', reward: 500 },
      { key: 'invite7', label: 'Пригласи 7 друзей', reward: 600 },
      { key: 'subscribeTelegram', label: '📨 Подписаться на Telegram', reward: 100, link: 'https://t.me/OrdoHereticusVPN' },
      { key: 'subscribeInstagram', label: '📸 Подписаться на Instagram', reward: 100, link: 'https://www.instagram.com/internet.bot.001?igsh=MXRhdzRhdmc1aGhybg==' },
      { key: 'shareSocial', label: '📢 Расскажи о нас в соцсетях', reward: 100 },
      { key: 'commentPost', label: '💬 Оставить комментарий', reward: 50 },
      { key: 'reactPost', label: '❤️ Поставить реакцию', reward: 50 },
      { key: 'dailyVpn', label: '🛡 Заходить в VPN каждый день', reward: 100 }
    ];

    return (
      <div className="tasks-tab">
        <h2>📋 Задания</h2>
        {tasks.map(task => (
          <div key={task.key} className="task-card">
            <span>
              {task.link ? (
                <a href={task.link} target="_blank" rel="noopener noreferrer">{task.label}</a>
              ) : (
                task.label
              )} — 🪙 {task.reward} монет
            </span>
            {completedTasks[task.key] ? (
              <span className="done">✅</span>
            ) : (
              <button onClick={() => handleComplete(task.key, task.reward)}>Выполнить</button>
            )}
          </div>
        ))}
      </div>
    );
  };

   const renderRoulette = () => (
    <div className="roulette-tab">
      <h2>🎰 Рулетка</h2>
      <img src="/roulette.gif" alt="Рулетка" className="roulette-image" style={{ width: '200px', marginBottom: '20px' }} />
      <button className="spin-button" onClick={spinWheel} disabled={!canSpin}>
        Крутить
      </button>
      {spinResult !== '' && <div className="spin-result">+{spinResult} монет!</div>}
      <audio ref={spinSoundRef} src="/spin-sound.mp3" preload="auto" />
      <audio ref={winSoundRef} src="/coins_many.mp3" preload="auto" />
    </div>
  );

  const renderTop = () => (
    <TopTab coins={coins} />
  );

  const renderWithdraw = () => (
    <div className="withdraw-tab">
      <h2>💸 Вывод</h2>
      <p>Минимум для вывода: 1000 монет</p>
      <button
        disabled={coins < 1000}
        className={coins < 1000 ? 'withdraw-button disabled' : 'withdraw-button'}
        onClick={() => {
          if (coins >= 1000) {
            window.open('https://t.me/OrdoHereticusVPN', '_blank');
          }
        }}
      >
        {coins < 1000 ? 'Недостаточно монет' : 'Вывести через Telegram'}
      </button>
    </div>
  );

  const renderTab = () => {
    switch (activeTab) {
      case "home":
        return renderHome();
      case "tasks":
        return renderTasks();
      case "roulette":
        return renderRoulette();
      case "top":
        return renderTop();
      case "withdraw":
        return renderWithdraw();
      default:
        return renderHome();
    }
  };

  return (
    <div className="App">
      {renderTab()}
      <BottomNav activeTab={activeTab} setActiveTab={setActiveTab} />
    </div>
    );
export default App;

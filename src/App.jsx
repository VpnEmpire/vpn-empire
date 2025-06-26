// src/App.jsx
import React, { useState, useEffect, useRef } from 'react';
import './App.css';
import BottomNav from './components/BottomNav.jsx';
import TopTab from './components/Top.jsx';
import TasksTab from './components/Tasks.jsx';
import Roulette from './components/Roulette.jsx';
import Hometab from './components/Home.jsx';

function App() {
  const [activeTab, setActiveTab] = useState('home');
  const [coins, setCoins] = useState(() => Number(localStorage.getItem('coins')) || 0);
  const [rank, setRank] = useState('');
  const [clicksToday, setClicksToday] = useState(() => Number(localStorage.getItem('clicksToday')) || 0);
  const [hasSubscription, setHasSubscription] = useState(() => localStorage.getItem('hasSubscription') === 'true');
  const [completedTasks, setCompletedTasks] = useState(() => JSON.parse(localStorage.getItem('completedTasks')) || {});
  const [flashes, setFlashes] = useState([]);
  const [userId, setUserId] = useState(null);
  const [isWithdrawApproved, setIsWithdrawApproved] = useState(() =>
    localStorage.getItem('isWithdrawApproved') === 'true'
  );

  const maxClicksPerDay = 100;
  const spinSoundRef = useRef(null);
  const winSoundRef = useRef(null);
  const [canSpin, setCanSpin] = useState(true);
  const [isSpinning, setIsSpinning] = useState(false);
  const [spinResult, setSpinResult] = useState(null);

  const handleApproveWithdraw = () => {
    setIsWithdrawApproved(true);
    localStorage.setItem('isWithdrawApproved', 'true');
  };

  useEffect(() => {
    localStorage.setItem('coins', coins);
    localStorage.setItem('clicksToday', clicksToday);
    localStorage.setItem('completedTasks', JSON.stringify(completedTasks));
  }, [coins, clicksToday, completedTasks]);

  useEffect(() => {
    updateRank(coins);
  }, [coins]);

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
    if (window?.Telegram?.WebApp?.initDataUnsafe?.user?.id) {
      setUserId(window.Telegram.WebApp.initDataUnsafe.user.id);
    }
  }, []);

  const updateRank = (totalCoins) => {
    if (totalCoins >= 5000) setRank('Легенда VPN');
    else if (totalCoins >= 2000) setRank('Эксперт');
    else if (totalCoins >= 1000) setRank('Профи');
    else if (totalCoins >= 500) setRank('Агент');
    else setRank('Новичок');
  };
  
const playClickSound = () => {
  const audio = new Audio('/click.mp3');
  audio.play().catch((e) => console.log('Ошибка воспроизведения звука:', e));
};

  const handleClick = (e) => {
  if (clicksToday < maxClicksPerDay) {
    const multiplier = Number(localStorage.getItem('clickMultiplier')) || 1;
    setCoins(prev => prev + 1 * multiplier);
    setClicksToday(prev => prev + 1);
    triggerAnimation();
    playClickSound();

    const flash = { x: e.clientX, y: e.clientY, id: Date.now() };
    setFlashes(prev => [...prev, flash]);
    setTimeout(() => {
      setFlashes(prev => prev.filter(f => f.id !== flash.id));
    }, 400);
  }
};

  const triggerAnimation = () => {
    const flash = document.createElement('div');
    flash.className = 'flash';
    document.body.appendChild(flash);
    setTimeout(() => document.body.removeChild(flash), 300);
  };

  const handleComplete = async (key, reward, options = {}) => {
    if (completedTasks[key]) return;

    if (!userId) {
      alert("Ошибка: не удалось получить user_id из Telegram.");
      return;
    }

    if (options.requiresReferralCount !== undefined) {
      const res = await fetch(`/api/check-referrals?user_id=${userId}`);
      const data = await res.json();
      if (!data || data.referrals < options.requiresReferralCount) {
        alert(`Пригласи как минимум ${options.requiresReferralCount} друзей для выполнения этого задания`);
        return;
      }
    }

    if (options.requiresSubscription) {
      const res = await fetch(`/api/check-subscription?user_id=${userId}`);
      const data = await res.json();
      if (!data.subscribed) {
        alert("Подпишись на канал, чтобы выполнить задание");
        return;
      }
    }

    if (options.requiresPayment) {
      const res = await fetch(`/api/check-payment?user_id=${userId}`);
      const data = await res.json();
      if (!data.success) {
        alert("Сначала активируй VPN через Telegram-бота");
        return;
      }
      localStorage.setItem('clickBoost', 'true');
    }

    const updated = { ...completedTasks, [key]: true };
    setCoins(prev => prev + reward);
    setCompletedTasks(updated);
  };

  const renderTasks = () => {
    const tasks = [
      { key: 'invite1', label: 'Пригласи 1 друга', reward: 50, requiresReferralCount: 1 },
      { key: 'invite2', label: 'Пригласи 2 друзей', reward: 100, requiresReferralCount: 2 },
      { key: 'invite3', label: 'Пригласи 3 друзей', reward: 200, requiresReferralCount: 3 },
      { key: 'invite4', label: 'Пригласи 4 друзей', reward: 300, requiresReferralCount: 4 },
      { key: 'invite5', label: 'Пригласи 5 друзей', reward: 400, requiresReferralCount: 5 },
      { key: 'invite6', label: 'Пригласи 6 друзей', reward: 500, requiresReferralCount: 6 },
      { key: 'invite7', label: 'Пригласи 7 друзей', reward: 600, requiresReferralCount: 7 },
      { key: 'subscribeTelegram', label: '📨 Подписаться на Telegram', reward: 100, link: 'https://t.me/OrdoHereticusVPN', requiresSubscription: true },
      { key: 'subscribeInstagram', label: '📸 Подписаться на Instagram', reward: 100, link: 'https://www.instagram.com/internet.bot.001?igsh=MXRhdzRhdmc1aGhybg==' },
      { key: 'shareSocial', label: '📢 Расскажи о нас в соцсетях', reward: 100 },
      { key: 'commentPost', label: '💬 Оставить комментарий', reward: 50 },
      { key: 'reactPost', label: '❤️ Поставить реакцию', reward: 50 },
      { key: 'dailyVpn', label: '🛡 Заходить в VPN каждый день', reward: 100 },
      { key: 'activateVpn', label: '🚀 Активируй VPN', reward: 1000, link: 'https://t.me/OrdoHereticusVPN', requiresPayment: true }
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
              )} — 🪙 {task.reward} монет {task.requiresPayment && ' + x2 кликов'}
            </span>
            {completedTasks[task.key] ? (
              <span className="done">✅</span>
            ) : (
              <button
                onClick={() =>
                  handleComplete(task.key, task.reward, {
                    requiresSubscription: task.requiresSubscription,
                    requiresReferralCount: task.requiresReferralCount,
                    requiresPayment: task.requiresPayment
                  })
                }
              >
                Выполнить
              </button>
            )}
          </div>
        ))}
        <div className="task-card disabled-task">
          <span>🔒 <strong>Скоро новое задание</strong> — 🔜 Ожидай обновлений</span>
        </div>
      </div>
    );
  };

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

    const renderRoulette = () => (
  <div className="roulette-container">
    <h2>🎯 Рулетка</h2>
    <img src="/wheel.png" className={`wheel ${isSpinning ? 'spinning' : ''}`} onClick={spin} />
    <div className="logo-center">VPN Empire</div>
    {prize && <p className="result">Вы выиграли: {prize} монет</p>}
    {!canSpin && <p className="cooldown">Вы уже крутили сегодня. Попробуйте завтра</p>}
  </div>
);

  const renderTop = () => (
    <TopTab coins={coins} />
  );

  const renderWithdraw = () => (
    <div className="withdraw-tab">
      <h2>💸 Вывод</h2>
      <p>Минимум для вывода: 10000 монет</p>
      <button
        disabled={!isWithdrawApproved}
        className={isWithdrawApproved ? 'withdraw-button' : 'withdraw-button disabled'}
        onClick={() => {
          if (isWithdrawApproved) {
            window.open('https://www.instagram.com/internet.bot.001?igsh=MXRhdzRhdmc1aGhybg==', '_blank');
          }
        }}
      >
        {isWithdrawApproved ? 'Вывести через Instagram' : 'Ожидает одобрения'}
      </button>
      <button
        className="approve-button"
        onClick={handleApproveWithdraw}
        style={{ marginTop: '20px', backgroundColor: 'green', color: 'white' }}
      >
        ✅ Одобрить вывод (видишь только ты)
      </button>
    </div>
  );

  const spinWheel = () => {
  if (!canSpin) return;

  setIsSpinning(true);

  const options = [50, 100, 200, 300, 400, 500, 600, 700];
  const result = options[Math.floor(Math.random() * options.length)];

  if (wheelRef.current) {
    wheelRef.current.style.transition = 'transform 4s ease-out';
    const angle = 360 * 5 + Math.floor(Math.random() * 360);
    wheelRef.current.style.transform = `rotate(${angle}deg)`;
  }

  setTimeout(() => {
    setIsSpinning(false);
    setSpinResult(result);
    setCoins((prev) => prev + result);
    setCanSpin(false);
    localStorage.setItem('lastSpinDate', new Date().toDateString());
    if (winSoundRef.current) winSoundRef.current.play();
  }, 4000);
};

  const renderTab = () => {
    switch (activeTab) {
      case 'home': return renderHome();
      case 'tasks': return renderTasks();
      case 'roulette': return renderRoulette();
      case 'top': return renderTop();
      case 'withdraw': return renderWithdraw();
      default: return renderHome();
    }
  };

  return (
    <div className="App">
      {renderTab()}
      <BottomNav activeTab={activeTab} setActiveTab={setActiveTab} />
    </div>
  );
}

export default App;

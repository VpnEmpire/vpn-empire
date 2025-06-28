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
  const initTelegram = () => {
    try {
      const tg = window.Telegram?.WebApp;
      if (!tg || !tg.initDataUnsafe) {
        console.warn('Telegram WebApp API не доступен.');
        return;
      }

      tg.ready(); // Telegram WebApp готов

      const user = tg.initDataUnsafe.user;
      const ref = tg.initDataUnsafe.start_param;

      if (user?.id) {
        setUserId(user.id);
        localStorage.setItem('user_id', user.id);
        console.log('user_id:', user.id);

        if (ref) {
          localStorage.setItem('referrer_id', ref);
          console.log('referrer_id:', ref);
        }
      } else {
        console.warn('user.id не получен');
      }

    } catch (error) {
      console.error('Ошибка инициализации Telegram:', error);
    }
  };

  // Ждём загрузки документа
  if (document.readyState === 'complete' || document.readyState === 'interactive') {
    initTelegram();
  } else {
    window.addEventListener('DOMContentLoaded', initTelegram);
  }

  return () => window.removeEventListener('DOMContentLoaded', initTelegram);
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
  const [tasks, setTasks] = useState(() => {
    const saved = localStorage.getItem('tasks');
    return saved ? JSON.parse(saved) : [
      { key: 'ref1', title: '👤 Пригласи 1 друга', reward: 50, requires: 1, type: 'referral' },
      { key: 'ref2', title: '👥 Пригласи 2 друзей', reward: 100, requires: 2, type: 'referral' },
      { key: 'ref3', title: '👥 Пригласи 3 друзей', reward: 200, requires: 3, type: 'referral' },
      { key: 'ref4', title: '👥 Пригласи 4 друзей', reward: 300, requires: 4, type: 'referral' },
      { key: 'ref5', title: '👥 Пригласи 5 друзей', reward: 400, requires: 5, type: 'referral' },
      { key: 'ref6', title: '👥 Пригласи 6 друзей', reward: 500, requires: 6, type: 'referral' },
      { key: 'ref7', title: '👥 Пригласи 7 друзей', reward: 600, requires: 7, type: 'referral' },
      { key: 'subtg', title: '📨 Подписаться на Telegram', reward: 100, type: 'subscription', link: 'https://t.me/OrdoHereticusVPN' },
      { key: 'subinsta', title: '📸 Подписаться на Instagram', reward: 100, type: 'link', link: 'https://www.instagram.com/internet.bot.001?igsh=MXRhdzRhdmc1aGhybg==' },
      { key: 'socialshare', title: '📢 Расскажи о нас в соцсетях', reward: 100, type: 'info' },
      { key: 'comment', title: '💬 Комментировать пост', reward: 100, type: 'info' },
      { key: 'reaction', title: '❤️ Поставить реакцию', reward: 100, type: 'info' },
      { key: 'dailyvpn', title: '🛡 Зайти в VPN сегодня', reward: 100, type: 'daily' },
      { key: 'activatevpn', title: '🚀 Активировать VPN', reward: 1000, type: 'payment', link: 'https://t.me/OrdoHereticusVPN' },
    ].map(task => ({ ...task, done: false }));
  });

  const [referrals, setReferrals] = useState(0);
  const [userId, setUserId] = useState(localStorage.getItem('user_id') || null);
  const [subscribed, setSubscribed] = useState(false);
  const [vpnActivated, setVpnActivated] = useState(false);

  useEffect(() => {
    const tgId = window?.Telegram?.WebApp?.initDataUnsafe?.user?.id;
    if (tgId) {
      setUserId(tgId);
      fetch(`/api/check-referrals?user_id=${tgId}`).then(res => res.json()).then(data => setReferrals(data.referrals || 0));
      fetch(`/api/check-subscription?user_id=${tgId}`).then(res => res.json()).then(data => setSubscribed(data.subscribed));
      fetch(`/api/check-payment?user_id=${tgId}`).then(res => res.json()).then(data => setVpnActivated(data.success));
    }
  }, []);

  const completeTask = (task) => {
    if (task.done) return;
    if (task.type === 'referral' && referrals < task.requires) {
      alert(`Пригласи ${task.requires} друзей`);
      return;
    }
    if (task.type === 'subscription' && !subscribed) {
      alert('Подпишись на канал');
      return;
    }
    if (task.type === 'payment' && !vpnActivated) {
      alert('Активируй VPN через Telegram-бота');
      return;
    }

    const updated = tasks.map(t => t.key === task.key ? { ...t, done: true } : t);
    setTasks(updated);
    localStorage.setItem('tasks', JSON.stringify(updated));
    setCoins(prev => prev + task.reward);
  };

  const handleClick = (task) => {
    if (task.type === 'referral') {
      const link = `https://t.me/OrdoHereticus_bot/vpnempire?startapp=${userId}`;
      navigator.clipboard.writeText(link);
      alert(`Ссылка скопирована:\n${link}`);
    } else if (task.link) {
      window.open(task.link, '_blank');
    }
  };
   
  return (
    <div className="tasks-tab">
      <h2>📋 Задания</h2>
      {tasks.map(task => (
        <div
          key={task.key}
          className={`task-card ${task.done ? 'completed' : ''}`}
          onClick={() => handleClick(task)}
        >
          <span>
            {task.title}
            {task.type === 'referral' && (
              <span style={{ fontSize: '14px', color: '#888' }}>
                {Math.min(referrals, task.requires)}/{task.requires}
              </span>
            )}
          </span>
          {task.done ? (
            <span className="done">✅</span>
          ) : (
            <button onClick={(e) => { e.stopPropagation(); completeTask(task); }}>
              🎁 Получить {task.reward} монет
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

    const renderRoulette = () => {
 return <Roulette setCoins={setCoins} />;
};
  
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

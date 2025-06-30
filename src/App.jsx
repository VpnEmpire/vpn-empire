import React, { useState, useEffect, useRef } from 'react';
import './App.css';
import BottomNav from './components/BottomNav.jsx';
import TopTab from './components/Top.jsx';
import Roulette from './components/Roulette.jsx';
import Hometab from './components/Home.jsx';

function App() {
  const [activeTab, setActiveTab] = useState('home');
  const [coins, setCoins] = useState(() => Number(localStorage.getItem('coins')) || 0);
  const [rank, setRank] = useState('');
  const [clicksToday, setClicksToday] = useState(() => Number(localStorage.getItem('clicksToday')) || 0);
  const [hasSubscription, setHasSubscription] = useState(() => localStorage.getItem('hasSubscription') === 'true');
  const [completedTasks, setCompletedTasks] = useState(() => 
JSON.parse(localStorage.getItem('completedTasks')) || {});
  const [flashes, setFlashes] = useState([]);
  const [userId, setUserId] = useState(null);
  const [referrals, setReferrals] = useState(0);
  const [vpnActivated, setVpnActivated] = useState(false);
  const [subscribed, setSubscribed] = useState(false);
  const [isWithdrawApproved, setIsWithdrawApproved] = useState(() => localStorage.getItem('isWithdrawApproved') === 'true');
  const [tasks, setTasks] = useState([
    { key: 'invite1', label: 'Пригласи 1 друга', reward: 50, type: 'referral', requiresReferralCount: 1 },
    { key: 'invite2', label: 'Пригласи 2 друзей', reward: 100, type: 'referral', requiresReferralCount: 2 },
    { key: 'invite3', label: 'Пригласи 3 друзей', reward: 200, type: 'referral', requiresReferralCount: 3 },
    { key: 'invite4', label: 'Пригласи 4 друзей', reward: 300, type: 'referral', requiresReferralCount: 4 },
    { key: 'invite5', label: 'Пригласи 5 друзей', reward: 400, type: 'referral', requiresReferralCount: 5 },
    { key: 'invite6', label: 'Пригласи 6 друзей', reward: 500, type: 'referral', requiresReferralCount: 6 },
    { key: 'invite7', label: 'Пригласи 7 друзей', reward: 600, type: 'referral', requiresReferralCount: 7 },
    { key: 'subscribeTelegram', label: '📨 Подписаться на Telegram', reward: 100, type: 'subscribe', link: 'https://t.me/OrdoHereticusVPN', requiresSubscription: true },
    { key: 'subscribeInstagram', label: '📸 Подписаться на Instagram', reward: 100, type: 'subscribe', link: 
'https://www.instagram.com/internet.bot.001?igsh=MXRhdzRhdmc1aGhybg==' },
    { key: 'shareSocial', label: '📢 Расскажи о нас в соцсетях', reward: 100 },
    { key: 'commentPost', label: '💬 Оставить комментарий', reward: 50 },
    { key: 'reactPost', label: '❤️ Поставить реакцию', reward: 50 },
    { key: 'dailyVpn', label: '🛡 Заходить в VPN каждый день', reward: 100 },
    { key: 'activateVpn', label: '🚀 Активируй VPN', reward: 1000, type: 'vpn', link: 'https://t.me/OrdoHereticus_bot', requiresPayment: true }
  ]);

  const maxClicksPerDay = 100;
  const spinSoundRef = useRef(null);
  const winSoundRef = useRef(null);
  const [canSpin, setCanSpin] = useState(true);
  const [spinResult, setSpinResult] = useState(null);
  useEffect(() => {
    const tgUserId = window?.Telegram?.WebApp?.initDataUnsafe?.user?.id;
    if (tgUserId) {
      setUserId(tgUserId);
      fetch(`/api/check-referrals?user_id=${tgUserId}`)
        .then(res => res.json())
        .then(data => setReferrals(data.referrals || 0));

      fetch(`/api/check-subscription?user_id=${tgUserId}`)
        .then(res => res.json())
        .then(data => setSubscribed(data.subscribed));

      fetch(`/api/check-payment?user_id=${tgUserId}`)
        .then(res => res.json())
        .then(data => setVpnActivated(data.success));
    }
  }, []);
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
      const updatedTasks = tasks.map(task =>
        task.key === 'dailyVPN' ? { ...task, done: false } : task
      );
      setTasks(updatedTasks);
      localStorage.setItem('tasks', JSON.stringify(updatedTasks));
      localStorage.setItem('dailyTaskDate', today);
    }
    if (localStorage.getItem('lastSpinDate') === today) {
      setCanSpin(false);
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
    }
    const flash = { x: e.clientX, y: e.clientY, id: Date.now() };
    setFlashes(prev => [...prev, flash]);
setTimeout(() => {
      setFlashes(prev => prev.filter(f => f.id !== flash.id));
    }, 400);
  };

  const triggerAnimation = () => {
    const flash = document.createElement('div');
    flash.className = 'flash'; 
    flash.style.left = `${Math.random() * window.innerWidth}px`;
    flash.style.top = `${Math.random() * window.innerHeight}px`;
    document.body.appendChild(flash);
    setTimeout(() => {
      document.body.removeChild(flash);
    }, 300);
  };

  const completeTask = (task) => {
   const updated = tasks.map(t =>
      t.key === task.key ? { ...t, done: true } : t
    );

    setTasks(updated);
    localStorage.setItem('tasks', JSON.stringify(updated));

    const updatedCompleted = { ...completedTasks, [task.key]: true };
    setCompletedTasks(updatedCompleted);
    localStorage.setItem('completedTasks', JSON.stringify(updatedCompleted));
    
    if (task.key === 'activateVpn') {
      setVpnActivated(true);
      localStorage.setItem('vpnActivated', 'true');
      localStorage.setItem('clickMultiplier', '2');
    }

    setCoins(prev => {
      const newCoins = prev + task.reward;
      localStorage.setItem('coins', newCoins);
      return newCoins;
    });
  };

const handleTaskClick = (task) => {
  if (completedTasks[task.key]) return;

  console.log('Нажали на задание:', task);
    // Показываем реферальную ссылку для всех заданий с type 'referral'
  if (task.type === 'referral') {
    const link = `https://t.me/OrdoHereticus_bot/vpnempire?startapp=${userId}`;
    navigator.clipboard.writeText(link);
    alert(`Твоя реферальная ссылка скопирована:\n${link}`);
  }
  
// Открываем ссылку, если она есть
  if (task.link) {
    try {
      if (window?.Telegram?.WebApp?.openTelegramLink) {
        window.Telegram.WebApp.openTelegramLink(task.link);
        console.log('Ссылка открыта через openTelegramLink:', task.link);
      } else {
        window.open(task.link, '_blank');
        console.log('Ссылка открыта через window.open:', task.link);
      }
    } catch (error) {
      console.error('Ошибка при открытии ссылки:', error);
      alert('Не удалось открыть ссылку. Попробуй позже.');
    }
  }
 // === 1. Проверка рефералов
  if (task.type === 'referral' && task.requiresReferralCount) {
    fetch(`/api/check-referrals?user_id=${userId}`)
      .then(res => res.json())
      .then(data => {
        const count = data.referrals || 0;
        setReferrals(count);
        if (count >= task.requiresReferralCount) {
          completeTask(task);
        } else {
          alert(`Пригласи хотя бы ${task.requiresReferralCount} друзей`);
        }
      })
      .catch(err => {
        console.error('Ошибка проверки рефералов:', err);
        alert('Ошибка при проверке приглашённых друзей. Попробуйте позже.');
      });
    return;
  }

  // === 2. Проверка подписки
  if (task.requiresSubscription) {
    fetch(`/api/check-subscription?user_id=${userId}`)
      .then(res => res.json())
      .then(data => {
        setSubscribed(data.subscribed);
        if (data.subscribed) {
          completeTask(task);
        } else {
          alert('Подпишись на Telegram-канал');
        }
      })
      .catch(err => {
        console.error('Ошибка проверки подписки:', err);
        alert('Ошибка при проверке подписки. Попробуйте позже.');
      });
    return;
  }

  // === 3. Проверка оплаты
  if (task.requiresPayment) {
    fetch(`/api/check-payment?user_id=${userId}`)
      .then(res => res.json())
      .then(data => {
        setVpnActivated(data.success);
        if (data.success) {
          completeTask(task);
        } else {
          alert('Активируй VPN через Telegram-бота');
        }
      })
      .catch(err => {
        console.error('Ошибка проверки оплаты:', err);
        alert('Ошибка при проверке оплаты. Попробуйте позже.');
      });
    return;
  }

   // Задания без условий — сразу засчитываем и монеты начисляем
  if (
    !task.requiresSubscription &&
    !task.requiresPayment &&
    !(task.type === 'referral' && task.requiresReferralCount)
  ) {
    completeTask(task);
  }
};
 
  const renderTasks = () => (
    <div className="tasks-tab">
      <h2>📋 Задания</h2>
      {tasks.map(task => (
        <div
          key={task.key}
          className={`task-card ${task.done ? 'completed' : ''}`}
          onClick={() => handleTaskClick(task)}
        >
          <h3>{task.label}</h3>
          {task.requiresReferralCount && (
            <p>👥 {Math.min(referrals, task.requiresReferralCount)}/{task.requiresReferralCount} друзей</p>
          )}
          <p>🪙 Награда: {task.reward} монет</p>
          {task.done ? (
            <span className="done">✅ Выполнено</span>
          ) : (
            <button onClick={(e) => { e.stopPropagation(); completeTask(task); }}>Выполнить</button>
          )}
        </div>
      ))}
      <div className="task-card disabled-task">
        <span>🔒 <strong>Скоро новое задание</strong> — 🔜 Ожидай обновлений</span>
      </div>
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

  const renderTop = () => <TopTab coins={coins} />;
  const renderRoulette = () => <Roulette setCoins={setCoins} />;
const renderWithdraw = () => (
    <div className="withdraw-tab">
      <h2>💸 Вывод</h2>
      <p>Минимум для вывода: 10000 монет</p>
      <button
        disabled={!isWithdrawApproved}
        className={isWithdrawApproved ? 'withdraw-button' : 'withdraw-button disabled'}
        onClick={() => {
          if (isWithdrawApproved) {
            window.open('https://www.instagram.com/internet.bot.001', '_blank');
          }
        }}
      >
        {isWithdrawApproved ? 'Вывести через Instagram' : 'Ожидает одобрения'}
      </button>
      <button
        className="approve-button"
        onClick={() => {
          setIsWithdrawApproved(true);
          localStorage.setItem('isWithdrawApproved', 'true');
        }}
        style={{ marginTop: '20px', backgroundColor: 'green', color: 'white' }}
      >
        ✅ Одобрить вывод
      </button>
    </div>
  );

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

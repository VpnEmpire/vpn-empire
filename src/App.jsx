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
  const [clickMultiplier, setClickMultiplier] = useState (1);
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
  
  const checkVpnPayment = async () => {
  try {
    const response = await fetch('https://vpnempire.vercel.app/api/checkUserPayment', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ user_id: userId }),
    });

    const result = await response.json();

    if (result.success) {
      alert('Оплата подтверждена. Награда выдана!');
      // здесь обнови localStorage или состояние completedTasks
      const updated = { ...completedTasks, vpnPayment: true };
      setCompletedTasks(updated);
      localStorage.setItem('completedTasks', JSON.stringify(updated));
      setCoins(coins + 1000);
    } else {
      alert('Оплата не найдена. Убедись, что оплатил в Telegram-боте.');
    }
  } catch (err) {
    console.error(err);
    alert('Ошибка при проверке оплаты.');
  }
};

  const handlePaymentCheck = async (taskKey) => {
  try {
    const response = await fetch('https://vpnempire.vercel.app/api/checkUserPayment', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ user_id: userId }),
    });

    const result = await response.json();

    if (result.success) {
      const updated = { ...completedTasks, [taskKey]: true };
      setCompletedTasks(updated);
      localStorage.setItem('completedTasks', JSON.stringify(updated));
      setCoins(coins + 1000);
      alert('Оплата подтверждена! Награда выдана.');
    } else {
      alert('Оплата не найдена. Убедись, что оплатил VPN в Telegram-боте.');
    }
  } catch (error) {
    console.error('Ошибка при проверке оплаты:', error);
    alert('Ошибка при проверке. Попробуй позже.');
  }
};
  
  const completeTask = (task) => {
  if (completedTasks[task.key]) return;

  setCompletedTasks(prev => {
    const updated = { ...prev, [task.key]: true };
    localStorage.setItem('completedTasks', JSON.stringify(updated));
    return updated;
  });

  setCoins(prev => {
    const newCoins = prev + (task.reward || 0);
    localStorage.setItem('coins', newCoins);
    return newCoins;
  });

  if (task.type === 'vpn') {
    setClickMultiplier(2);
  }

  alert(`🎁 Ты получил ${task.reward || 0} монет!`);
};
 
const handleTaskClick = async (task) => {
  if (completedTasks[task.key]) return;

  // 1. Реферальные задания
  if (task.type === 'referral' && task.requiresReferralCount) {
    const referralLink = `https://t.me/OrdoHereticus_bot/vpnempire?startapp=${userId}`;
    try {
      if (window.Telegram?.WebApp?.clipboard?.writeText) {
        await window.Telegram.WebApp.clipboard.writeText(referralLink);
      } else {
        await navigator.clipboard.writeText(referralLink);
      }
      alert(`🔗 Реферальная ссылка скопирована:\n${referralLink}`);
    } catch {
      alert(`Скопируй вручную:\n${referralLink}`);
    }

    try {
      const res = await fetch(`/api/check-referrals?user_id=${userId}`);
      const data = await res.json();
      const count = data.referrals || 0;
      setReferrals(count);

      if (count >= task.requiresReferralCount) {
        completeTask(task);
      } else {
        alert(`Приглашено ${count}/${task.requiresReferralCount} друзей`);
      }
    } catch (err) {
      alert('Ошибка при проверке приглашений.');
      console.error(err);
    }
    return;
  }

  // 2. Оплата VPN
  if (task.type === 'vpn' && task.requiresPayment) {
    try {
      if (window.Telegram?.WebApp?.openTelegramLink) {
        window.Telegram.WebApp.openTelegramLink(task.link);
      } else {
        window.open(task.link, '_blank');
      }
      alert('🔁 Оплати VPN в Telegram-боте, затем вернись и нажми «Выполнить»');
      return;
    } catch (error) {
      console.error ( 'Ошибка перехода к боту:', error);
      alert ( 'Не удалось открыть Telegram-бота. Попробуй вручную.');
return;
    }
  }
  try{
      const res = await fetch(`/api/check-payment?user_id=${userId}`);
      const data = await res.json();
      if (data.success) {
        setVpnActivated(true);
        setClickMultiplier(2);
        completeTask(task);
        alert('🎉 VPN оплачен. x2 кликов активирован!');
      } else {
        alert('⛔️ Оплата не найдена. Попробуй позже.');
      }
    } catch (err) {
      console.error('Ошибка оплаты:', err);
      alert('Ошибка при проверке оплаты.');
    }

  // 3. Подписка на Telegram
  if (task.requiresSubscription) {
    try {
      if (window.Telegram?.WebApp?.openTelegramLink) {
        window.Telegram.WebApp.openTelegramLink(task.link);
      } else {
        window.open(task.link, '_blank');
      }

      setTimeout(async () => {
        const res = await fetch(`/api/check-subscription?user_id=${userId}`);
        const data = await res.json();
        if (data.subscribed) {
          setSubscribed(true);
          completeTask(task);
        } else {
          alert('Подпишись на канал, чтобы получить награду');
        }
      }, 2000);
    } catch (error) {
      alert('Ошибка при проверке подписки');
      console.error(error);
    }
    return;
  }

  // 4. Подписка на Instagram
  if (task.key === 'subscribeInstagram' && task.link) {
  try {
    if (window.Telegram?.WebApp?.openTelegramLink) {
      window.Telegram.WebApp.openTelegramLink(task.link);
    } else {
      window.open(task.link, '_blank');
    }
  } catch {
    alert('Не удалось открыть Instagram');
    return;
  }

  // Подождать 3 секунды и проверить подписку через API
  setTimeout(async () => {
    try {
      const res = await fetch(`/api/check-instagram-subscription?user_id=${userId}`);
      const data = await res.json();

      if (data.subscribed) {
        completeTask(task);
      } else {
        alert('Пожалуйста, подпишитесь на Instagram, чтобы получить награду');
      }
    } catch {
      alert('Ошибка при проверке подписки. Попробуйте позже');
    }
  }, 3000);

  return;
}

  // 5. Прочие задания (соцсети, реакция, комментарий и т.п.)
  completeTask(task);
};
  
const renderTasks = () => (
  <div className="tasks-tab">
    <h2>📋 Задания</h2>
    {tasks.map((task) => {
      const isDisabled =
        (task.requiresReferralCount && referrals < task.requiresReferralCount) ||
        (task.disabled && !completedTasks[task.key]);

      return (
        <div
          key={task.key}
          className={`task-card ${completedTasks[task.key] ? "completed" : ""}`}
        >
          <h3>{task.label}</h3>
          {task.requiresReferralCount && (
            <p>
              👥 {Math.min(referrals, task.requiresReferralCount)}/
              {task.requiresReferralCount}
            </p>
          )}

          <p>🎯 Награда: {task.reward} монет</p>

          {task.link && (
            <a href={task.link} target="_blank" rel="noopener noreferrer">
              <button className="task-button">Перейти</button>
            </a>
          )}
          {completedTasks[task.key] ? (
            <span className="done">✅ Выполнено</span>
          ) : (
          task.type === 'referral' ? (
           <button
            onClick={() => handleTaskClick (task)}
             disabled={isDisabled}
             >
             Выполнить
             </button>
            ):(
            <button
              onClick={() => 
                task.requiresPayment
                  ? handlePaymentCheck(task.key)
                  : completeTask(task.key, task.reward)
              }
              disabled={isDisabled}
            >
              Выполнить
            </button>
          )
          )}
        </div>
      );
    })}

    {/* Заглушка нового задания */}
    <div className="task-card disabled-task">
      <span>🔒 <strong>Скоро новое задание</strong> —  🔜 Ожидай обновлений</span>
    </div>

    {/* Кнопка сброса данных для тестов */}
    <button
      style={{ marginTop: 20 }}
      onClick={() => {
        localStorage.clear();
        window.location.reload();
      }}
    >
      🔄 Сбросить данные (тест)
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


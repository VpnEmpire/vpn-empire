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

const completeTask = (task) => {
  if (completedTasks[task.key]) return;
  setCompletedTasks(prev => ({ ...prev, [task.key]: true }));
  setCoins(prev => prev + task.reward);
  
if (task.key === 'instagramFollow') {
  setCompletedTasks(prev => ({ ...prev, [task.key]: true }));
  setCoins(prev => prev + task.reward);}
  
  const updatedTasks = tasks.map(t =>
    t.key === task.key ? { ...t, done: true } : t
  );
  setCompletedTasks(updatedTasks);
  localStorage.setItem('completedTasks', JSON.stringify(updatedTasks));
//1 Проверка: если ВСЕ задания по приглашению выполнены — сбрасываем их
  const allReferralDone = referralKeys.every(key => updatedTasks[key]);
  if (allReferralDone) {
    const reset = { ...updatedTasks };
    referralKeys.forEach(key => {
      reset[key] = false;
    });
    setTimeout(() => {
      setCompletedTasks(reset);
      localStorage.setItem('completedTasks', JSON.stringify(reset));
      alert('🎉 Задания по приглашениям обновлены! Начни заново');
    }, 1000);
  }

  // Награда (можно тут добавить setCoins)
  alert(`🎁 Ты получил ${task.reward} монет!`);
};
  
 //2 Отмечаем выполнение
  setCompletedTasks(prev => ({ ...prev, [task.key]: true }));

  // Начисляем монеты
  setCoins(prev => prev + task.reward);

  // Если это задание на оплату VPN — включаем x2 кликов
  if (task.type === 'payment') {
    setVpnActivated(true);
    setClickMultiplier(2); // включаем множитель
  }

  // Обновляем localStorage
  const updated = {
    ...completedTasks,
    [task.key]: true
  };
  localStorage.setItem('completedTasks', JSON.stringify(updated));
  localStorage.setItem('coins', coins + task.reward);
};

  setCoins(prev => {
    const newCoins = prev + task.reward;
    localStorage.setItem('coins', newCoins);
    return newCoins;
  });
 
const handleTaskClick = async (task) => {
  if (completedTasks[task.key]) return;

    const referralLink = `https://t.me/OrdoHereticus_bot/vpnempire?startapp=${userId}`;

  // Копирование ссылки
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

  // Проверка количества приглашенных
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
  };


const botPaymentLink = 'https://t.me/OrdoHereticus_bot';
  // Переход в бота
  try {
    if (window.Telegram?.WebApp?.openTelegramLink) {
      window.Telegram.WebApp.openTelegramLink(botPaymentLink);
    } else {
      window.open(botPaymentLink, '_blank');
    }
    alert('🔁 Оплати VPN в Telegram-боте, затем вернись и нажми «Выполнить»');
  } catch (error) {
    console.error('Ошибка перехода к боту:', error);
    alert('Не удалось открыть Telegram-бота. Попробуйте вручную.');
    return;
  }

  // Проверка оплаты
  try {
    const res = await fetch(`/api/check-payment?user_id=${userId}`);
    const data = await res.json();
    if (data.success) {
      setVpnActivated(true);
      setClickMultiplier(2); // Включаем x2 кликов
      completeTask(task);
      alert('🎉 VPN оплачен. x2 кликов активирован!');
    } else {
      alert('⛔️ Оплата не найдена. Попробуй позже.');
    }
  } catch (err) {
    console.error('Ошибка проверки оплаты:', err);
    alert('⚠️ Ошибка при проверке оплаты.');
  }
};

 //3 Если задание — подписка на канал
  if (task.requiresSubscription) {
    try {
      // Открываем Telegram-ссылку
      if (window?.Telegram?.WebApp?.openTelegramLink) {
        window.Telegram.WebApp.openTelegramLink(task.link);
      } else {
        window.open(task.link, '_blank');
      }

      // Через секунду проверяем подписку
      setTimeout(async () => {
        const res = await fetch(`/api/check-subscription?user_id=${userId}`);
        const data = await res.json();

        if (data.subscribed) {
          setSubscribed(true);
          completeTask(task);
        } else {
          alert('Подпишись на канал, чтобы получить награду');
        }
      }, 1500); // можно увеличить до 3000мс при необходимости
    } catch (error) {
      console.error('Ошибка проверки подписки:', error);
      alert('Ошибка при проверке подписки. Попробуй позже.');
    }

    return;
  };

  // ... остальная логика handleTaskClick


  // 4 Подписка инстаграм
if (task.key === 'instagram' && task.link) {
  try {
    if (window.Telegram?.WebApp?.openTelegramLink) {
      window.Telegram.WebApp.openTelegramLink(task.link);
    } else {
      window.open(task.link, '_blank');
    }
  } catch (err) {
    alert('Не удалось открыть ссылку на Instagram.');
  }
};


  // 6. Без условий — сразу выполнять
  if (
    !task.requiresSubscription &&
    !task.requiresPayment &&
    !(task.type === 'referral' && task.requiresReferralCount)
  ) {
    completeTask(task);
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
          <button onClick={(e) => {
            e.stopPropagation();
            completeTask(task);
          }}>Выполнить</button>
        )}
      </div>
    ))}

    {/* Заглушка внизу */}
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


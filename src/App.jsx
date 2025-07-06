import React, { useState, useEffect, useRef } from 'react';
import './App.css';
import BottomNav from './components/BottomNav.jsx';
import TopTab from './components/Top.jsx';
import Roulette from './components/Roulette.jsx';
import Hometab from './components/Home.jsx';
import supabase from './supabaseClient';

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
  const [showReferralModal, setShowReferralModal] = useState(false);
  const [copiedLink, setCopiedLink] = useState('');
  const [vpnActivated, setVpnActivated] = useState(false);
  const [clickMultiplier, setClickMultiplier] = useState (() => Number(localStorage.getItem('clickMultiplier')) || 1);
  const [hasVpnBoost, setHasVpnBoost] = useState(() => localStorage.getItem('hasVpnBoost') === 'true');
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
    { key: 'activateVpn', label: '🚀 Активируй VPN', reward: 1000, type: 'vpn', link: 'https://t.me/OrdoHereticus_bot', bonus: 'x2 кликов', requiresPayment: true }
  ]);

  const maxClicksPerDay = 100;
  const spinSoundRef = useRef(null);
  const winSoundRef = useRef(null);
  const [canSpin, setCanSpin] = useState(true);
  const [spinResult, setSpinResult] = useState(null);

  useEffect(() => {
    const initDataUnsafe = window.Telegram?.WebApp?.initDataUnsafe;
    const storedUserId = localStorage.getItem('userId')
    if (initDataUnsafe?.user?.id) {
      const tgId = initDataUnsafe.user.id.toString();
      setUserId(tgId);
      localStorage.setItem('userId', tgId);
    } else if (storedUserId) {
      setUserId(storedUserId);
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
    const storedBoost = localStorage.getItem('hasVpnBoost');
    if (storedBoost === 'true') {
      setHasVpnBoost(true);
      setClickMultiplier(2);
    }
  }, []);

  useEffect(() => {
    const today = new Date().toDateString();
    if (localStorage.getItem('lastClickDate') !== today) {
      setClicksToday(0);
      localStorage.setItem('lastClickDate', today);
    }
    if (localStorage.getItem('dailyVpnResetDate') !== today) {
      const updated = { ...completedTasks };
      delete updated['dailyVpn'];
      setCompletedTasks(updated);
      localStorage.setItem('completedTasks', JSON.stringify(updated));
      localStorage.setItem('dailyVpnResetDate', today);
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
    audio.play().catch(e => console.log('Ошибка воспроизведения звука:', e));
  };

  const handleClick = (e) => {
    if (clicksToday < maxClicksPerDay) {
      const multiplier = hasVpnBoost ? 2 : 1;
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

    if (task.requiresPayment) {
      setClickMultiplier(2);
      localStorage.setItem('clickMultiplier', '2');
      setHasVpnBoost(true);
      localStorage.setItem('hasVpnBoost', 'true');
    }

    alert(`🎁 Ты получил ${task.reward || 0} монет!`);
  };
  
 const handleTaskClick = async (task) => {
   if (completedTasks[task.key]) {
    alert('✅ Это задание уже выполнено!');
    return;
  }
    // 1. Реферальные задания
   if (task.type === 'referral' && !completedTasks[task.key]) {
  const refLink = `https://t.me/OrdoHereticus_bot?start=${userId}`;
  try {
    if (window.Telegram?.WebApp?.clipboard?.writeText) {
      await window.Telegram.WebApp.clipboard.writeText(refLink);
    } else {
      await navigator.clipboard.writeText(refLink);
    }
    setCopiedLink(refLink);
    setShowReferralModal(true);
  } catch (e) {
    alert(`Скопируй вручную:\n${refLink}`);
  }

   try {
        const { data, error } = await supabase
          .from('referrals')
          .select('count')
          .eq('user_id', userId)
          .single();
     
    const count = data.referrals || 0;
    setReferrals(count);

    if (count >= task.requiresReferralCount) {
          completeTask(task);
        } else {
          alert(`Приглашено ${count}/${task.requiresReferralCount} друзей`);
        }

        // Сброс реферальных заданий, если все выполнены
        const allReferralDone = tasks
          .filter(t => t.type === 'referral')
          .every(t => completedTasks[t.key] || t.key === task.key);

        if (allReferralDone) {
          const updated = { ...completedTasks };
          tasks.forEach(t => {
            if (t.type === 'referral') delete updated[t.key];
          });
          setCompletedTasks(updated);
          localStorage.setItem('completedTasks', JSON.stringify(updated));
          alert('Все реферальные задания выполнены — они сброшены и доступны снова!');
        }
      } catch (error) {
        console.error(error);
        alert('Ошибка при проверке приглашений.');
      }
      return;
    }

    if (task.type === 'vpn' && task.requiresPayment && !localStorage.getItem('vpnClickedOnce')) {
      try {
        if (window.Telegram?.WebApp?.openTelegramLink) {
          window.Telegram.WebApp.openTelegramLink(task.link);
        } else {
          window.open(task.link, '_blank');
        }
        alert('🔁 Оплати VPN в Telegram-боте, затем вернись и нажми «Выполнить»');
        localStorage.setItem('vpnClickedOnce', 'true');
        return;
      } catch (error) {
        alert('❌ Не удалось открыть Telegram-бота. Попробуй вручную.');
        return;
      }
    }

    if (task.type === 'vpn' && task.requiresPayment) {
      // Проверяем оплату через Supabase
      try {
        const { data, error } = await supabase
          .from('payments')
          .select('status')
          .eq('user_id', String (userId))
          .eq('status', 'succeeded')
          .limit(1)
          .maybesingle();

        if (data && data.status === 'succeeded') {
          completeTask(task);
        } else {
          alert('❌ Оплата не найдена. Попробуй позже.');
        }
      } catch (error) {
        console.error(error);
        alert('Ошибка при проверке оплаты. Попробуй позже.');
      }
      return;
    }

    if (task.requiresSubscription) {
      try {
        if (window.Telegram?.WebApp?.openTelegramLink) {
          window.Telegram.WebApp.openTelegramLink(task.link);
        } else {
          window.open(task.link, '_blank');
        }
      } catch {
        alert('Не удалось открыть ссылку подписки');
        return;
      }
      setTimeout(async () => {
        try {
          const { data, error } = await supabase
            .from('subscriptions')
            .select('is_subscribed')
            .eq('user_id', userId)
            .eq('channel', task.key === 'subscribeTelegram' ? 'telegram' : 'instagram')
            .limit(1)
            .single();

          if (data?.is_subscribed) {
            completeTask(task);
          } else {
            alert('Пожалуйста, подпишитесь на канал для получения награды');
          }
        } catch {
          alert('Ошибка при проверке подписки. Попробуйте позже.');
        }
      }, 3000);
      return;
    }

    // Для прочих заданий
    completeTask(task);
  };

const renderTasks = () => (
  <div className="tasks-tab">
    <h2>📋 Задания</h2>
    {tasks.map(task => {
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
            <p>👥 {Math.min(referrals, task.requiresReferralCount)}/{task.requiresReferralCount}</p>
          )}
          <p>🎯 Награда: {task.reward} монет</p>
         
        {/* VPN Задание — особое */}
          {task.key === 'activateVpn' && !completedTasks[task.key] && (
            <>
              <p>🎁 Бонус: x2 кликов после оплаты</p>
              <div className="task-buttons-vertical">
                <button
                  className="task-button"
                  onClick={() => {
                    if (window.Telegram?.WebApp?.platform === 'web') {
                      window.open(task.link, '_blank');
                    } else {
                       alert('🔁 Сверни игру и перейди в бот, чтобы оплатить VPN. Затем вернись и нажми «Выполнить»');
                      } 
                  }}
                >
                  Открыть бота
                </button>
                <button
                  className="task-button"
                  onClick={() => handleTaskClick(task)}
                >
                  Выполнить
                </button>
              </div>
            </>
)}
          {/* Задание VPN выполнено */}
          {task.key === 'activateVpn' && completedTasks[task.key] && (
            <div className="task-completed">✅ Выполнено </div>
          )}
          
          {(task.type === 'referral' || task.type === 'subscribe') && (
            <div className="task-buttons-vertical">
              {task.type === 'referral' && (
                <button
                  className={`task-button copy-button ${copiedLink === task.key ? 'copied' : ''}`}
                  onClick={async () => {
                    const refLink = `https://t.me/OrdoHereticus_bot?start=${userId}`;
                    try {
                      if (window.Telegram?.WebApp?.clipboard?.writeText) {
                        await window.Telegram.WebApp.clipboard.writeText(refLink);
                      } else {
                        await navigator.clipboard.writeText(refLink);
                      }
                      setCopiedLink(task.key);
                      setTimeout(() => setCopiedLink(null), 2000);
                    } catch (e) {
                      alert(`Скопируй вручную:\n${refLink}`);
                    }
                  }}
                >
                  {copiedLink === task.key ? '✅ Скопировано' : '🔗 Скопировать'}
                </button>
              )}
 
              {task.type === 'subscribe' && task.link && (
                <a href={task.link} target="_blank" rel="noopener noreferrer">
                  <button className="task-button"> Перейти </button>
                </a>
              )}
           {!completedTasks[task.key] && (
                <button
                  onClick={() => handleTaskClick(task)}
                  disabled={isDisabled}
                  className="task-button"
                >
                  Выполнить
                </button>
              )}
          </div>
            )}
          
          {!['referral', 'subscribe', 'vpn'].includes(task.type) && !completedTasks[task.key] && (
            <div className="task-buttons-vertical">
              <button
                onClick={() => handleTaskClick(task)}
                disabled={isDisabled}
                className="task-button"
              >
                Выполнить
              </button>
            </div>
          )}
 
          {completedTasks[task.key] && (
            <span className="done">✅ Выполнено</span>
          )}
        </div>
      );
    })}
    
    <div className="task-card disabled-task">
      <span>🔒 <strong>Скоро новое задание</strong> — 🔜 Ожидай обновлений</span>
    </div>
 
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
         <div className="clicks-left">
          💥 {clicksToday}/{maxClicksPerDay} монет
          {hasVpnBoost ? (<span className="boost-indicator"> ⚡ x2</span>) : null}
        </div>
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

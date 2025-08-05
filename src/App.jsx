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
  const [referralInfo, setReferralInfo] = useState({ ref: '', currentUser: '' });
  const [realPlayers, setRealPlayers] = useState([]);
  const [vpnActivated, setVpnActivated] = useState(false);
  const [vpnPaid, setVpnPaid] = useState(false);
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
    { key: 'commentPost', label: '💬 Оставить комментарий', reward: 50, type: 'action', link: 'https://t.me/OrdoHereticusVPN/38' },
    { key: 'dailyVpn', label: '🛡 Заходить в VPN каждый день', reward: 300 }, 
    { key: 'reactPost', label: '❤️ Поставить реакцию', reward: 50, type: 'action', link: 'https://t.me/OrdoHereticusVPN/38' },
    { key: 'activateVpn', label: '🚀 Активируй VPN', reward: 2000, type: 'vpn', link: 'https://t.me/OrdoHereticus_bot', bonus: 'x2 кликов', requiresPayment: true },
    { key: 'reactTelegramPost69', label: '💥 Поставь реакцию под новым постом', reward: 200, type: 'action', link: 'https://t.me/OrdoHereticusVPN/69' },
    { key: 'reactTelegramPost68', label: '💥 Поставь реакцию и забери награду', reward: 200, type: 'action', link: 'https://t.me/OrdoHereticusVPN/68' },
    { key: 'clickRobot', label: '🤖 Ты сегодня уже кликал на робота? Забери монеты!', reward: 100 }
  ]);

  const maxClicksPerDay = 1000;
  const spinSoundRef = useRef(null);
  const winSoundRef = useRef(null);
  const [canSpin, setCanSpin] = useState(true);
  const [spinResult, setSpinResult] = useState(null);
  

useEffect(() => {
  const initDataUnsafe = window.Telegram?.WebApp?.initDataUnsafe;
  const currentUser = initDataUnsafe?.user?.id;
  const ref = initDataUnsafe?.start_param;

  if (currentUser) {
    setUserId(currentUser);
    localStorage.setItem('user_id', currentUser);
  }

  setReferralInfo({ ref, currentUser }); // 👈 сохраняем для вывода на экран
  
  console.log('📦 Получено из Telegram:', { ref, currentUser });

  if (ref && ref !== String(currentUser)) {
    console.log('👥 Реферальный переход:', {
      user_id: String(currentUser),
      referral_id: ref
    });

    fetch('/api/add-referral', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        user_id: String(currentUser),
        referral_id: ref
      }),
    })
      .then(res => res.json())
      .then(data => {
        console.log('✅ Ответ от add-referral:', data);
      })
      .catch(err => {
        console.error('❌ Ошибка add-referral:', err);
      });
  }
}, []);

useEffect(() => {
  if (!userId) return;
  const fetchWithdrawPermission = async () => {
    try {
      const { data, error } = await supabase
        .from('users')
        .select('can_withdraw')
        .eq('user_id', userId)
        .single();
      if (error) throw error;
      setIsWithdrawApproved(data?.can_withdraw || false);
    } catch (err) {
      console.error('Ошибка получения права на вывод:', err);
    }
  };
  fetchWithdrawPermission();
}, [userId]);

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
  
          
          useEffect(() => {
  const ensureUserExists = async () => {
    const userId = localStorage.getItem('user_id');
    if (!userId) return;

    const { data, error } = await supabase
      .from('users')
      .select('id')
      .eq('user_id', userId)
      .maybeSingle();

    if (error) {
      console.error('❌ Ошибка при проверке пользователя:', error.message);
      return;
    }

    if (!data) {
      const { error: insertError } = await supabase.from('users').insert([
        { user_id: userId, coins: 0 }
      ]);
      if (insertError) {
        console.error('❌ Ошибка при добавлении пользователя:', insertError.message);
      } else {
        console.log('✅ Пользователь успешно добавлен в Supabase');
      }
    }
  };

  ensureUserExists();
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
    const earned = 1 * multiplier;

    setCoins(prev => {
      const newCoins = prev + earned;
      localStorage.setItem('coins', newCoins);

      // ⬇️ Обновляем Supabase сразу
      const userId = localStorage.getItem('user_id');
      if (userId) {
        fetch('/api/update-coins', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ user_id: userId, coins: newCoins }),
        }).catch(console.error);
      }

      return newCoins;
    });

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

    // ⬇️ Автоматически обновляем Supabase
    const userId = localStorage.getItem('user_id');
    if (userId) {
      fetch('/api/update-coins', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ user_id: userId, coins: newCoins }),
      }).catch(console.error);
    }

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
if (task.type === 'referral') {
  if (!userId) {
    alert('⛔ Не удалось определить твой ID. Попробуй позже.');
    return;
  }

  const urlParams = new URLSearchParams(window.Telegram?.WebApp?.initData || '');
  const ref = urlParams.get('startapp'); // ID пригласившего

  if (ref && ref !== String(userId)) {
    // 🔁 Повторная попытка отправить реферала
    try {
      const res = await fetch('/api/add-referral', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          user_id: String(userId),
          referral_id: ref,
        }),
      });
      const result = await res.json();
      console.log('🔄 add-referral повторно:', result);
    } catch (e) {
      console.error('❌ Ошибка повторного add-referral:', e);
    }
  }

  // Копируем ссылку и открываем окно
  const refLink = `https://t.me/OrdoHereticus_bot/vpnempire?startapp=${userId}`;
  try {
    if (window.Telegram?.WebApp?.clipboard?.writeText) {
      await window.Telegram.WebApp.clipboard.writeText(refLink);
    } else {
      await navigator.clipboard.writeText(refLink);
    }
    setCopiedLink(task.key);
    setShowReferralModal(true);
  } catch (e) {
    alert(`Скопируй вручную:\n${refLink}`);
  }

  try {
    const res = await fetch('/api/check-referral', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        user_id: userId,
        task_key: task.key,
        required_count: task.requiresReferralCount,
      }),
    });

    const data = await res.json();
    const invited = data.invited ?? 0;
    setReferrals(invited);

    if (data.success) {
      completeTask(task);

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
        alert('🎉 Все реферальные задания выполнены! Они сброшены и доступны снова.');
      }
    } else {
      alert(`❌ Недостаточно приглашений: ${invited}/${task.requiresReferralCount}`);
    }
  } catch (err) {
    console.error('❌ Ошибка при запросе /api/check-referral:', err);
    alert('❌ Ты ещё не выполнил это задание. Пригласи друзей по своей ссылке и возвращайся!');
  }

  return;
}

    // 2. Задания с оплатой VPN
  if (task.type === 'vpn' && task.requiresPayment) {
  console.log('🟡 Повторный клик: запускаем проверку оплаты');

  const stringUserId = String(userId).trim();
  console.log('👁 userId перед fetch-запросом:', stringUserId);
  
    try {
      const res = await fetch('/api/check-vpn-payment', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ user_id: stringUserId, task_key: task.key }),
      });
      
      const result = await res.json();
      if (result.success) {
        completeTask(task);
        if (task.key === 'activateVpn') {
          setClickMultiplier(2);
          localStorage.setItem('clickMultiplier', 2);
        }
      } else {
        alert('❌ Оплата не найдена. Проверь точность оплаты.');
      }
    } catch (error) {
      alert('Ошибка при проверке оплаты. Попробуй позже.');
    }
    return;
    }

  // 3.  Подписка Telegram — логика Перейти → Выполнить
  if (task.key === 'subscribeTelegram') {
  const res = await fetch('/api/add-subscription', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ user_id: userId, channel: 'telegram' }),
  });
  const result = await res.json();

  if (result.success) {
    completeTask(task);
  } else {
    alert('❌ Ты ещё не подписан на канал. Подпишись и попробуй снова.');
  }
  return;
}

  // 4. Instagram и другие действия: "Перейти" → затем "Выполнить"
   // 👉 Instagram, лайк, коммент, реакция — логика: Перейти → Выполнить
  if (task.type === 'action') {
    if (!task.visited) {
      alert('🔗 Сначала нажми "Перейти", затем вернись и нажми "Выполнить"');
      return;
    }
    completeTask(task);
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
  
    // Скрывать некоторые задачи после выполнения:
      const shouldHideAfterComplete = !['referral', 'dailyVpn'].includes(task.type || task.key);
if (completedTasks[task.key] && shouldHideAfterComplete) return null;
       
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
          <div className="task-completed" style={{ marginTop: '10px' }}>
        🎉 +1000 монет<br />
        ⚡ x2 кликов активирован
      </div>
          )}
          
        {/* Реферальные задания */}
{task.type === 'referral' && (
  <>
    {!completedTasks[task.key] && (
      <div className="task-buttons-vertical">
        {/* Кнопка "Скопировать" */}
        <button
          className={`task-button copy-button ${copiedLink === task.key ? 'copied' : ''}`}
          onClick={async () => {
            const refLink = `https://t.me/OrdoHereticus_bot/vpnempire?startapp=${userId}`;
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

        {/* Кнопка "Выполнить" */}
        <button
          className="task-button"
          onClick={() => handleTaskClick(task)}
        >
          Выполнить
        </button>
      </div>
    )}
  
        {/* Если задание уже выполнено */}
    {completedTasks[task.key] && (
      <div className="task-completed" style={{ marginTop: '10px' }}>
        🎉 Задание выполнено!
      </div>
    )}
  </>
)}

{/* Подписка на Telegram — Перейти → Выполнить */}
{task.key === 'subscribeTelegram' && (
  <div className="task-buttons-vertical">
    {!task.visited && (
      <a href={task.link} target="_blank" rel="noopener noreferrer">
        <button
          className="task-button"
          onClick={() => {
            setTimeout(() => {
              setTasks(prev =>
                prev.map(t =>
                  t.key === task.key ? { ...t, visited: true } : t
                )
              );
            }, 5000); // ⏱ 5 секунд перед "Выполнить"
          }}
        >
          Перейти
        </button>
      </a>
    )}
    {task.visited && !completedTasks[task.key] && (
      <button
        onClick={() => handleTaskClick(task)}
        className="task-button"
      >
        Выполнить
      </button>
    )}
  </div>
)}
            
               {/* Подписка на Instagram — Перейти → Выполнить */}
{task.key === 'subscribeInstagram' && (
  <div className="task-buttons-vertical">
    {!task.visited && (
      <a href={task.link} target="_blank" rel="noopener noreferrer">
        <button
          className="task-button"
          onClick={() => {
            setTimeout(() => {
              setTasks(prev =>
                prev.map(t =>
                  t.key === task.key ? { ...t, visited: true } : t
                )
              );
            }, 5000); // ⏱ Ждём 5 секунд перед тем, как показать кнопку "Выполнить"
          }}
        >
          Перейти
        </button>
      </a>
    )}
    {task.visited && !completedTasks[task.key] && (
      <button
        onClick={() => handleTaskClick(task)}
        className="task-button"
      >
        Выполнить
      </button>
    )}
  </div>
)}
            
              {/* Action: лайки, комментарии, Instagram и др — логика «Перейти → Выполнить» */}
          {task.type === 'action' && task.link && !completedTasks[task.key] && (
            <div className="task-buttons-vertical">
              {!task.visited && (
                <button
                  className="task-button"
                  onClick={() => {
                    if (window.Telegram?.WebApp?.openTelegramLink) {
                      window.Telegram.WebApp.openTelegramLink(task.link);
                    } else {
                      window.open(task.link, '_blank');
                    }
                    setTimeout(() => {
                      setTasks(prev =>
                        prev.map(t => t.key === task.key ? { ...t, visited: true } : t)
                      );
                    }, 5000); // ⏱ Задержка перед «Выполнить»
                  }}
                >
                  Перейти
                </button>
              )}
              {task.visited && (
                <button
                  className="task-button"
                  onClick={() => handleTaskClick(task)}
                >
                  Выполнить
                </button>
              )}
            </div>
          )}
          
     {!['referral', 'subscribe', 'vpn', 'action'].includes(task.type) && !completedTasks[task.key] && (
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
 
  const renderTop = () => <TopTab coins={coins} players={realPlayers} />;
  const renderRoulette = () => <Roulette setCoins={setCoins} />;
  const renderWithdraw = () => (
  <div className="withdraw-tab">
    <h2>💸 Вывод</h2>
    <p>Минимум для вывода: 10000 монет</p> {/* Просто мотивационная надпись */}

    <button
      disabled={!isWithdrawApproved}
      className={isWithdrawApproved ? 'withdraw-button' : 'withdraw-button disabled'}
      onClick={async () => {
        if (!isWithdrawApproved) return;

        window.open('https://www.instagram.com/internet.bot.001', '_blank');
        alert('📩 Напиши в Direct с ID: ' + userId + ' и суммой к выводу.');

        // Обнуляем монеты
        setCoins(0);
        localStorage.setItem('coins', '0');

        // Скрываем кнопку
        setIsWithdrawApproved(false);
        localStorage.setItem('isWithdrawApproved', 'false');

        // Обновляем Supabase
        await supabase
          .from('users')
          .update({ can_withdraw: false })
          .eq('user_id', String(userId));
      }}
    >
      Вывести
    </button>

    {!isWithdrawApproved && (
      <p style={{ marginTop: '10px', color: 'gray' }}>
        ⏳ Ожидай одобрения — свяжись с нами, когда кнопка станет активной.
      </p>
    )}
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

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
  const maxClicksPerDay = 100;
  
  // Звук и логика рулетки
  const spinSoundRef = useRef(null);
  const winSoundRef = useRef(null);
  const [canSpin, setCanSpin] = useState(true);
  const [isSpinning, setIsSpinning] = useState(false);
  const [spinResult, setSpinResult] = useState(null);

  useEffect(() => {
    const lastSpinDate = localStorage.getItem('lastSpinDate');
    const today = new Date().toDateString();
    if (lastSpinDate === today) setCanSpin(false);
  }, []);

  useEffect(() => {
    localStorage.setItem('coins', coins);
    updateRank(coins);
  }, [coins]);

  useEffect(() => {
    const today = new Date().toDateString();
    const lastClickDate = localStorage.getItem('lastClickDate');
    if (lastClickDate !== today) {
      setClicksToday(0);
      localStorage.setItem('lastClickDate', today);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('clicksToday', clicksToday);
  }, [clicksToday]);

  const handleClick = () => {
    if (clicksToday < maxClicksPerDay) {
      setCoins(prev => prev + 1);
      setClicksToday(prev => prev + 1);
      triggerAnimation();
      playClickSound();
    }
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

  const updateRank = (totalCoins) => {
    if (totalCoins >= 5000) setRank('Легенда VPN');
    else if (totalCoins >= 2000) setRank('Эксперт');
    else if (totalCoins >= 1000) setRank('Профи');
    else if (totalCoins >= 500) setRank('Агент');
    else setRank('Новичок');
  };

  const handleSubscriptionConfirm = () => {
    localStorage.setItem('hasSubscription', 'true');
    setHasSubscription(true);
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
      <img
        src="/robot.png"
        alt="robot"
        className="robot"
        onClick={handleClick}
      />
      <div className="clicks-left">💥 {clicksToday}/{maxClicksPerDay} монет</div>
    </div>

    <div className="helper-box">
      🤖 <strong>Я твой помощник!</strong><br />
      Кликай на робота и зарабатывай монеты.
    </div>
  </div>
);
  
const renderTasks = () => (
  <div className="tasks-tab">
    <h2>📋 Задания</h2>

    <div className="task-card">
      <span>Пригласи 1 друга – 🪙 50 монет</span>
      {completedTasks['invite1'] ? (
        <span className="done">✅</span>
      ) : (
        <button onClick={() => handleComplete('invite1', 50)}>Выполнить</button>
      )}
    </div>
<div className="task-card">
      <span>Пригласи 2 друзей – 🪙 100 монет</span>
      {completedTasks['invite1'] ? (
        <span className="done">✅</span>
      ) : (
        <button onClick={() => handleComplete('invite1', 100)}>Выполнить</button>
      )}
    </div>
    
    <div className="task-card">
      <span>Пригласи 3 друзей – 🪙 200 монет</span>
      {completedTasks['invite1'] ? (
        <span className="done">✅</span>
      ) : (
        <button onClick={() => handleComplete('invite1', 200)}>Выполнить</button>
      )}
    </div>
    
    <div className="task-card">
      <span>Пригласи 4 друзей – 🪙 300 монет</span>
      {completedTasks['invite1'] ? (
        <span className="done">✅</span>
      ) : (
        <button onClick={() => handleComplete('invite1', 300)}>Выполнить</button>
      )}
    </div>
    
    <div className="task-card">
      <span>Пригласи 5 друзей – 🪙 400 монет</span>
      {completedTasks['invite1'] ? (
        <span className="done">✅</span>
      ) : (
        <button onClick={() => handleComplete('invite1', 400)}>Выполнить</button>
      )}
    </div
      
    <div className="task-card">
      <span>Пригласи 6 друзей – 🪙 500 монет</span>
      {completedTasks['invite1'] ? (
        <span className="done">✅</span>
      ) : (
        <button onClick={() => handleComplete('invite1', 500)}>Выполнить</button>
      )}
    </div>
    
    <div className="task-card">
      <span>Пригласи 7 друзей – 🪙 600 монет</span>
      {completedTasks['invite1'] ? (
        <span className="done">✅</span>
      ) : (
        <button onClick={() => handleComplete('invite1', 600)}>Выполнить</button>
      )}
    </div>
    
    <div className="task-card">
      <span>Подписаться на Telegram – 🪙 100 монет</span>
      {completedTasks['telegram'] ? (
        <span className="done">✅</span>
      ) : (
        <button onClick={() => handleComplete('telegram', 100)}>Выполнить</button>
      )}
    </div>

    <div className="task-card">
      <span>Рассказать о нас в соцсетях – 🪙 100 монет</span>
      {completedTasks['social'] ? (
        <span className="done">✅</span>
      ) : (
        <button onClick={() => handleComplete('social', 100)}>Выполнить</button>
      )}
    </div>
    <div className="task-card">
      <span>Пригласи 1 друга – 🪙 50 монет</span>
      {completedTasks['invite1'] ? (
        <span className="done">✅</span>
      ) : (
        <button onClick={() => handleComplete('invite1', 50)}>Выполнить</button>
      )}
    </div>
    const renderTasks = () => (
  <div className="tasks-tab">
    <h2>📋 Задания</h2>

    <div className="task-card">
      <span>
        📨 Подписаться на Telegram-канал — <a href="https://t.me/OrdoHereticusVPN" target="_blank" rel="noopener noreferrer">OrdoHereticusVPN</a> — 🪙 100 монет
      </span>
      {completedTasks['subscribeTelegram'] ? (
        <span className="done">✅</span>
      ) : (
        <button onClick={() => handleComplete('subscribeTelegram', 100)}>Выполнить</button>
      )}
    </div>

    <div className="task-card">
      <span>
        Подписаться на Instagram — <a href="https://www.instagram.com/internet.bot.001?igsh=MXRhdzRhdmc1aGhybg==" target="_blank" rel="noopener noreferrer">@internet.bot.001</a> — 🪙 100 монет
      </span>
      {completedTasks['subscribeInstagram'] ? (
        <span className="done">✅</span>
      ) : (
        <button onClick={() => handleComplete('subscribeInstagram', 100)}>Выполнить</button>
      )}
    </div>

    <div className="task-card">
      <span>📢 Расскажи о нас в соцсетях — 🪙 100 монет</span>
      {completedTasks['shareSocial'] ? (
        <span className="done">✅</span>
      ) : (
        <button onClick={() => handleComplete('shareSocial', 100)}>Выполнить</button>
      )}
    </div>

    <div className="task-card">
      <span>💬 Оставить комментарий под последним постом — 🪙 50 монет</span>
      {completedTasks['commentPost'] ? (
        <span className="done">✅</span>
      ) : (
        <button onClick={() => handleComplete('commentPost', 50)}>Выполнить</button>
      )}
    </div>

    <div className="task-card">
      <span>❤️ Поставить реакцию на последнюю запись — 🪙 50 монет</span>
      {completedTasks['reactPost'] ? (
        <span className="done">✅</span>
      ) : (
        <button onClick={() => handleComplete('reactPost', 50)}>Выполнить</button>
      )}
    </div>

    <div className="task-card">
      <span>🛡 Заходить в VPN каждый день — 🪙 100 монет</span>
      {completedTasks['dailyVpn'] ? (
        <span className="done">✅</span>
      ) : (
        <button onClick={() => handleComplete('dailyVpn', 100)}>Выполнить</button>
      )}
    </div>
  </div>
);
    
  const spinWheel = () => {
    if (!canSpin) return;
    if (spinSoundRef.current) {
      spinSoundRef.current.currentTime = 0;
      spinSoundRef.current.play();
    }
    setIsSpinning(true);
    const rewardOptions = [20, 50, 100, 200, 300, 400];
    const reward = rewardOptions[Math.floor(Math.random() * rewardOptions.length)];
    setTimeout(() => {
      const newCoins = coins + reward;
      setCoins(newCoins);
      setSpinResult(reward);
      setCanSpin(false);
      setIsSpinning(false);
      localStorage.setItem('coins', newCoins.toString());
      localStorage.setItem('lastSpinDate', new Date().toDateString());
      if (winSoundRef.current) {
        winSoundRef.current.currentTime = 0;
        winSoundRef.current.play();
      }
    }, 2000);
  };

  const renderRoulette = () => (
    <div className="roulette-tab">
      <h2>🎰 Рулетка</h2>
      <img src="/roulette.gif" alt="Рулетка" className="roulette-image" style={{ width: '200px', marginBottom: '20px' }} />
      <button className="spin-button" onClick={spinWheel} disabled={!canSpin || isSpinning}>
        {isSpinning ? 'Крутится...' : 'Крутить рулетку'}
      </button>
      {spinResult !== null && !isSpinning && (
        <div className="spin-result">+{spinResult} монет!</div>
      )}
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
      case 'home':
        return renderHome();
      case 'tasks':
        return renderTasks();
      case 'roulette':
        return renderRoulette();
      case 'top':
        return renderTop();
      case 'withdraw':
        return renderWithdraw();
      default:
        return renderHome();
    }
  };
 return (
    <div className="App">
      {!hasSubscription ? renderSubscriptionPrompt() : renderTab()}
      {hasSubscription && (
        <BottomNav activeTab={activeTab} setActiveTab={setActiveTab} />
      )}
    </div>
  );
   return (
    <div className="App">
      <div className="header-box">
        <div>💰 {coins}</div>
        <div>{rank}</div>
      </div>

      {activeTab === 'home' && (
        <MainTab
          coins={coins}
          clicksToday={clicksToday}
          handleClick={handleClick}
        />
      )}
      {activeTab === 'tasks' && <TasksTab coins={coins} setCoins={setCoins} />}
      {activeTab === 'roulette' && <RouletteTab coins={coins} setCoins={setCoins} />}
      {activeTab === 'top' && <TopTab />}
      {/* Можно добавить вкладку "withdraw" по аналогии */}

      <BottomNav activeTab={activeTab} setActiveTab={setActiveTab} />
    </div>
  );
}

export default App;

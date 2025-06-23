// src/App.jsx
import React, { useState, useEffect, useRef } from 'react';
import './App.css';
import BottomNav from './components/BottomNav.jsx';
import TopTab from './components/Top.jsx';

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
        <div className="coins" Монет>: {coins} $RICH</div>
        <div className=🎖 Звание: {rank}</div>
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
      <h2>🎯 Задания</h2>
      <div className="task-card">Пригласи 1 друга – 💰 50 монет</div>
      <div className="task-card">Пригласи 2 друзей – 💰 100 монет</div>
      <div className="task-card">Пригласи 3 друзей – 💰 200 монет</div>
      <div className="task-card">Пригласи 4 друзей – 💰 300 монет</div>
      <div className="task-card">Пригласи 5 друзей – 💰 400 монет</div>
      <div className="task-card">Пригласи 6 друзей – 💰 500 монет</div>
      <div className="task-card">Пригласи 7 друзей – 💰 600 монет</div>
      <div className="task-card">📨 Подписаться на Telegram – 💰 100 монет</div>
      <div className="task-card">Подписаться на Instagram – 💰 100 монет</div>
      <div className="task-card">Рассказать о нас в соцсетях – 💰 100 монет</div>
      <div className="task-card">Оставить комментарий – 💰 50 монет</div>
      <div className="task-card">Поставить реакцию – 💰 50 монет</div>
      <div className="task-card">Заходить в VPN каждый день – 💰 100 монет</div>
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
}

export default App;


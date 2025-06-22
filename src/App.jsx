mport React, { useState, useEffect } from 'react';
import './App.css';
import BottomNav from './components/BottomNav';
import Withdraw from './components/Withdraw';

function App() {
  const [activeTab, setActiveTab] = useState('home');
  const [coins, setCoins] = useState(() => Number(localStorage.getItem('coins')) || 0);
  const [rank, setRank] = useState('');
  const [clicksToday, setClicksToday] = useState(() => Number(localStorage.getItem('clicksToday')) || 0);
  const [hasSubscription, setHasSubscription] = useState(() => localStorage.getItem('hasSubscription') === 'true');
  const maxClicksPerDay = 100;

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

  const renderHome = () => (
    <div className="main-content">
      <div className="stats-box">
        <p>Монет: {coins} $RICH</p>
        <p>Звание: {rank}</p>
      </div>
      <img
        src="/robot.png"
        alt="robot"
        className="robot"
        onClick={handleClick}
      />
      <div className="clicks-left">💥 {clicksToday}/{maxClicksPerDay} монет</div>
      <div className="helper-box">
        🤖 Я твой помощник! Кликай на робота и зарабатывай монеты.
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

  const renderRoulette = () => (
    <div className="roulette-tab">
      <h2>🎰 Рулетка</h2>
      <p>Крути рулетку и получай случайный приз!</p>
    </div>
  );

  const renderTop = () => (
    <div className="top-tab">
      <h2>🏆 ТОП ИГРОКОВ</h2>
      <img src="/robot.png" alt="robot" className="top-robot" />
      <div className="top-player gold">1. Player1 — 🏆 1500</div>
      <div className="top-player silver">2. Player2 — 🏆 1200</div>
      <div className="top-player bronze">3. Player4 — 🏆 800</div>
      <div className="top-player current">4. Ты — 🏆 {coins}</div>
    </div>
  );

  const renderProfile = () => (
    <div className="profile-tab">
      <h2>👤 Профиль</h2>
      <p>Монет: {coins}</p>
      <p>Звание: {rank}</p>
    </div>
  );

   const renderWithdraw = () => (
  <div className="withdraw-tab">
    <h2>💸 Вывод</h2>
    <p>Минимум для вывода: 1000 монет</p>
    <p>Чтобы вывести средства, нажми на кнопку ниже:</p>
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
      case 'profile':
        return renderProfile();
      case 'withdraw':
        return renderWithdraw();
      default:
        return renderHome();
    }
  };

  const renderSubscriptionGate = () => (
    <div className="subscription-lock">
      <h2>🔐 Доступ ограничен</h2>
      <p>Чтобы играть, оплати подписку на VPN (от 100 ₽) через Telegram-бота:</p>
      <a href="https://t.me/OrdoHereticusVPN" target="_blank" rel="noreferrer">
        👉 @OrdoHereticusVPN
      </a>
      <button onClick={() => {
        localStorage.setItem('hasSubscription', 'true');
        setHasSubscription(true);
      }}>
        ✅ Я оплатил
      </button>
    </div>
  );

  return (
    <div className="App">
      {!hasSubscription ? renderSubscriptionGate() : renderTab()}
      {hasSubscription && (
        <BottomNav currentTab={activeTab} setCurrentTab={setActiveTab} />
      )}
    </div>
  );
}

export default App;

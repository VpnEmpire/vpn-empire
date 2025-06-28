// src/components/Tasks.jsx
import React, { useEffect, useState } from 'react';
import './Tasks.css';

const defaultTasks = [
  { key: 'invite1', label: 'Пригласи 1 друга', reward: 50, requiresReferralCount: 1, type: 'referral' },
  { key: 'invite2', label: 'Пригласи 2 друзей', reward: 100, requiresReferralCount: 2, type: 'referral' },
  { key: 'invite3', label: 'Пригласи 3 друзей', reward: 200, requiresReferralCount: 3, type: 'referral' },
  { key: 'invite4', label: 'Пригласи 4 друзей', reward: 300, requiresReferralCount: 4, type: 'referral' },
  { key: 'invite5', label: 'Пригласи 5 друзей', reward: 400, requiresReferralCount: 5, type: 'referral' },
  { key: 'invite6', label: 'Пригласи 6 друзей', reward: 500, requiresReferralCount: 6, type: 'referral' },
  { key: 'invite7', label: 'Пригласи 7 друзей', reward: 600, requiresReferralCount: 7, type: 'referral' },
  { key: 'subscribeTelegram', label: '📨 Подписаться на Telegram', reward: 100, link: 'https://t.me/OrdoHereticusVPN', requiresSubscription: true, type: 'subscribe' },
  { key: 'subscribeInstagram', label: '📸 Подписаться на Instagram', reward: 100, link: 'https://www.instagram.com/internet.bot.001?igsh=MXRhdzRhdmc1aGhybg==', type: 'subscribe' },
  { key: 'shareSocial', label: '📢 Расскажи о нас в соцсетях', reward: 100 },
  { key: 'commentPost', label: '💬 Оставить комментарий', reward: 50 },
  { key: 'reactPost', label: '❤️ Поставить реакцию', reward: 50 },
  { key: 'dailyVpn', label: '🛡 Заходить в VPN каждый день', reward: 100 },
  { key: 'activateVpn', label: '🚀 Активируй VPN', reward: 1000, link: 'https://t.me/OrdoHereticus_bot', requiresPayment: true, type: 'vpn' }
];

const TasksTab = ({ coins, setCoins }) => {
  const [tasks, setTasks] = useState(() => {
    const saved = localStorage.getItem('tasks');
    return saved ? JSON.parse(saved) : defaultTasks.map(t => ({ ...t, done: false }));
  });

  const [userId, setUserId] = useState(null);
  const [referrals, setReferrals] = useState(0);
  const [vpnActivated, setVpnActivated] = useState(false);
  const [subscribed, setSubscribed] = useState(false);
  const [completedTasks, setCompletedTasks] = useState(() => {
    return JSON.parse(localStorage.getItem('completedTasks')) || {};
  });

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
    const today = new Date().toDateString();
    const lastDate = localStorage.getItem('dailyTaskDate');

    if (lastDate !== today) {
      const storedTasks = JSON.parse(localStorage.getItem('completedTasks')) || {};
      delete storedTasks['dailyVpn'];
      localStorage.setItem('completedTasks', JSON.stringify(storedTasks));
      localStorage.setItem('dailyTaskDate', today);
      setCompletedTasks(storedTasks);
    }
  }, []);

  const completeTask = async (task) => {
    if (completedTasks[task.key]) return;

    if (task.requiresReferralCount && referrals < task.requiresReferralCount) {
      alert(`Пригласи хотя бы ${task.requiresReferralCount} друзей`);
      return;
    }

    if (task.requiresSubscription && !subscribed) {
      alert('Подпишись на Telegram-канал');
      return;
    }

    if (task.requiresPayment) {
      const res = await fetch(`/api/check-payment?user_id=${userId}`);
      const data = await res.json();
      if (!data.success) {
        alert("Сначала активируй VPN через Telegram-бота");
        return;
      }
      setVpnActivated(true);
    }

    const updatedCompleted = { ...completedTasks, [task.key]: true };
    setCompletedTasks(updatedCompleted);
    localStorage.setItem('completedTasks', JSON.stringify(updatedCompleted));
    setCoins(prev => prev + task.reward);

    const updated = tasks.map(t => t.key === task.key ? { ...t, done: true } : t);
    setTasks(updated);
    localStorage.setItem('tasks', JSON.stringify(updated));
  };

  const handleTaskClick = (task) => {
    if (task.done) return;

    if (task.type === 'referral') {
      const link = `https://t.me/OrdoHereticus_bot/vpnempire?startapp=${userId}`;
      navigator.clipboard.writeText(link);
      alert(`Твоя реферальная ссылка скопирована:\n${link}`);
    }

    if ((task.type === 'subscribe' || task.type === 'vpn') && task.link) {
      try {
        if (window?.Telegram?.WebApp?.openTelegramLink) {
          window.Telegram.WebApp.openTelegramLink(task.link);
        } else {
          window.open(task.link, '_blank');
        }
      } catch (error) {
        alert('Не удалось открыть ссылку. Попробуй позже.');
      }

      if (task.type === 'subscribe') {
        alert('Подпишись на канал, чтобы получить награду');
      }
      if (task.type === 'vpn') {
        alert('Активируй VPN через Telegram-бота');
      }
    }
  };

  return (
    <div className="tasks-tab">
      <h2>📋 Задания</h2>
      {tasks.map(task => (
        <div
          key={task.key}
          className={`task-card ${completedTasks[task.key] ? 'completed' : ''}`}
          onClick={() => handleTaskClick(task)}
        >
          <h3>{task.label}</h3>
          {task.requiresReferralCount && (
            <p>👥 {Math.min(referrals, task.requiresReferralCount)}/{task.requiresReferralCount} друзей</p>
          )}
          <p>🪙 Награда: {task.reward} монет</p>
          {completedTasks[task.key] ? (
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
};

export default TasksTab;


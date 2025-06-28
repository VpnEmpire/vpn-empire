// src/components/Tasks.jsx
import React, { useEffect, useState } from 'react';
import './Tasks.css';

const defaultTasks = [
  { id: 1, title: 'Пригласи 1 друга', reward: 50, requiresReferralCount: 1 },
  { id: 2, title: 'Пригласи 2 друзей', reward: 100, requiresReferralCount: 2 },
  { id: 3, title: 'Пригласи 3 друзей', reward: 200, requiresReferralCount: 3 },
  { id: 4, title: 'Пригласи 4 друзей', reward: 300, requiresReferralCount: 4 },
  { id: 5, title: 'Пригласи 5 друзей', reward: 400, requiresReferralCount: 5 },
  { id: 6, title: 'Пригласи 6 друзей', reward: 500, requiresReferralCount: 6 },
  { id: 7, title: 'Пригласи 7 друзей', reward: 600, requiresReferralCount: 7 },
  { id: 8, title: '📨 Подписаться на Telegram', reward: 100, requiresSubscription: true, link: 'https://t.me/OrdoHereticusVPN' },
  { id: 9, title: '📸 Подписаться на Instagram', reward: 100, link: 'https://www.instagram.com/internet.bot.001?igsh=MXRhdzRhdmc1aGhybg==' },
  { id: 10, title: '📢 Расскажи о нас в соцсетях', reward: 100 },
  { id: 11, title: '💬 Комментировать пост', reward: 100 },
  { id: 12, title: '❤️ Поставить реакцию', reward: 100 },
  { id: 13, title: '🛡 Зайти в VPN сегодня', reward: 100 },
  { id: 14, title: '🚀 Активировать VPN', reward: 1000, requiresPayment: true, link: 'https://t.me/OrdoHereticusVPN' }
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
  
 const isCompleted = (task) => {
    if (task.type === 'referral') return referrals >= task.count;
    if (task.type === 'subscribe') return subscribed;
    if (task.type === 'vpn') return vpnActivated;
    return false;
  };

  const completeTask = (task) => {
    if (task.requiresReferralCount && referrals < task.requiresReferralCount) {
      alert(`Пригласи хотя бы ${task.requiresReferralCount} друзей`);
      return;
    }

    if (task.requiresSubscription && !subscribed) {
      alert('Подпишись на Telegram-канал');
      return;
    }

    if (task.requiresPayment && !vpnActivated) {
      alert('Активируй VPN через Telegram-бота');
      return;
    }

    const updated = tasks.map(t => t.id === task.id ? { ...t, done: true } : t);
    setTasks(updated);
    localStorage.setItem('tasks', JSON.stringify(updated));
    setCoins(prev => prev + task.reward);
  };
  
 const handleTaskClick = (task) => {
    if (isCompleted(task)) return;

    if (task.type === 'referral') {
      const link = `https://t.me/OrdoHereticus_bot/vpnempire?startapp=${userId}`;
      navigator.clipboard.writeText(link);
      alert(`Твоя реферальная ссылка скопирована:\n${link}`);
    }

    if (task.type === 'subscribe' || task.type === 'vpn') {
      if (task.link) window.open(task.link, '_blank');
    }
  };
  
   return (
    <div className="tasks-tab">
      <h2>📋 Задания</h2>
      {tasks.map(task => (
        <div
          key={task.id}
          className={`task-card ${task.done ? 'completed' : ''}`}
          onClick={() => handleTaskClick(task)}
        >
          <h3>{task.title}</h3>
          {task.type === 'referral' && (
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
};

export default TasksTab;

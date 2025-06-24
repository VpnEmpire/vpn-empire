// src/components/TasksTab.jsx
import React, { useState, useEffect } from 'react';
import '../App.css';

const defaultTasks = [
  { title: 'Пригласить 1 друга', reward: 50 },
  { title: 'Пригласить 3 друга', reward: 150 },
  { title: 'Пригласить 5 друзей', reward: 300 },
  { title: 'Подписаться на Telegram', reward: 100 },
  { title: 'Подписаться на Instagram', reward: 100 },
  { title: 'Рассказать в соцсетях', reward: 200 },
  { title: 'Комментировать пост', reward: 100 },
  { title: 'Поставить реакцию', reward: 100 },
  { title: 'Зайти в VPN сегодня', reward: 100 },
];

const TasksTab = ({ coins, setCoins }) => {
  const [tasks, setTasks] = useState(() => {
    const saved = localStorage.getItem('tasks');
    return saved ? JSON.parse(saved) : defaultTasks.map(t => ({ ...t, done: false }));
  });

  const [userId, setUserId] = useState(null);
  const [copied, setCopied] = useState(false);
  const [referrals, setReferrals] = useState(0);

  useEffect(() => {
    const tgUserId = window?.Telegram?.WebApp?.initDataUnsafe?.user?.id;
    if (tgUserId) {
      setUserId(tgUserId);
      fetch(`/api/check-referrals?user_id=${tgUserId}`)
        .then((res) => res.json())
        .then((data) => setReferrals(data.referrals || 0));
    }
  }, []);

  const handleCopy = () => {
    const referralLink = `https://t.me/OrdoHereticus_bot?start=${userId}`;
    navigator.clipboard.writeText(referralLink).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  const handleComplete = (index) => {
    const task = tasks[index];
    if (task.done) return;

    const match = task.title.match(/пригласить (\d+)/i);
    if (match) {
      const required = parseInt(match[1]);
      if (referrals < required) {
        alert(`Нужно пригласить минимум ${required} друзей. Сейчас: ${referrals}`);
        return;
      }
    }

    const updatedTasks = [...tasks];
    updatedTasks[index].done = true;
    setTasks(updatedTasks);

    const updatedCoins = coins + task.reward;
    setCoins(updatedCoins);

    localStorage.setItem('coins', updatedCoins.toString());
    localStorage.setItem('tasks', JSON.stringify(updatedTasks));
  };

  return (
    <div className="main-screen">
      <h2>📋 Задания</h2>
      {tasks.map((task, index) => (
        <div key={index} className="task-card">
          <span>
            {task.title}
            {task.done && <span className="done"> ✅</span>}
            {!task.done && task.title.toLowerCase().includes('пригласить') && userId && (
              <div className="referral-box">
                <code>{`https://t.me/OrdoHereticus_bot?start=${userId}`}</code>
                <button className="copy-btn" onClick={handleCopy}>
                  {copied ? '✅ Скопировано!' : '📋 Скопировать'}
                </button>
                <div style={{ fontSize: '12px', marginTop: '6px', color: '#ccc' }}>
                  Приглашено: {referrals}
                </div>
              </div>
            )}
          </span>
          {!task.done && (
            <button onClick={() => handleComplete(index)}>Выполнить</button>
          )}
        </div>
      ))}
    </div>
  );
};

export default TasksTab;

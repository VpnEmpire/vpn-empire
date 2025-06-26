// src/components/TasksTab.jsx
import React, { useState, useEffect } from 'react';
import '../App.css';

const defaultTasks = [
  { id: 1, title: 'Пригласить 1 друга', reward: 50, requiresRef: 1 },
  { id: 2, title: 'Пригласить 2 друга', reward: 100, requiresRef: 2 },
  { id: 3, title: 'Пригласить 3 друга', reward: 200, requiresRef: 3 },
  { id: 4, title: 'Пригласить 4 друга', reward: 300, requiresRef: 4 },
  { id: 5, title: 'Пригласить 5 друзей', reward: 400, requiresRef: 5 },
  { id: 6, title: 'Пригласить 6 друзей', reward: 500, requiresRef: 6 },
  { id: 7, title: 'Пригласить 7 друзей', reward: 600, requiresRef: 7 },
  { id: 8, title: 'Подписаться на Telegram', reward: 100, requiresSub: true },
  { id: 9, title: 'Подписаться на Instagram', reward: 100 },
  { id: 10, title: 'Рассказать в соцсетях', reward: 200 },
  { id: 11, title: 'Комментировать пост', reward: 100 },
  { id: 12, title: 'Поставить реакцию', reward: 100 },
  { id: 13, title: 'Зайти в VPN сегодня', reward: 100 },
  { id: 14, title: 'Активировать VPN', reward: 1000, type: 'payment', done: completedTasks.includes(14),
  checkEndpoint: '/api/check-payment' requiresVpn: true },
];

const TasksTab = ({ coins, setCoins }) => {
  const [tasks, setTasks] = useState(() => {
    const saved = localStorage.getItem('tasks');
    return saved ? JSON.parse(saved) : defaultTasks.map(t => ({ ...t, done: false }));
  });

  const [userId, setUserId] = useState(null);
  const [copied, setCopied] = useState(false);
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
        .then(data => setSubscribed(data.subscribed || false));
    }

    const vpn = localStorage.getItem('vpnActivated');
    if (vpn === 'true') setVpnActivated(true);
  }, []);

  const handleCopy = () => {
    const referralLink = `https://t.me/OrdoHereticus_bot?start=${userId}`;
    navigator.clipboard.writeText(referralLink).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  const handleComplete = (task, index) => {
    if (tasks[index].done) return;

    if (task.requiresRef && referrals < task.requiresRef) {
      alert(`Нужно пригласить минимум ${task.requiresRef} друзей. Сейчас: ${referrals}`);
      return;
    }

    if (task.requiresVpn && !vpnActivated) {
      alert('Чтобы выполнить это задание, активируйте VPN в боте.');
      return;
    }

    if (task.requiresSub && !subscribed) {
      alert('Подпишитесь на Telegram-канал, чтобы выполнить задание.');
      return;
    }

    const updatedTasks = [...tasks];
    updatedTasks[index].done = true;
    setTasks(updatedTasks);
    localStorage.setItem('tasks', JSON.stringify(updatedTasks));

    let total = coins + task.reward;
    if (task.title === 'Активировать VPN') {
      localStorage.setItem('clickMultiplier', '2');
    }

    setCoins(total);
    localStorage.setItem('coins', total.toString());
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

            {!task.done && task.title === 'Активировать VPN' && (
              <div className="referral-box">
                <a
                  href={`https://t.me/OrdoHereticus_bot?start=pay`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="copy-btn"
                >
                  🔒 Активировать VPN
                </a>
                <div style={{ fontSize: '12px', marginTop: '6px', color: '#ccc' }}>
                  После оплаты нажмите «Выполнить»
                </div>
              </div>
            )}
          </span>
          {!task.done && (
            <button onClick={() => handleComplete(task, index)}>Выполнить</button>
          )}
        </div>
      ))}
    </div>
  );
};

export default TasksTab;


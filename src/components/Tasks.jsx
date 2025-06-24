import React, { useState, useEffect } from 'react';
import '../App.css';

const tasksData = [
  { id: 1, title: 'Пригласить 1 друга', reward: 50, requiresRef: 1 },
  { id: 2, title: 'Пригласить 3 друга', reward: 150, requiresRef: 3 },
  { id: 3, title: 'Пригласить 5 друзей', reward: 300, requiresRef: 5 },
  { id: 4, title: 'Подписаться на Telegram', reward: 100 },
  { id: 5, title: 'Подписаться на Instagram', reward: 100 },
  { id: 6, title: 'Рассказать в соцсетях', reward: 200 },
  { id: 7, title: 'Комментировать пост', reward: 100 },
  { id: 8, title: 'Поставить реакцию', reward: 100 },
  { id: 9, title: 'Зайти в VPN сегодня', reward: 100 },
];

function TasksTab({ coins, setCoins }) {
  const [completedTasks, setCompletedTasks] = useState(() => {
    const saved = localStorage.getItem('completedTasks');
    return saved ? JSON.parse(saved) : [];
  });

  const [userId, setUserId] = useState(null);
  const [copied, setCopied] = useState(false);
  const [referrals, setReferrals] = useState(3); // 🔁 заглушка — подставить реальное число с backend

  useEffect(() => {
    const tgUserId = window?.Telegram?.WebApp?.initDataUnsafe?.user?.id;
    if (tgUserId) setUserId(tgUserId);
  }, []);

  const handleCopy = () => {
    const referralLink = `https://t.me/OrdoHereticus_bot?start=${userId}`;
    navigator.clipboard.writeText(referralLink).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  const handleComplete = (task) => {
    if (completedTasks.includes(task.id)) return;

    // 🔐 Проверка условий задания
    if (task.requiresRef && referrals < task.requiresRef) {
      alert(`Вы пригласили ${referrals}, нужно ${task.requiresRef}`);
      return;
    }

    const newCompleted = [...completedTasks, task.id];
    setCompletedTasks(newCompleted);
    setCoins(prev => {
      const updated = prev + task.reward;
      localStorage.setItem('coins', updated.toString());
      return updated;
    });

    localStorage.setItem('completedTasks', JSON.stringify(newCompleted));
  };

  return (
    <div className="main-screen">
      <h2>📋 Задания</h2>
      {tasksData.map((task) => (
        <div key={task.id} className="task-card">
          <span>
            {task.title}
            {completedTasks.includes(task.id) && <span className="done"> ✅</span>}
            {!completedTasks.includes(task.id) && task.title.toLowerCase().includes('пригласить') && userId && (
              <div className="referral-box">
                <code>{`https://t.me/OrdoHereticus_bot?start=${userId}`}</code>
                <button className="copy-btn" onClick={handleCopy}>
                  {copied ? '✅ Скопировано!' : '📋 Скопировать'}
                </button>
              </div>
            )}
          </span>
          {!completedTasks.includes(task.id) && (
            <button onClick={() => handleComplete(task)}>Выполнить</button>
          )}
        </div>
      ))}
    </div>
  );
}

export default TasksTab;

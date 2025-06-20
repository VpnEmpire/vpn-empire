import React, { useState } from 'react';
import './App.css';

const initialTasks = [
  { id: 1, title: 'Пригласить 1 друга', reward: 50 },
  { id: 2, title: 'Пригласить 2 друзей', reward: 100 },
  { id: 3, title: 'Пригласить 3 друзей', reward: 200 },
  { id: 4, title: 'Пригласить 4 друзей', reward: 300 },
  { id: 5, title: 'Пригласить 5 друзей', reward: 400 },
  { id: 6, title: 'Пригласить 6 друзей', reward: 500 },
  { id: 7, title: 'Пригласить 7 друзей', reward: 600 },
  { id: 8, title: '📨 Подписаться на Telegram-канал', reward: 100 },
  { id: 9, title: 'Подписаться на Instagram', reward: 100 },
  { id: 10, title: 'Рассказать о нас в соцсетях', reward: 100 },
  { id: 11, title: 'Оставить комментарий под постом', reward: 50 },
  { id: 12, title: 'Поставить реакцию на запись', reward: 50 },
  { id: 13, title: 'Заходить в VPN каждый день', reward: 100 },
];

function Tasks({ onComplete }) {
  const [tasks, setTasks] = useState(initialTasks);
  const [completed, setCompleted] = useState([]);

  const handleComplete = (taskId, reward) => {
    if (!completed.includes(taskId)) {
      setCompleted([...completed, taskId]);
      onComplete(reward);

      // Повтор задания после 5 секунд
      setTimeout(() => {
        setCompleted(prev => prev.filter(id => id !== taskId));
      }, 5000);
    }
  };

  return (
    <div className="tasks-container">
      <h2>🎯 Задания</h2>
      {tasks.map(task => (
        <div
          key={task.id}
          className={`task-card ${completed.includes(task.id) ? 'completed' : ''}`}
          onClick={() => handleComplete(task.id, task.reward)}
        >
          {task.title} — +{task.reward} монет
        </div>
      ))}
    </div>
  );
}

export default Tasks; 

  return (
    <div className="tasks-container">
      <h2>📋 Задания</h2>
      <div className="task-list">
        {initialTasks.map(task => ( 

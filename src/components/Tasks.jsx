import React, { useState, useEffect } from 'react';
import '../App.css';

const tasksData = [
  { id: 1, title: 'Пригласить 1 друга', reward: 50 },
  { id: 2, title: 'Пригласить 3 друга', reward: 150 },
  { id: 3, title: 'Пригласить 5 друзей', reward: 300 },
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

  const handleComplete = (taskId, reward) => {
    if (completedTasks.includes(taskId)) return;

    const newCompleted = [...completedTasks, taskId];
    setCompletedTasks(newCompleted);
    localStorage.setItem('completedTasks', JSON.stringify(newCompleted));

    const newCoins = coins + reward;
    setCoins(newCoins);
    localStorage.setItem('coins', newCoins.toString());
  };

  return (
    <div>
      <h2>🎯 ЕЖЕДНЕВНЫЕ ЗАДАНИЯ</h2>
      {tasksData.map((task) => (
        <div key={task.id} className="task-card">
          <span>{task.title}</span>
          {completedTasks.includes(task.id) ? (
            <span className="done">✔</span>
          ) : (
            <button onClick={() => handleComplete(task.id, task.reward)}>
              +{task.reward}
            </button>
          )}
        </div>
      ))}
    </div>
  );
}

export default TasksTab;


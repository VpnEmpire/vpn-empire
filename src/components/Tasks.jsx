import { useEffect, useState } from 'react';

const TASKS_TEMPLATE = [
  { id: 'ref1', title: 'Пригласить 1 друга', reward: 50 },
  { id: 'ref2', title: 'Пригласить 2 друзей', reward: 100 },
  { id: 'ref3', title: 'Пригласить 3 друзей', reward: 200 },
  { id: 'ref4', title: 'Пригласить 4 друзей', reward: 300 },
  { id: 'ref5', title: 'Пригласить 5 друзей', reward: 400 },
  { id: 'ref6', title: 'Пригласить 6 друзей', reward: 500 },
  { id: 'ref7', title: 'Пригласить 7 друзей', reward: 600 },
  { id: 'tg', title: '📨 Подписаться на Telegram-канал', reward: 100, link: 'https://t.me/OrdoHereticusVPN' },
  { id: 'ig', title: 'Подписаться на Instagram', reward: 100, link: 'https://www.instagram.com/internet.bot.001?igsh=MXRhdzRhdmc1aGhybg==' },
  { id: 'share', title: 'Рассказать о нас в соцсетях', reward: 100 },
  { id: 'comment', title: 'Оставить комментарий под постом', reward: 50 },
  { id: 'react', title: 'Поставить реакцию на запись', reward: 50 },
  { id: 'daily', title: 'Заходить в VPN каждый день', reward: 100, repeatable: true }
];

const Tasks = ({ coins, setCoins }) => {
  const [tasks, setTasks] = useState([]);

  useEffect(() => {
    const savedTasks = JSON.parse(localStorage.getItem('tasks'));
    const today = new Date().toDateString();
    const lastTaskDate = localStorage.getItem('lastTaskDate');

    if (!savedTasks || lastTaskDate !== today) {
      const reset = TASKS_TEMPLATE.map(t => ({
        ...t,
        completed: false
      }));
      localStorage.setItem('tasks', JSON.stringify(reset));
      localStorage.setItem('lastTaskDate', today);
      setTasks(reset);
    } else {
      setTasks(savedTasks);
    }
  }, []);

  const completeTask = (taskId) => {
    const updatedTasks = tasks.map(task =>
      task.id === taskId ? { ...task, completed: true } : task
    );
    setTasks(updatedTasks);
    localStorage.setItem('tasks', JSON.stringify(updatedTasks));
    const reward = TASKS_TEMPLATE.find(t => t.id === taskId)?.reward || 0;
    const newCoins = coins + reward;
    setCoins(newCoins);
    localStorage.setItem('coins', newCoins.toString());
  };

  return (
    <div>
      <h2>🎯 Задания</h2>
      {tasks.map(task => (
        <div key={task.id} className="task-card">
          <span>{task.title}</span>
          {task.completed ? (
            <span className="done">✅</span>
          ) : (
            <button onClick={() => completeTask(task.id)}>
              {task.link ? (
                <a href={task.link} target="_blank" rel="noreferrer">Выполнить</a>
              ) : 'Выполнить'}
            </button>
          )}
        </div>
      ))}
    </div>
  );
};

export default Tasks;

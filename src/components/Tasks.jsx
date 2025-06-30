import React from 'react';
import './Tasks.css';

const Tasks = ({ tasks, referrals, completeTask }) => {
  return (
    <div className="tasks-tab">
      <h2>📋 Задания</h2>

      {tasks.map(task => (
        <div key={task.key} className={`task-card ${task.done ? 'completed' : ''}`}>
          <h3>{task.label}</h3>

          {task.requiresReferralCount && (
            <p>👥 {Math.min(referrals, task.requiresReferralCount)}/{task.requiresReferralCount} друзей</p>
          )}

          <p>🎁 Награда: {task.reward} монет</p>

          {!task.done ? (
            <button
              onClick={(e) => {
                e.stopPropagation();
                completeTask(task);
              }}
            >
              Выполнить
            </button>
          ) : (
            <span className="done">✅ Выполнено</span>
          )}
        </div>
      ))}

      <div className="task-card disabled-task">
        <span>🧩 <strong>Скоро новое задание</strong> — ⏳ Ожидай обновлений</span>
      </div>
    </div>
  );
};

export default Tasks;

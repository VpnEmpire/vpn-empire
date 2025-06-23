import React from 'react';
import '../App.css';

const TasksTab = ({ tasks, completedTasks, handleComplete }) => {
  return (
    <div className="tasks-tab">
      <h2 style={{ color: 'white' }}>🎯 Ежедневные задания</h2>
      {tasks.map((task) => (
        <div className="task-card" key={task.id}>
          <span>{task.text}</span>
          {completedTasks.includes(task.id) ? (
            <span className="done">✓</span>
          ) : (
            <button onClick={() => handleComplete(task.id)}>Выполнить</button>
          )}
        </div>
      ))}
    </div>
  );
};

export default TasksTab;


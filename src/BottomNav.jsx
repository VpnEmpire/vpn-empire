import './BottomNav.css';

const BottomNav = ({ currentTab, setCurrentTab }) => {
  return (
    <div className="bottom-nav">
      <div className={currentTab === 'home' ? 'active' : ''} onClick={() => setCurrentTab('home')}>
        <span role="img" aria-label="home">🏠</span>
        <div>Главная</div>
      </div>
      <div className={currentTab === 'roulette' ? 'active' : ''} onClick={() => setCurrentTab('roulette')}>
        <span role="img" aria-label="roulette">🎰</span>
        <div>Рулетка</div>
      </div>
      <div className={currentTab === 'tasks' ? 'active' : ''} onClick={() => setCurrentTab('tasks')}>
        <span role="img" aria-label="tasks">📋</span>
        <div>Задания</div>
      </div>
      <div className={currentTab === 'top' ? 'active' : ''} onClick={() => setCurrentTab('top')}>
        <span role="img" aria-label="top">🏆</span>
        <div>Топ</div>
      </div>
    </div>
  );
};

export default BottomNav;

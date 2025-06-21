import './BottomNav.css';

const BottomNav = ({ currentTab, setCurrentTab }) => {
  return (
    <div className="bottom-nav">
      <div
        className={`nav-item ${currentTab === 'home' ? 'active' : ''}`}
        onClick={() => setCurrentTab('home')}
      >
        <span role="img" aria-label="home">🏠</span>
        <div className="label">Главная</div>
      </div>

      <div
        className={`nav-item ${currentTab === 'roulette' ? 'active' : ''}`}
        onClick={() => setCurrentTab('roulette')}
      >
        <span role="img" aria-label="roulette">🎰</span>
        <div className="label">Рулетка</div>
      </div>

      <div
        className={`nav-item ${currentTab === 'tasks' ? 'active' : ''}`}
        onClick={() => setCurrentTab('tasks')}
      >
        <span role="img" aria-label="tasks">📋</span>
        <div className="label">Задания</div>
      </div>

      <div
        className={`nav-item ${currentTab === 'top' ? 'active' : ''}`}
        onClick={() => setCurrentTab('top')}
      >
        <span role="img" aria-label="top">🏆</span>
        <div className="label">Топ</div>
      </div>

      <div
        className={`nav-item ${currentTab === 'profile' ? 'active' : ''}`}
        onClick={() => setCurrentTab('profile')}
      >
        <span role="img" aria-label="profile">👤</span>
        <div className="label">Профиль</div>
      </div>
    </div>
  );
};

export default BottomNav;

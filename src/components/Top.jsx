import React, { useEffect, useState } from 'react';
import './Top.css'; 

const TopTab = () => {
  const [topPlayers, setTopPlayers] = useState([]);
  const [userId, setUserId] = useState(null);
  const [userCoins, setUserCoins] = useState(0);

  useEffect(() => {
    const fetchTop = async () => {
      try {
        const response = await fetch('/api/top');
        const result = await response.json();
        if (result.top) {
          setTopPlayers(result.top);
        }
      } catch (error) {
        console.error('Ошибка при загрузке топа:', error);
      }
    };

    const storedUserId = localStorage.getItem('user_id');
    const storedCoins = localStorage.getItem('coins');
    setUserId(storedUserId);
    if (storedCoins) setUserCoins(parseInt(storedCoins));

    fetchTop();
  }, []);

  return (
    <div className="top-container">
      <h2 className="top-title">🏆 ТОП ИГРОКОВ</h2>
      <div className="top-list">
        {topPlayers.length === 0 && (
          <img src={robotImage} alt="robot" className="top-robot" />
        )}
        {topPlayers.map((player, index) => {
          const isCurrentUser = player.user_id === userId;
          const displayCoins = isCurrentUser ? userCoins : player.coins;

          return (
            <div
              key={player.user_id}
              className={`top-card ${isCurrentUser ? 'top-card-current' : ''}`}
            >
              <div className="top-rank">#{index + 1}</div>
              <img src={robotImage} alt="robot" className="top-avatar" />
              <div className="top-info">
                <div className="top-user">ID: {player.user_id}</div>
                <div className="top-coins">💰 {displayCoins} монет</div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default TopTab;
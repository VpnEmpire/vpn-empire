import React, { useEffect, useState } from 'react';
import './Top.css';

function Top({ username }) {
  const [topPlayers, setTopPlayers] = useState([]);
  const localUserId = localStorage.getItem('user_id');
  const localCoins = parseInt(localStorage.getItem('coins')) || 0;

  useEffect(() => {
    const fetchTop = async () => {
      try {
        const response = await fetch('/api/top');
        const result = await response.json();
        const data = result.top || [];

        // Добавляем текущего пользователя в список, если его ещё нет
        const alreadyExists = data.some(p => p.user_id === localUserId);
        if (!alreadyExists && localUserId) {
          data.push({ user_id: localUserId, coins: localCoins });
        }

        const sorted = [...data]
          .sort((a, b) => b.coins - a.coins)
          .slice(0, 10);

        setTopPlayers(sorted);
      } catch (err) {
        console.error('❌ Ошибка загрузки топа:', err);
      }
    };

    fetchTop();
  }, []);

  const allPlayers = topPlayers.map((player, index) => {
    const isCurrentUser = player.user_id === localUserId;
    return {
      name: isCurrentUser ? username?.trim() || 'Ты' : `Игрок ${index + 1}`,
      coins: isCurrentUser ? localCoins : player.coins,
      color:
        index === 0
          ? 'gold'
          : index === 1
          ? 'blue'
          : index === 2
          ? 'silver'
          : isCurrentUser
          ? 'cyan'
          : 'purple'
    };
  });

  return (
    <div className="top-container">
      <h2 className="top-title">🏆 ТОП ИГРОКОВ</h2>
      <img src="/robot.png" alt="Робот" className="top-robot" />
      <div className="top-list">
        {allPlayers.map((player, index) => (
          <div key={index} className={`top-player ${player.color}`}>
            <div className="rank-number">{index + 1}</div>
            <div className="player-name">{player.name}</div>
            <div className="player-coins">
              <img src="/trophy.png" alt="Кубок" className="trophy-icon" />
              {player.coins}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Top;

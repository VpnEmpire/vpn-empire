import React, { useEffect, useState } from 'react';
import './Top.css';

function Top({ username }) {
  const [topPlayers, setTopPlayers] = useState([]);

  useEffect(() => {
    const fetchTop = async () => {
      try {
        const res = await fetch('/api/top');
        const json = await res.json();
        const data = json.top || [];

        const localUserId = localStorage.getItem('user_id');
        const localCoins = parseInt(localStorage.getItem('coins')) || 0;
        const alreadyInTop = data.find(p => p.user_id === localUserId);

        if (!alreadyInTop && localUserId) {
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

  const currentUserId = localStorage.getItem('user_id');

  const allPlayers = topPlayers.map((player, index) => ({
    name:
      player.user_id === currentUserId
        ? username?.trim() || 'Ты'
        : `Player ${index + 1}`,
    coins:
      player.user_id === currentUserId
        ? parseInt(localStorage.getItem('coins')) || 0
        : player.coins,
    color:
      index === 0
        ? 'gold'
        : index === 1
        ? 'blue'
        : index === 2
        ? 'silver'
        : player.user_id === currentUserId
        ? 'cyan'
        : 'purple'
  }));

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
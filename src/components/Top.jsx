import React, { useEffect, useState } from 'react';
import './Top.css';

function Top({ username }) {
  const [topPlayers, setTopPlayers] = useState([]);

  useEffect(() => {
    fetch('/api/top')
      .then(res => res.json())
      .then(data => {
        if (data?.top) {
          const localUserId = localStorage.getItem('user_id');
          const localCoins = parseInt(localStorage.getItem('coins')) || 0;

          // Заменяем монеты для текущего пользователя из localStorage
          const updatedList = data.top.map(player => {
            if (player.user_id === localUserId) {
              return {
                ...player,
                coins: localCoins,
                name: username?.trim() || 'Ты',
                color: 'cyan'
              };
            }
            return {
              ...player,
              name: `Player`,
              color: 'purple'
            };
          });

          const isUserIncluded = updatedList.some(p => p.user_id === localUserId);
          if (!isUserIncluded && localUserId) {
            updatedList.push({
              user_id: localUserId,
              coins: localCoins,
              name: username?.trim() || 'Ты',
              color: 'cyan'
            });
          }

          const sorted = updatedList.sort((a, b) => b.coins - a.coins).slice(0, 10);
          setTopPlayers(sorted);
        }
      })
      .catch(err => {
        console.error('Ошибка при загрузке топа:', err);
      });
  }, [username]);

  return (
    <div className="top-container">
      <h2 className="top-title">🏆 ТОП ИГРОКОВ</h2>
      <img src="/robot.png" alt="Робот" className="top-robot" />
      <div className="top-list">
        {topPlayers.map((player, index) => (
          <div key={index} className={`top-player ${player.color || ''}`}>
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
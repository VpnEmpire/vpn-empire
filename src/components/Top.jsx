import React, { useEffect, useState } from 'react';
import './Top.css';

function Top() {
  const [topPlayers, setTopPlayers] = useState([]);
  const userCoins = parseInt(localStorage.getItem('coins')) || 0;
  const userId = localStorage.getItem('user_id');
  const username = 'Ты';

  useEffect(() => {
    const fetchTop = async () => {
      try {
        const response = await fetch('/api/top');
        const result = await response.json();
        if (result.top) {
          let players = result.top.map(player => ({
            name: player.user_id,
            coins: player.coins,
            color: 'blue',
          }));

          // Добавим текущего пользователя
          const currentUser = {
            name: username,
            coins: userCoins,
            color: 'cyan',
            user_id: userId,
          };

          // Если пользователь уже есть в списке — заменим
          const existingIndex = players.findIndex(p => p.user_id === userId);
          if (existingIndex !== -1) {
            players[existingIndex] = currentUser;
          } else {
            players.push(currentUser);
          }

          const sorted = players
            .sort((a, b) => b.coins - a.coins)
            .slice(0, 10);

          setTopPlayers(sorted);
        }
      } catch (error) {
        console.error('Ошибка загрузки топа:', error);
      }
    };

    fetchTop();
  }, []);

  return (
    <div className="top-container">
      <h2 className="top-title">🏆 ТОП ИГРОКОВ</h2>
      <img src="/robot.png" alt="Робот" className="top-robot" />
      <div className="top-list">
        {topPlayers.map((player, index) => (
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
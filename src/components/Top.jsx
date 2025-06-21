import React from 'react';
import './Top.css';

const fakePlayers = [
  { name: 'Player1', coins: 1500, color: 'gold' },
  { name: 'Player2', coins: 1200, color: 'blue' },
  { name: 'Player4', coins: 800, color: 'purple' }
];

function Top() {
  // Получаем монеты пользователя
  const userCoins = parseInt(localStorage.getItem('coins')) || 0;

  // Создаём объект текущего игрока
  const currentUser = { name: 'Ты', coins: userCoins, color: 'cyan' };

  // Объединяем всех игроков
  const allPlayers = [...fakePlayers, currentUser];

  // Сортировка по монетам и отбор топ-10
  const sorted = allPlayers.sort((a, b) => b.coins - a.coins).slice(0, 10);

  return (
    <div className="top-container">
      <h2 className="top-title">🏆 ТОП ИГРОКОВ</h2>
      <img src="/robot.png" alt="Робот" className="top-robot" />
      <div className="top-list">
        {sorted.map((player, index) => (
          <div key={index} className={`top-player ${player.color}`}>
            <div className="rank-number">{index + 1}</div>
            <div className="player-name">{player.name}</div>
            <div className="player-coins">
              <img src="/trophy.png" alt="Кубок" className="trophy-icon" /> {player.coins}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Top;

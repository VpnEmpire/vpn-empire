import React from 'react';
import './Top.css';

const realPlayer = {
  name: 'Ты', // можно подставить username из Telegram позже
  coins: parseInt(localStorage.getItem('coins')) || 0,
  color: 'silver'
};

const fakePlayers = [
  { name: 'Player1', coins: 1500, color: 'gold' },
  { name: 'Player2', coins: 1200, color: 'blue' },
  { name: 'Player3', coins: 1000, color: 'purple' },
];

const allPlayers = [...fakePlayers, realPlayer]
  .sort((a, b) => b.coins - a.coins)
  .slice(0, 10); // максимум 10 игроков

function Top() {
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
              <img src="/trophy.png" alt="Кубок" className="trophy-icon" /> {player.coins}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Top;

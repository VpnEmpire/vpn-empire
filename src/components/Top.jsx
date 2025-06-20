// src/components/Top.jsx
import React from 'react';
import './Top.css';

const mockTopPlayers = [
  { name: 'Player1', coins: 1500 },
  { name: 'Player2', coins: 1200 },
  { name: 'Player4', coins: 800 }
];

const Top = () => {
  return (
    <div className="top-container">
      <h2>🏆 ТОП ИГРОКОВ</h2>
      <div className="robot-image">
        <img src="/robot.png" alt="Робот" />
      </div>

      <div className="leaderboard">
        {mockTopPlayers.map((player, index) => (
          <div key={index} className={`player-card rank-${index + 1}`}>
            <div className="rank-number">{index + 1}</div>
            <div className="player-info">
              <span className="player-name">{player.name}</span>
              <span className="player-coins">🏆 {player.coins}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Top;


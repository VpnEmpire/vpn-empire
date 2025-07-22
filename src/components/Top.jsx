import React, { useEffect, useState } from 'react';
import './Top.css';

function Top({ username }) {
  const [realPlayers, setRealPlayers] = useState([]);
  const userCoins = parseInt(localStorage.getItem('coins')) || 0;
  const currentUserId = localStorage.getItem('user_id') || 'current_user';

  const currentUser = {
    name: username?.trim() || 'Ты',
    user_id: currentUserId,
    coins: userCoins,
    color: 'cyan'
  };

  useEffect(() => {
    async function fetchRealPlayers() {
      try {
        const res = await fetch('/api/top');
        if (!res.ok) throw new Error('Ошибка сети при загрузке топа');
        const data = await res.json();
        setRealPlayers(data.players || []);
      } catch (error) {
        console.error('Ошибка загрузки топа:', error);
      }
    }
    fetchRealPlayers();

    const interval = setInterval(fetchRealPlayers, 7200000);
    return () => clearInterval(interval);
  }, []);

  // Используем реальные имена и цвета без замены
  let allPlayers = realPlayers.map(p => ({
  name: p.name || `Пользователь ${p.user_id}`, // p.name, если есть
  coins: p.coins,
  user_id: p.user_id,
  color: 'blue' // фиксируем синий цвет, если нет данных
}));

  const currentInList = allPlayers.some(p => p.user_id === currentUser.user_id);

  if (!currentInList) {
    allPlayers = [...allPlayers, currentUser];
  }

  const sorted = allPlayers.sort((a, b) => b.coins - a.coins).slice(0, 10);

  return (
    <div className="top-container">
      <h2 className="top-title">🏆 ТОП ИГРОКОВ</h2>
      <img src="/robot.png" alt="Робот" className="top-robot" />
      <div className="top-list">
        {sorted.map((player, index) => (
          <div key={player.user_id || index} className={`top-player ${player.color}`}>
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

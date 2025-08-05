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

    const interval = setInterval(fetchRealPlayers, 300000);
    return () => clearInterval(interval);
  }, []);

  // Копируем список игроков из Supabase
  let allPlayers = realPlayers.map(p => ({
    ...p,
    name: p.name || `Пользователь ${p.user_id}`,
    color: p.color || 'blue'
  }));

  // Находим текущего игрока в списке
  const currentIndex = allPlayers.findIndex(p => p.user_id === currentUser.user_id);

  if (currentIndex !== -1) {
    // Заменяем монеты текущего игрока на актуальные из localStorage
    allPlayers[currentIndex] = {
      ...allPlayers[currentIndex],
      coins: currentUser.coins,
      name: currentUser.name,
      color: currentUser.color
    };
  } else {
    // Если текущего игрока нет в списке, добавляем его
    allPlayers.push(currentUser);
  }

  // Сортируем и берём топ 10
  const sorted = allPlayers.sort((a, b) => b.coins - a.coins).slice(0, 10);

// Определяем, входит ли текущий пользователь в топ
  const isCurrentInTop = sorted.some(p => p.user_id === currentUser.user_id);

  // Определяем место текущего игрока
  const currentUserRank = sortedAll.findIndex(p => p.user_id === currentUser.user_id) + 1;
  
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

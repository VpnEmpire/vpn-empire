import React, { useEffect, useState } from 'react';

export default function Top() {
  const [players, setPlayers] = useState([]);
  const [currentUserId, setCurrentUserId] = useState(null);

  useEffect(() => {
    const userId = localStorage.getItem('user_id');
    setCurrentUserId(userId);

    async function fetchTopFromAPI() {
      try {
        const res = await fetch('/api/top');
        if (!res.ok) throw new Error('Ошибка сети при загрузке топа');
        const json = await res.json();
        setPlayers(json.players);
      } catch (error) {
        console.error('Ошибка при загрузке топа:', error);
      }
    }

    fetchTopFromAPI();

    const interval = setInterval(fetchTopFromAPI, 7200000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div style={{ padding: 20 }}>
      <h2>Топ игроков</h2>
      <ol>
        {players.map((player, index) => (
          <li
            key={player.user_id}
            style={{
              fontWeight: player.user_id === currentUserId ? 'bold' : 'normal',
              color: player.user_id === currentUserId ? '#007bff' : 'inherit',
            }}
          >
            <span>#{index + 1} </span>
            <span>{player.user_id === currentUserId ? 'Ты' : `Пользователь ${player.user_id}`}</span>
            <span> — Монет: {player.coins ?? 0}</span>
          </li>
        ))}
      </ol>
    </div>
  );
}

import React, { useEffect, useState } from 'react';

export default function TopTab({ userId }) {
  const [players, setPlayers] = useState([]);

  useEffect(() => {
    async function fetchPlayers() {
      try {
        const res = await fetch('/api/top');
        if (!res.ok) throw new Error('Ошибка сети при загрузке топа');
        const data = await res.json();
        setPlayers(data.players);
      } catch (error) {
        console.error('Ошибка загрузки топа:', error);
      }
    }
    fetchPlayers();

    // Обновлять топ каждые 2 часа
    const interval = setInterval(fetchPlayers, 7200000);
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
              fontWeight: player.user_id === userId ? 'bold' : 'normal',
              color: player.user_id === userId ? '#007bff' : 'inherit',
            }}
          >
            <span>#{index + 1} </span>
            <span>{player.user_id === userId ? 'Ты' : `Пользователь ${player.user_id}`}</span>
            <span> — Монет: {player.coins ?? 0}</span>
          </li>
        ))}
      </ol>
    </div>
  );
}

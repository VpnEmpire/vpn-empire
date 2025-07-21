import React, { useEffect, useState } from 'react';
import './Top.css';

// ВАЖНО: supabase импортируем прямо здесь
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_KEY
);

function Top({ username }) {
  const [topPlayers, setTopPlayers] = useState([]);

  useEffect(() => {
    const fetchPlayers = async () => {
      const { data, error } = await supabase
        .from('users')
        .select('user_id, coins')
        .order('coins', { ascending: false })
        .limit(50);

      if (error) {
        console.error('❌ Ошибка загрузки топа:', error.message);
        return;
      }

      const localUserId = localStorage.getItem('user_id');
      const localCoins = parseInt(localStorage.getItem('coins')) || 0;

      const alreadyInList = data.find(p => p.user_id === localUserId);
      if (!alreadyInList && localUserId) {
        data.push({ user_id: localUserId, coins: localCoins });
      }

      const sorted = [...data].sort((a, b) => b.coins - a.coins).slice(0, 10);
      setTopPlayers(sorted);
    };

    fetchPlayers();
  }, []);

  const currentUserId = localStorage.getItem('user_id');

  const allPlayers = topPlayers.map((player, index) => ({
    name:
      player.user_id === currentUserId
        ? username?.trim() || 'Ты'
        : `Player ${index + 1}`,
    coins: player.coins,
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
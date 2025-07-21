import React, { useEffect, useState } from 'react';
import './Top.css';
import supabase from '../supabaseClient';

function Top({ username }) {
  const [topPlayers, setTopPlayers] = useState([]);
  const userCoins = parseInt(localStorage.getItem('coins')) || 0;
  const userId = localStorage.getItem('user_id') || '';
  const currentUserName = username?.trim() || 'Ты';

  useEffect(() => {
    const fetchTopPlayers = async () => {
      const { data, error } = await supabase
        .from('users')
        .select('user_id, coins')
        .order('coins', { ascending: false })
        .limit(10);

      if (error) {
        console.error('Ошибка при загрузке топ игроков:', error);
        return;
      }

      const formatted = data.map((player, index) => ({
        name: player.user_id === userId ? currentUserName : player.user_id,
        coins: player.coins,
        isCurrentUser: player.user_id === userId,
      }));

      const isInTop = formatted.some(p => p.isCurrentUser);
      if (!isInTop) {
        formatted.push({
          name: currentUserName,
          coins: userCoins,
          isCurrentUser: true,
        });
      }

      const sorted = formatted.sort((a, b) => b.coins - a.coins).slice(0, 10);
      setTopPlayers(sorted);
    };

    fetchTopPlayers();
  }, [userId, userCoins]);

  return (
    <div className="top-container">
      <h2 className="top-title">🏆 ТОП ИГРОКОВ</h2>
      <img src="/robot.png" alt="Робот" className="top-robot" />
      <div className="top-list">
        {topPlayers.map((player, index) => (
          <div key={index} className={`top-player ${player.isCurrentUser ? 'cyan' : ''}`}>
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
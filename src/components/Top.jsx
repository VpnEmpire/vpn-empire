import React, { useEffect, useState } from 'react';
import './Top.css';
import supabase from '../supabaseClient';

function Top({ username }) {
  const [topPlayers, setTopPlayers] = useState([]);
  const userId = localStorage.getItem('user_id') || '';
  const currentUserName = username?.trim() || 'Ты';

  useEffect(() => {
    const fetchTopPlayers = async () => {
      const { data, error } = await supabase
        .from('users')
        .select('user_id, coins')
        .order('coins', { ascending: false })
        .limit(10);

console.log('🟢 Supabase ответ:', data);
  if (error) {
    console.error('❌ Ошибка Supabase:', error);
    return;
  }

      if (error) {
        console.error('Ошибка при загрузке топ игроков:', error);
        return;
      }

      const formatted = data.map((player, index) => ({
        name: player.user_id === userId ? currentUserName : player.user_id,
        coins: player.coins,
        isCurrentUser: player.user_id === userId,
      }));

      setTopPlayers(formatted);
    };

    fetchTopPlayers();
  }, [userId]);

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

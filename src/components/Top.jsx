import React, { useEffect, useState } from 'react';
import './Top.css';
import supabase from '../supabaseClient';

function Top({ username }) {
  const [topPlayers, setTopPlayers] = useState([]);
  const [myCoins, setMyCoins] = useState(0);
  const userId = localStorage.getItem('user_id') || '';
  const currentUserName = username?.trim() || 'Ты';

  useEffect(() => {
    const fetchData = async () => {
      const { data, error } = await supabase
        .from('users')
        .select('user_id, coins')
        .order('coins', { ascending: false });

      if (error) {
        console.error('❌ Ошибка при загрузке топа:', error.message);
        return;
      }

      const formatted = data.map(player => ({
        name: player.user_id === userId ? currentUserName : player.user_id,
        coins: player.coins,
        isCurrentUser: player.user_id === userId,
      }));

      const my = formatted.find(p => p.isCurrentUser);
      if (my) setMyCoins(my.coins);

      const filtered = formatted.filter(p => !p.isCurrentUser);
      setTopPlayers(filtered.slice(0, 100));
    };

    fetchData();
  }, [username]);

  return (
    <div className="top-container">
      <h2 className="top-title">🏆 ТОП ИГРОКОВ</h2>
      <img src="/robot.png" alt="Робот" className="top-robot" />

      <div className="my-coins">
        <strong>Ты:</strong> {myCoins} монет
      </div>

      <div className="top-list">
        {topPlayers.map((player, index) => (
          <div key={index} className="top-player">
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

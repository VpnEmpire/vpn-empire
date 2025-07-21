import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.VITE_SUPABASE_URL,
  process.env.SUPABASE_KEY
);

function Top({ username }) {
  const [topPlayers, setTopPlayers] = useState([]);

  useEffect(() => {
    const fetchTopPlayers = async () => {
      try {
        const { data, error } = await supabase
          .from('users')
          .select('user_id, coins')
          .order('coins', { ascending: false })
          .limit(50); // ✅ лимит 50

        if (error) throw error;
        if (data) setTopPlayers(data);
      } catch (err) {
        console.error('❌ Ошибка при загрузке топа:', err.message);
      }
    };

    fetchTopPlayers();
  }, []);

  const storedUserId = localStorage.getItem('user_id');
  const currentUserCoins = parseInt(localStorage.getItem('coins')) || 0;

  const playersWithNames = topPlayers.map((player) => ({
    name: player.user_id === storedUserId ? 'Ты' : `ID ${player.user_id?.slice(-4) || '0000'}`,
    coins: player.coins,
    color: player.user_id === storedUserId ? 'cyan' : 'gray'
  }));

  return (
    <div className="top-container">
      <h2 className="top-title">🏆 ТОП ИГРОКОВ</h2>
      <img src="/robot.png" alt="Робот" className="top-robot" />
      <div className="top-list">
        {playersWithNames.map((player, index) => (
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

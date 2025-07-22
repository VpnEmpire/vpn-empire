import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.VITE_SUPABASE_URL,
  process.env.SUPABASE_KEY
);

export default async function handler(req, res) {
  try {
    const { data, error } = await supabase
      .from('users')
      .select('user_id, coins, color') // добавь name и color, если есть
      .order('coins', { ascending: false })
      .limit(50);

    if (error) {
      console.error('Ошибка Supabase:', error);
      return res.status(500).json({ error: 'Ошибка при получении топа' });
    }

    return res.status(200).json({ players: data }); // Ключ должен быть players
  } catch (err) {
    console.error('❌ Ошибка при получении топа:', err);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
}

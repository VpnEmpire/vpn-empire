import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.VITE_SUPABASE_URL,
  process.env.SUPABASE_KEY
);

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Метод не поддерживается' });
  }

  const { user_id } = req.body;
  if (!user_id) {
    return res.status(400).json({ error: 'Не указан user_id' });
  }

  try {
    const { data, error } = await supabase
      .from('users')
      .select('coins')
      .eq('user_id', user_id)
      .maybeSingle();

    if (error || !data) {
      return res.status(404).json({ error: 'Пользователь не найден' });
    }

    return res.status(200).json({ coins: data.coins });
  } catch (e) {
    return res.status(500).json({ error: 'Ошибка сервера' });
  }
}

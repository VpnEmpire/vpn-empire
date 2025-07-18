import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.VITE_SUPABASE_URL,
  process.env.SUPABASE_KEY
);

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Метод не поддерживается. Используй POST.' });
  }

  const { user_id, channel } = req.body;

  if (!user_id || !channel) {
    return res.status(400).json({ error: 'Отсутствует user_id или channel' });
  }

  try {
    const { data, error } = await supabase
      .from('subscriptions')
      .upsert(
        {
          user_id,
          channel,
          is_subscribed: true,
          created_at: new Date().toISOString(),
        },
        { onConflict: ['user_id', 'channel'] } // чтобы обновлялось, если уже есть
      );

    if (error) {
      console.error('Ошибка добавления подписки:', error.message);
      return res.status(500).json({ success: false, error: 'Ошибка записи в Supabase' });
    }

    return res.status(200).json({ success: true, message: 'Подписка добавлена/обновлена' });
  } catch (e) {
    console.error('Ошибка сервера:', e);
    return res.status(500).json({ success: false, error: 'Внутренняя ошибка' });
  }
}

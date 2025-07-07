import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.VITE_SUPABASE_URL,
  process.env.SUPABASE_KEY
);

export default async function handler(req, res) {
  const { user_id, task_key } = req.query;

  if (!user_id || !task_key) {
    return res.status(400).json({ success: false, error: 'Отсутствует user_id или task_key' });
  }

  // Определим канал по ключу задания
  let channel = '';
  if (task_key === 'subscribeTelegram') channel = 'telegram';
  else if (task_key === 'subscribeInstagram') channel = 'instagram';
  else return res.status(400).json({ success: false, error: 'Неверный task_key' });

  try {
    const { data, error } = await supabase
      .from('subscriptions')
      .select('*')
      .eq('user_id', user_id)
      .eq('channel', channel)
      .eq('is_subscribed', true)
      .limit(1);

    if (error) {
      console.error('Ошибка Supabase:', error);
      return res.status(500).json({ success: false });
    }

    const isSubscribed = data && data.length > 0;
    return res.status(200).json({ success: isSubscribed });
  } catch (err) {
    console.error('❌ Ошибка проверки подписки:', err);
    return res.status(500).json({ success: false });
  }
}

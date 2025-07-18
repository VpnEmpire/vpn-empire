import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.VITE_SUPABASE_URL,
  process.env.SUPABASE_KEY
);

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).send('Method Not Allowed');

  const { user_id } = req.body;

  if (!user_id) {
    return res.status(400).json({ error: 'user_id обязателен' });
  }

  try {
    const { count, error } = await supabase
      .from('referrals')
      .select('*', { count: 'exact', head: true })
      .eq('referral_id', user_id);

    if (error) {
      console.error('❌ Supabase error:', error);
      return res.status(500).json({ error: 'Ошибка при проверке рефералов' });
    }

    return res.status(200).json({ count: count || 0 });
  } catch (err) {
    console.error('❌ Ошибка сервера:', err);
    return res.status(500).json({ error: 'Серверная ошибка' });
  }
}

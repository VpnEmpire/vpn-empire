import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.VITE_SUPABASE_URL,
  process.env.SUPABASE_KEY
);

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, error: 'Метод не поддерживается' });
  }

  const { user_id, referral_id } = req.body;

  if (!user_id || !referral_id || user_id === referral_id) {
    return res.status(400).json({ success: false, error: 'Неверные параметры' });
  }

  try {
    // Проверим, не существует ли уже такой записи
    const { data: existing, error: fetchError } = await supabase
      .from('referrals')
      .select('*')
      .eq('user_id', user_id)
      .eq('referred_id', referred_id)
      .maybeSingle();

    if (fetchError) {
      return res.status(500).json({ success: false, error: 'Ошибка поиска' });
    }

    if (existing) {
      return res.status(200).json({ success: true, message: 'Реферал уже существует' });
    }

    // Добавляем новую запись
    const { error } = await supabase
      .from('referrals')
      .insert([{ user_id, referred_id }]);

    if (error) {
      console.error('❌ Ошибка вставки:', error);
      return res.status(500).json({ success: false });
    }

    return res.status(200).json({ success: true });
  } catch (err) {
    console.error('❌ Ошибка сервера:', err);
    return res.status(500).json({ success: false });
  }
}

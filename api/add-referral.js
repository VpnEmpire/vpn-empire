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
      .eq('referral_id', referral_id)
      .maybeSingle();

    if (fetchError) {
      return res.status(500).json({ success: false, error: 'Ошибка поиска' });
    }

    if (existing) {
      return res.status(200).json({ success: true, message: 'Реферал уже существует' });
    }

    // Добавляем новую запись
    const { error: insertError } = await supabase
      .from('referrals')
      .insert([{ user_id, referral_id }]);

    if (insertError) {
    return res.status(500).json({ error: insertError.message });
  }

  // Увеличиваем поле `referrals` на 1 у referral_id
  const { error: updateError } = await supabase
    .from('users')
    .update({ referrals: supabase.raw('referrals + 1') })
    .eq('user_id', referral_id);

  if (updateError) {
    return res.status(500).json({ error: updateError.message });
  }

  // Всё прошло успешно
  res.status(200).json({ message: 'Referral recorded successfully' });
}
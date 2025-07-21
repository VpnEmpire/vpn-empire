// /api/add-referral.js

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
  console.log("📨 Получены параметры:", { user_id, referral_id });

  if (!user_id || !referral_id || user_id === referral_id) {
    return res.status(400).json({ success: false, error: 'Неверные параметры' });
  }

  // 1. Проверим, не существует ли уже такая пара
  const { data: existing, error: fetchError } = await supabase
    .from('referrals')
    .select('id')
    .eq('user_id', user_id)
    .eq('referral_id', referral_id)
    .eq('source', 'game')
    .maybeSingle();

  if (fetchError) {
    console.error('❌ Ошибка при поиске существующего реферала:', fetchError);
    return res.status(500).json({ success: false, error: 'Ошибка поиска' });
  }

  if (existing) {
    console.warn(`⚠️ Реферал уже существует: ${referral_id} → ${user_id}`);
    return res.status(200).json({ success: true, message: 'Реферал уже существует' });
  }

  // 2. Добавим новую запись
  const { error: insertError } = await supabase
    .from('referrals')
    .insert([{ user_id, referral_id, source: 'game' }]);

  if (insertError) {
    console.error('❌ Ошибка при добавлении реферала:', insertError);
    return res.status(500).json({ success: false, error: 'Ошибка вставки' });
  }

   // 3. Получим текущий счётчик у пригласившего
  const { data: userData, error: fetchUserError } = await supabase
    .from('users')
    .select('referrals')
    .eq('user_id', referral_id)
    .maybeSingle();

  if (fetchUserError || !userData) {
    console.error('❌ Ошибка при получении текущего счётчика:', fetchUserError);
    return res.status(500).json({ success: false, error: 'Ошибка получения счётчика' });
  }

  const newCount = (userData.referrals || 0) + 1;

  // 4. Обновим счётчик у пригласившего
  const { error: updateError } = await supabase
    .from('users')
    .update({ referrals: newCount })
    .eq('user_id', referral_id);

  if (updateError) {
    console.error('❌ Ошибка при обновлении счётчика:', updateError);
    return res.status(500).json({ success: false, error: 'Ошибка обновления счётчика' });
  }

  console.log(`✅ Добавлен новый реферал: ${referral_id} → ${user_id}`);
  return res.status(200).json({ success: true, message: 'Referral added successfully' });
}

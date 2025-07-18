// /api/check-referral.js

import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.VITE_SUPABASE_URL,
  process.env.SUPABASE_KEY
);

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).send('Method Not Allowed');

  const { user_id, task_key, required_count } = req.body;

  if (!user_id || !task_key || required_count === undefined) {
    return res.status(400).json({ error: 'user_id, task_key и required_count обязательны' });
  }

  // 🔍 Получим количество приглашённых
  const { count, error } = await supabase
    .from('referrals')
    .select('*', { count: 'exact', head: true })
    .eq('referral_id', user_id);

  if (error) {
    console.error('❌ Ошибка при подсчёте рефералов:', error);
    return res.status(500).json({ error: 'Ошибка при подсчёте рефералов' });
  }

  console.log(`👥 Найдено ${count} приглашённых у ${user_id}`);

  if (count < required_count) {
    console.warn(`⛔ Недостаточно рефералов (${count}/${required_count})`);
    return res.status(200).json({ success: false, invited: count });
  }

  // 🔒 Проверим, не выполнено ли уже это задание
  const { data: existing, error: checkError } = await supabase
    .from('referral_tasks')
    .select('*')
    .eq('user_id', user_id)
    .eq('task_key', task_key)
    .order('created_at', { ascending: false }) // ⬅ как в vpn-проверке
    .limit(1)
    .maybeSingle();

  if (checkError) {
    console.error('❌ Ошибка при проверке выполнения:', checkError);
    return res.status(500).json({ error: 'Ошибка при проверке задания' });
  }

  if (existing) {
    console.warn(`⚠️ Задание ${task_key} уже выполнено`);
    return res.status(200).json({ success: false, alreadyCompleted: true });
  }

  // ✅ Сохраняем выполнение задания
  const { error: insertError } = await supabase
    .from('referral_tasks')
    .insert([{ user_id, task_key }]);

  if (insertError) {
    console.error('❌ Ошибка при сохранении задания:', insertError);
    return res.status(500).json({ error: 'Ошибка при сохранении выполнения' });
  }

  console.log(`✅ Реферальное задание ${task_key} успешно засчитано`);
  return res.status(200).json({ success: true, invited: count });
}

// /api/check-referral.js

import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.VITE_SUPABASE_URL,
  process.env.SUPABASE_KEY
);

export const config = {
  api: {
    bodyParser: {
      sizeLimit: '1mb',
    },
  },
};

export default async function handler(req, res) {
  console.log('📥 [check-referral] Запрос получен');

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Метод не поддерживается. Используй POST.' });
  }

  const { user_id, task_key, required_count } = req.body;
  console.log('🔹 user_id:', user_id);
  console.log('🔹 task_key:', task_key);
  console.log('🔹 required_count:', required_count);

  if (!user_id || !task_key || required_count === undefined) {
    return res.status(400).json({ error: 'Не хватает параметров (user_id, task_key, required_count)' });
  }

  try {
    // 1. Получаем количество приглашённых
    const { count, error: countError } = await supabase
      .from('referrals')
      .select('*', { count: 'exact', head: true })
      .eq('referral_id', user_id) // 👈 Кто пригласил
      .eq('source', 'game');

    if (countError) {
      console.error('❌ Ошибка подсчёта рефералов:', countError.message);
      return res.status(500).json({ success: false, error: 'Ошибка при подсчёте' });
    }

    console.log(`👥 Найдено ${count} приглашённых`);

    // 2. Проверяем, хватает ли рефералов
    if (count < required_count) {
      return res.status(200).json({
        success: false,
        invited: count,
        error: `Недостаточно рефералов: ${count}/${required_count}`,
      });
    }

    // 3. Проверяем, не выполнено ли уже это задание
    const { data: existing, error: existingError } = await supabase
      .from('referral_tasks')
      .select('*')
      .eq('user_id', user_id)
      .eq('task_key', task_key)
      .maybeSingle();

    if (existingError) {
      console.error('❌ Ошибка проверки выполнения:', existingError.message);
      return res.status(500).json({ success: false, error: 'Ошибка Supabase' });
    }

    if (existing) {
      console.warn(`⚠️ Задание ${task_key} уже выполнено`);
      return res.status(200).json({ success: false, alreadyCompleted: true });
    }

    // 4. Сохраняем выполнение задания
    const { error: insertError } = await supabase
      .from('referral_tasks')
      .insert([{ user_id, task_key }]);

    if (insertError) {
      console.error('❌ Ошибка при сохранении выполнения:', insertError.message);
      return res.status(500).json({ success: false, error: 'Не удалось сохранить выполнение' });
    }

    console.log(`✅ Задание ${task_key} успешно засчитано`);
    return res.status(200).json({ success: true, invited: count });

  } catch (e) {
    console.error('❌ Внутренняя ошибка:', e);
    return res.status(500).json({ success: false, error: 'Ошибка сервера' });
  }
}

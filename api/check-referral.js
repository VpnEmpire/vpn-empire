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
      .from('referrals')
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
   const { data: referralData, error: referralFetchError } = await supabase
      .from('users')
      .select('referrals_by')
      .eq('user_id', user_id)
      .maybeSingle();

    if (referralFetchError || !referralData?.referrals_by) {
      console.error('❌ Не найден referrals_by');
      return res.status(400).json({ success: false, error: 'referrals_by отсутствует' });
    }

    const referral_id = referralData.referrals_by;

    const { error: insertError } = await supabase
      .from('referrals')
      .insert([{ user_id, referral_id, task_key, source: 'game' }]);

    if (insertError) {
      console.error('❌ Ошибка при сохранении выполнения:', insertError.message);
      return res.status(500).json({ success: false, error: 'Не удалось сохранить выполнение' });
    }

// ✅ 5. Проверка: если ВСЕ invite1–invite7 выполнены — сбросим
    const inviteKeys = ['invite1','invite2','invite3','invite4','invite5','invite6','invite7'];
    const { data: doneInvites, error: inviteError } = await supabase
      .from('referrals')
      .select('task_key')
      .eq('user_id', user_id)
      .eq('source', 'game');

    if (!inviteError) {
      const completedKeys = doneInvites.map(t => t.task_key);
      const allDone = inviteKeys.every(k => completedKeys.includes(k));

      if (allDone) {
        await supabase
          .from('referrals')
          .delete()
          .eq('user_id', user_id)
          .eq('source', 'game')
          .in('task_key', inviteKeys);

        console.log('♻️ Все инвайты сброшены для', user_id);
      }
    }

    console.log(`✅ Задание ${task_key} успешно засчитано`);
    return res.status(200).json({ success: true, invited: count });
    
  } catch (e) {
    console.error('❌ Внутренняя ошибка:', e);
    return res.status(500).json({ success: false, error: 'Ошибка сервера' });
  } 
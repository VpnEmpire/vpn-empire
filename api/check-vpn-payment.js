// /api/check-vpn-payment.js

import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.VITE_SUPABASE_URL,
  process.env.SUPABASE_KEY
);

export default async function handler(req, res) {
  const { user_id } = req.query;

  if (!user_id) {
    return res.status(400).json({ error: 'user_id is required' });
  }

  try {
    // 1. Проверка: есть ли успешная оплата в payments
    const { data, error } = await supabase
      .from('payments')
      .select('*')
      .eq('user_id', user_id)
      .eq('status', 'succeeded')
      .maybeSingle();

    if (error) {
      console.error('❌ Ошибка при запросе payments:', error);
      return res.status(500).json({ error: 'Ошибка при запросе к payments' });
    }

    if (data) {
      // 2. Обновить users.hasVpnBoost = true (если ещё не обновлено)
      const { error: updateError } = await supabase
        .from('users')
        .update({ hasVpnBoost: true })
        .eq('user_id', user_id);

      if (updateError) {
        console.error('⚠️ Ошибка обновления hasVpnBoost:', updateError);
      }

      // 3. Вернуть успешный ответ
      return res.status(200).json({ success: true });
    } else {
      return res.status(200).json({ success: false }); // Оплата не найдена
    }
  } catch (err) {
    console.error('❌ Ошибка сервера:', err);
    return res.status(500).json({ error: 'Server error' });
  }
}

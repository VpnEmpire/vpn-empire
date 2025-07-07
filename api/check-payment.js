// /api/check-payment.js

import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.REACT_APP_SUPABASE_URL,
  process.env.REACT_APP_SUPABASE_ANON_KEY
);

export default async function handler(req, res) {
  const { user_id } = req.query;

  if (!user_id) {
    return res.status(400).json({ error: 'user_id is required' });
  }

  try {
    // Проверяем успешную оплату, которая еще не была использована
    const { data, error } = await supabase
      .from('payments')
      .select('*')
      .eq('user_id', user_id)
      .eq('status', 'succeeded')
      .eq('used', false)
      .order('created_at', { ascending: false })
      .limit(1)
      .maybeSingle();

    if (error) {
      console.error('❌ Ошибка запроса к Supabase:', error);
      return res.status(500).json({ error: 'Ошибка при проверке оплаты' });
    }

    if (!data) {
      console.log('⛔ Нет новой успешной оплаты');
      return res.status(200).json({ success: false });
    }

    // Обновляем статус used = true, чтобы больше не использовать этот платёж
    const { error: updateError } = await supabase
      .from('payments')
      .update({ used: true })
      .eq('id', data.id);

    if (updateError) {
      console.error('❌ Ошибка при отметке used=true:', updateError);
      return res.status(500).json({ error: 'Ошибка обновления used' });
    }

    console.log('✅ Оплата подтверждена и отмечена как использованная');
    return res.status(200).json({ success: true });
  } catch (err) {
    console.error('💥 Внутренняя ошибка сервера:', err);
    return res.status(500).json({ error: 'Server error' });
  }
}

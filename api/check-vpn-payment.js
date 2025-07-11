// /api/check-vpn-payment.js

import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.VITE_SUPABASE_URL,
  process.env.SUPABASE_KEY
);

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).send('Method Not Allowed');

  const { user_id, task_key } = req.body;

  if (!user_id || !task_key) {
    return res.status(400).json({ error: 'user_id и task_key обязательны' });
  }

  // 1. Найдём успешную и неиспользованную оплату
  const { data, error } = await supabase
    .from('payments')
    .select('*')
    .eq('user_id', user_id)
    .eq('status', 'succeeded')
    .eq('used', false)
    .order('created_at', { ascending: false })
    .limit(1)
    .maybeSingle();

  if (error || !data || !data.id) {
  console.error('❌ Платёж не найден или ошибка:', error);
  return res.status(200).json({ success: false });
}
  // 2. Отмечаем оплату как использованную
  const { error: updateError } = await supabase
    .from('payments')
    .update({ used: true, task_key })
    .eq('id', data.id);

  if (updateError) {
    console.error('❌ Ошибка при обновлении used:', updateError);
    return res.status(500).json({ error: 'Не удалось отметить оплату как использованную' });
  }

  // 3. Успешно
  console.log('✅ Оплата подтверждена и обновлена для user_id:', user_id);
  return res.status(200).json({ success: true });
}

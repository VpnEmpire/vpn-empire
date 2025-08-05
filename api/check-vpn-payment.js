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

  // 🔐 Найдём строго одну оплату, которая ещё не использована и соответствует текущему заданию
  const { data, error } = await supabase
    .from('payments')
    .select('*')
    .eq('user_id', user_id)
    .eq('status', 'succeeded')
    .eq('used', false)
    .eq('task_key', task_key) // 👈 строгое соответствие
    .order('created_at', { ascending: false })
    .limit(1)
    .maybeSingle();

  if (error || !data) {
    console.warn('⛔ Оплата не найдена или уже использована');
    return res.status(200).json({ success: false });
  }

  // ✅ Обновим — теперь эта оплата считается использованной
  const { error: updateError } = await supabase
    .from('payments')
    .update({ used: true })
    .eq('id', data.id);

  if (updateError) {
    console.error('❌ Ошибка при обновлении used:', updateError);
    return res.status(500).json({ error: 'Ошибка при обновлении статуса оплаты' });
  }

  console.log('✅ Оплата успешно подтверждена и помечена как использованная');
  return res.status(200).json({ success: true });
}
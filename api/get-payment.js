// /api/get-payments.js

import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.VITE_SUPABASE_URL,
  process.env.SUPABASE_KEY
);

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Метод не поддерживается' });
  }

  const { user_id, task_key } = req.body;

  if (!user_id || !task_key) {
    return res.status(400).json({ error: 'Не указан user_id или task_key' });
  }

  const { data, error } = await supabase
    .from('payments')
    .select('*')
    .eq('user_id', user_id)
    .eq('task_key', task_key)
    .eq('used', false)
    .eq('status', 'succeeded')
    .order('created_at', { ascending: false })
    .limit(1);

  if (error || !data || data.length === 0) {
    return res.status(200).json({ success: false });
  }

  // Отмечаем как использованную
  await supabase
    .from('payments')
    .update({ used: true })
    .eq('id', data[0].id);

  return res.status(200).json({ success: true });
}
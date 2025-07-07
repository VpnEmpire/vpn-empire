// /api/check-vpn-payment.js

import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.VITE_SUPABASE_URL,
  process.env.VITE_SUPABASE_ANON_KEY
);

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Метод не поддерживается' });
  }

  const { user_id, task_key } = req.body;

  try {
    const { data, error } = await supabase
      .from('payments')
      .select('*')
      .eq('user_id', user_id)
      .eq('task_key', null)
      .eq('status', 'succeeded')
      .eq('used', false)
      .order('created_at', { ascending: false })
      .limit (1) ();

    if (error) {
      console.error('❌ Ошибка запроса к Supabase:', error);
      return res.status(500).json({ error: 'Ошибка при обращении к базе данных' });
    }

    if (data?.hasVpnBoost) {
      return res.status(200).json({ success: true });
    } else {
      return res.status(200).json({ success: false });
    }

  } catch (err) {
    console.error('💥 Внутренняя ошибка сервера:', err);
    return res.status(500).json({ error: 'Server error' });
  }
}
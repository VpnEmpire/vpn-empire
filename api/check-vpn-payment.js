// /api/check-vpn-payment.js

import { createClient } from '@supabase/supabase-js';

// Используем переменные без префикса VITE_ — только такие работают на backend
const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_KEY
);

export default async function handler(req, res) {
  const { user_id } = req.query;

  if (!user_id) {
    return res.status(400).json({ error: 'user_id is required' });
  }

  try {
    const { data, error } = await supabase
      .from('users')
      .select('hasVpnBoost')
      .eq('user_id', user_id)
      .single();

    if (error) {
      console.error('Ошибка при запросе к Supabase:', error);
      return res.status(500).json({ error: 'Ошибка Supabase' });
    }

    if (data?.hasVpnBoost) {
      return res.status(200).json({ success: true });
    } else {
      return res.status(200).json({ success: false });
    }
  } catch (err) {
    console.error('❌ Ошибка сервера:', err);
    return res.status(500).json({ error: 'Server error' });
  }
}

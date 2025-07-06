// /api/check-vpn-payment.js

import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.VITE_SUPABASE_URL,
  process.env.VITE_SUPABASE_ANON_KEY
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
      .eq('user_id', String(user_id))
      .maybeSingle(); // Внутри уже есть .limit(1)

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
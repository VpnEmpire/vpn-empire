// /api/top.js

import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.VITE_PUBLIC_SUPABASE_URL,
  process.env.VITE_SUPABASE_SERVICE_ROLE_KEY
);

export default async function handler(req, res) {
  try {
    const { data, error } = await supabase
      .from('users')
      .select('user_id, coins')
      .order('coins', { ascending: false })
      .limit(50);

    if (error) {
      console.error('❌ Supabase ошибка при загрузке топа:', error.message);
      return res.status(500).json({ error: 'Ошибка загрузки топа' });
    }

    return res.status(200).json({ top: data });
  } catch (err) {
    console.error('❌ Ошибка сервера /api/top.js:', err.message);
    return res.status(500).json({ error: 'Внутренняя ошибка сервера' });
  }
}
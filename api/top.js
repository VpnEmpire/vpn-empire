// /api/top.js
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.VITE_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_SERVICE_ROLE_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

export default async function handler(req, res) {
  try {
    const { data, error } = await supabase
      .from('users')
      .select('user_id,coins')
      .order('coins', { ascending: false })
      .limit(50);

    if (error) {
      console.error('Ошибка Supabase:', error);
      return res.status(500).json({ error: 'Ошибка при получении топа' });
    }

    return res.status(200).json({ top: data });
  } catch (err) {
    console.error('❌ Ошибка при получении топа:', err);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
}
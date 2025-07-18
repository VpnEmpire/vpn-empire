// /api/check-referral.js

import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.VITE_SUPABASE_URL,
  process.env.SUPABASE_KEY
);

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).send('Method Not Allowed');

  const { user_id } = req.body;

  if (!user_id) {
    return res.status(400).json({ error: 'user_id обязателен' });
  }

  const { count, error } = await supabase
    .from('referrals')
    .select('*', { count: 'exact', head: true })
    .eq('user_id', user_id);

  if (error) {
    console.error('❌ Ошибка Supabase:', error);
    return res.status(500).json({ error: 'Ошибка Supabase' });
  }

  res.status(200).json({ count });
}

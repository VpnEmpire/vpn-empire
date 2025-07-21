// /api/update-coins.js
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.VITE_SUPABASE_URL,
  process.env.SUPABASE_KEY
);

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end();

  const { user_id, coins } = req.body;

  if (!user_id || coins == null) {
    return res.status(400).json({ error: 'user_id и coins обязательны' });
  }

  const { error } = await supabase
    .from('users')
    .update({ coins })
    .eq('user_id', user_id);

  if (error) {
    return res.status(500).json({ error: error.message });
  }

  return res.status(200).json({ success: true });
}
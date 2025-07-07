import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.VITE_SUPABASE_URL,
  process.env.SUPABASE_KEY
);

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end('Method Not Allowed');

  const { user_id, referred_id } = req.body;

  if (!user_id || !referred_id || user_id === referred_id) {
    return res.status(400).json({ error: 'Некорректные данные' });
  }

  const { data, error } = await supabase
    .from('referrals')
    .select('*')
    .eq('user_id', user_id)
    .eq('referred_id', referred_id)
    .maybeSingle();

  if (data) {
    return res.status(200).json({ message: 'Реферал уже существует' });
  }

  const { error: insertError } = await supabase.from('referrals').insert([
    {
      user_id,
      referred_id,
    },
  ]);

  if (insertError) {
    return res.status(500).json({ error: insertError.message });
  }

  return res.status(200).json({ success: true });
}
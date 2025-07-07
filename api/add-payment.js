import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.VITE_SUPABASE_URL,
  process.env.SUPABASE_KEY
);

export default async function handler(req, res) {
  if (req.method === 'POST') {
    const { user_id, payment_id, amount, status } = req.body;

    const { data, error } = await supabase
      .from('payments')
      .insert([{ user_id, payment_id, amount, status,
        used: false,
        task_key: 'activateVpn'
    }]);

    if (error) return res.status(500).json({ error: error.message });

    return res.status(200).json({ success: true, data });
  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
}

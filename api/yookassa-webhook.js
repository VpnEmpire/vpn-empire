import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://wkdhylmqfzigaxxhnqho.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndrZGh5bG1xZnppZ2F4eGhucWhvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTE2ODI2NjYsImV4cCI6MjA2NzI1ODY2Nn0.9gaWyWvsvftewF3WJx03p0kZhZ6-5ReNDe2CsXoor6E';

const supabase = createClient(supabaseUrl, supabaseKey);

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const event = req.body;

  try {
    const user_id = event.object?.metadata?.user_id;
    const status = event.object?.status;

    if (!user_id) {
      return res.status(400).json({ error: 'No user_id in metadata' });
    }

    if (status === 'succeeded') {
      const { data, error } = await supabase
        .from('payments')
        .upsert(
          { user_id, status, payment_id: event.object.id },
          { onConflict: 'payment_id' }
        );

      if (error) {
        console.error('Supabase error:', error);
        return res.status(500).json({ error: error.message });
      }

      return res.status(200).json({ message: 'Payment recorded' });
    } else {
      return res.status(200).json({ message: 'Payment not successful yet' });
    }
  } catch (err) {
    console.error('Webhook handler error:', err);
    return res.status(500).json({ error: err.message });
  }
}

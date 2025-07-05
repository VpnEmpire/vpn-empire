mport { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://wkdhylmqfzigaxxhnqho.supabase.co';
const supabaseKey = 'YOUR_SUPABASE_SERVICE_ROLE_KEY'; // сервисный ключ с полными правами
const supabase = createClient(supabaseUrl, supabaseKey);

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).send('Method Not Allowed');
  }

  const event = req.body;

  // В зависимости от структуры webhook ЮKassa
  // Например, event.object === 'payment' и event.status === 'succeeded'

  if (event.object === 'payment' && event.status === 'succeeded') {
    const paymentId = event.id;
    const userId = event.metadata?.user_id || null; // пользовательский id из metadata платежа

    if (!userId) {
      return res.status(400).send('No user_id in payment metadata');
    }

    // Записываем платеж в Supabase
    const { data, error } = await supabase.from('payments').insert([
      {
        payment_id: paymentId,
        user_id: userId,
        status: event.status,
        amount: event.amount?.value || 0,
        created_at: new Date().toISOString(),
      },
    ]);

    if (error) {
      console.error('Supabase insert error:', error);
      return res.status(500).send('Database error');
    }

    return res.status(200).send('Payment recorded');
  }

  res.status(400).send('Event ignored');
}


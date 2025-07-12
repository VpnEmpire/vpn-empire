import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_KEY; // этот ключ для server side!
const supabase = createClient(supabaseUrl, supabaseKey);

export const config = {
  api: {
    bodyParser: {
      sizeLimit: '1mb',
    },
  },
};

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).send('Method Not Allowed');

  const event = req.body;
  console.log('📦 Получено событие от YooKassa:', event);

  const description = event.object?.description || '';
  const userIdMatch = description.match(/Заказ для (\d+)/);
  const userId = userIdMatch ? userIdMatch[1] : null;

  // 🔹 task_key: ищем, если указано (например: task_key:activateVPN)
  const taskKeyMatch = description.match(/task_key:([\w\d_-]+)/);
  const task_key = taskKeyMatch ? taskKeyMatch[1] : null;
  
  if (!userId) {
    console.error('❌ userId не найден в description:', description);
    return res.status(400).json({ error: 'userId не найден в description' });
  }

  if (event.object?.status === 'succeeded') {
    const paymentId = event.object.id;
    const amount = event.object.amount?.value || null;

    const { data: existing, error: errCheck } = await supabase
      .from('payments')
      .select('id')
      .eq('payment_id', paymentId)
      .limit(1)
      .maybeSingle();

    if (errCheck) {
      console.error('❌ Ошибка при проверке дубликата:', errCheck);
      return res.status(500).json({ error: 'Ошибка при проверке' });
    }

    if (existing) {
      console.log('⚠️ Платеж уже существует:', paymentId);
      return res.status(200).json({ message: 'Платеж уже зарегистрирован' });
    }

    const { error } = await supabase.from('payments').insert([
      {
        user_id: String(userId),
        payment_id: paymentId,
        amount: amount,
        status: 'succeeded',
        used: false, // автоматически
        task_key: 'activateVpn' , // если указан
        created_at: new Date().toISOString(),
      },
    ]);

    if (error) {
      console.error('❌ Ошибка вставки в базу:', error);
      return res.status(500).json({ error: 'Ошибка вставки' });
    }

    console.log('✅ Платеж успешно записан');
    return res.status(200).json({ success: true });
  }

  return res.status(400).json({ error: 'Платеж не успешен' });
}

import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.SUPABASE_KEY; // этот ключ для server side!
const supabase = createClient(supabaseUrl, supabaseKey);

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).send('Method Not Allowed');

  const event = req.body;

  // Извлекаем description
  const description = event.object?.description || '';
  // Парсим userId из строки "Заказ для 773074832"
  const userIdMatch = description.match(/Заказ для (\d+)/);
  const userId = userIdMatch ? userIdMatch[1] : null;

  if (!userId) {
    console.error('userId не найден в description:', description);
    return res.status(400).json({ error: 'userId не найден в description' });
  }

  if (event.object?.status === 'succeeded') {
    const paymentId = event.object.id;
    const amount = event.object.amount?.value || null;

    // Проверяем нет ли уже такого платежа
    const { data: existing, error: errCheck } = await supabase
      .from('payments')
      .select('id')
      .eq('payment_id', paymentId)
      .single();

    if (errCheck) {
      console.error('Ошибка проверки дубликата:', errCheck);
      return res.status(500).json({ error: 'Ошибка базы данных' });
    }
    if (existing) {
      return res.status(200).json({ message: 'Платеж уже зарегистрирован' });
    }

    // Вставляем новую запись
    const { error } = await supabase.from('payments').insert([
      {
        user_id: userId,
        payment_id: paymentId,
        amount: amount,
        status: 'succeeded',
        created_at: new Date().toISOString(),
      },
    ]);

    if (error) {
      console.error('Ошибка вставки платежа:', error);
      return res.status(500).json({ error: 'Ошибка записи в базу' });
    }

    return res.status(200).json({ success: true });
  }

  return res.status(400).json({ error: 'Платеж не успешен' });
}

// /api/check-vpn-payment.js

import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.VITE_SUPABASE_URL, // можно оставить тот же URL
  process.env.SUPABASE_KEY // 🔐 правильный приватный ключ
);

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Метод не поддерживается' });
  }

  const { user_id, task_key } = req.body;

  if (!user_id || !task_key) {
    return res.status(400).json({ error: 'user_id и task_key обязательны' });
  }

  try {
    // 1. Проверка: есть ли успешная оплата в payments
    const { data, error } = await supabase
      .from('payments')
      .select('*')
      .eq('user_id', user_id)
      .eq('status', 'succeeded')
      .eq('used', false)
      .order('created_at', { ascending: false })
      .limit(1)
      .maybeSingle();
      
      
    if (error || !data || data.length === 0) {
      return res.status(200).json({ success: false });
    }

    const payment = data[0];
    
    // 2. Помечаем оплату как использованную
    const { error: updateError } = await supabase
      .from('payments')
      .update({ used: true, task_key: 'activateVpn' })
      .eq('id', payment.id);
       
      if (updateError) {
      console.error('Ошибка при обновлении used:', updateError);
      return res.status(500).json({ error: 'Не удалось отметить оплату как использованную' });
    }
    
          // 3. Возвращаем успех
    return res.status(200).json({ success: true });

  } catch (err) {
    console.error('❌ Ошибка сервера:', err);
    return res.status(500).json({ error: 'Server error' });
  }
}

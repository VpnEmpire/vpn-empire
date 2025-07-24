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

  try {
    const { data: existing, error: fetchError } = await supabase
      .from('users')
      .select('id')
      .eq('user_id', user_id)
      .single();

    if (fetchError && fetchError.code !== 'PGRST116') throw fetchError;

    if (existing) {
      // ✅ Обновление монет
      const { error: updateError } = await supabase
        .from('users')
        .update({ coins })
        .eq('user_id', user_id);

      if (updateError) throw updateError;
    } else {
      // ✅ Создание нового пользователя (только один раз!)
      const { error: insertError } = await supabase
        .from('users')
        .insert([{ user_id, coins }]);

      if (insertError) {
        // 🔁 Если дублируется — ничего не делаем
        if (insertError.code === '23505') {
          return res.status(200).json({ success: true, note: 'duplicate skipped' });
        }
        throw insertError;
      }
    }

    return res.status(200).json({ success: true });
  } catch (err) {
    console.error('❌ Ошибка Supabase:', err.message);
    return res.status(500).json({ error: err.message });
  }
}

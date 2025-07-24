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

  // 1. Проверяем, существует ли пользователь
  const { data: existingUser, error: selectError } = await supabase
    .from('users')
    .select('id')
    .eq('user_id', user_id)
    .single();

  if (selectError && selectError.code !== 'PGRST116') {
    console.error('❌ Ошибка при поиске пользователя:', selectError.message);
    return res.status(500).json({ error: selectError.message });
  }

  if (existingUser) {
    // 2. Обновляем монеты
    const { error: updateError } = await supabase
      .from('users')
      .update({ coins })
      .eq('user_id', user_id);

    if (updateError) {
      console.error('❌ Ошибка обновления монет:', updateError.message);
      return res.status(500).json({ error: updateError.message });
    }

    return res.status(200).json({ success: true, updated: true });
  } else {
    // 3. Создаём нового пользователя
    const { error: insertError } = await supabase
      .from('users')
      .insert([{ user_id, coins }]);

    if (insertError) {
      console.error('❌ Ошибка создания пользователя:', insertError.message);
      return res.status(500).json({ error: insertError.message });
    }

    return res.status(200).json({ success: true, created: true });
  }
}

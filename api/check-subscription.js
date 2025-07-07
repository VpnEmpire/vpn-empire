// /api/check-subscription.js

import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.VITE_SUPABASE_URL,
  process.env.SUPABASE_KEY
);

export const config = {
  api: {
    bodyParser: {
      sizeLimit: '1mb',
    },
  },
};

export default async function handler(req, res) {
  console.log('📥 [check-subscription] Запрос получен');

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Метод не поддерживается. Используй POST.' });
  }

  const { user_id, channel } = req.body;
  console.log('🔹 user_id:', user_id);
  console.log('🔹 channel:', channel);

  if (!user_id || !channel) {
    return res.status(400).json({ error: 'Не хватает user_id или channel' });
  }

  try {
    const { data, error } = await supabase
      .from('subscriptions')
      .select('is_subscribed')
      .eq('user_id', user_id)
      .eq('channel', channel)
      .maybeSingle();

    if (error) {
      console.error('❌ Supabase ошибка:', error.message);
      return res.status(500).json({ success: false, error: 'Ошибка Supabase' });
    }

    const isSubscribed = data?.is_subscribed === true;

    if (isSubscribed) {
      console.log('✅ Пользователь подписан');
    } else {
      console.log('⛔️ Пользователь НЕ подписан');
    }

    return res.status(200).json({ success: isSubscribed });
  } catch (e) {
    console.error('❌ Внутренняя ошибка:', e);
    return res.status(500).json({ success: false, error: 'Ошибка сервера' });
  }
}
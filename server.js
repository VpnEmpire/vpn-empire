import express from 'express';
import cors from 'cors';
import db from './db.js';

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

// ✅ создаём таблицу users, если её ещё нет
db.run(`
  CREATE TABLE IF NOT EXISTS users (
    user_id TEXT PRIMARY KEY,
    hasSubscribed INTEGER DEFAULT 0,
    hasPaid INTEGER DEFAULT 0,
    referrals INTEGER DEFAULT 0
  )
`, (err) => {
  if (err) {
    console.error('❌ Ошибка при создании таблицы:', err.message);
  } else {
    console.log('✅ Таблица users готова');
  }
});

// 🔁 Проверка, работает ли сервер
app.get('/', (req, res) => {
  res.send('VPN Empire сервер работает 🛠️');
});

// 🧩 импорт API роутов
import checkSubscription from './api/check-subscription.js';
import yookassaWebhook from './api/yookassa-webhook.js';

app.use('/api/check-subscription', checkSubscription);
app.use('/api/check-payment', yookassaWebhook);

// ✅ запуск сервера
app.listen(PORT, () => {
  console.log(`🚀 Сервер запущен на http://localhost:${PORT}`);
});

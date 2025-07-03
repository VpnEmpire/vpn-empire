// server.js
const express = require('express');
const bodyParser = require('body-parser');
const admin = require('firebase-admin');
const cors = require('cors');
const fs = require('fs');

const serviceAccount = JSON.parse(
  fs.readFileSync('./firebase-secret.json', 'utf8')
);

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const db = admin.firestore();
const app = express();

app.use(cors());
app.use(bodyParser.json());

// ✅ Обработка Webhook от YooKassa
app.post('/webhook', async (req, res) => {
  const event = req.body;

  if (
    event.event === 'payment.succeeded' &&
    event.object &&
    event.object.metadata &&
    event.object.metadata.user_id
  ) {
    const userId = event.object.metadata.user_id;
    const reward = 1000;

    try {
      const userRef = db.collection('users').doc(userId);
      const userDoc = await userRef.get();

      if (!userDoc.exists || !userDoc.data().paid) {
        await userRef.set(
          {
            paid: true,
            coins: admin.firestore.FieldValue.increment(reward),
          },
          { merge: true }
        );
        console.log(`✅ Пользователю ${userId} начислено ${reward} монет`);
      }
    } catch (error) {
      console.error('❌ Ошибка при начислении монет:', error);
    }
  }

  res.sendStatus(200);
});

// ✅ Проверка оплаты из клиента
app.post('/vpn-empire/api/check-task', async (req, res) => {
  const { user_id, taskKey } = req.body;

  if (!user_id || !taskKey) {
    return res.status(400).json({ success: false, message: 'Missing user_id or taskKey' });
  }

  try {
    const userRef = db.collection('users').doc(user_id);
    const userDoc = await userRef.get();

    if (!userDoc.exists) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    const userData = userDoc.data();

    if (userData.paid === true) {
      return res.json({ success: true });
    } else {
      return res.json({ success: false, message: 'Payment not found' });
    }
  } catch (error) {
    console.error('Ошибка при проверке оплаты:', error);
    return res.status(500).json({ success: false, message: 'Server error' });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`✅ Server running on http://localhost:${PORT}`);
});

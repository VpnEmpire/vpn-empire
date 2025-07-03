import express from 'express';
import bodyParser from 'body-parser';
import fs from 'fs';
import admin from 'firebase-admin';

const app = express();
const port = 3000;

const serviceAccount = JSON.parse(
  fs.readFileSync('./firebase-secret.json', 'utf8')
);

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
  });
}
const db = admin.firestore();

app.use(bodyParser.json());

app.post('/webhook', async (req, res) => {
  const data = req.body;
  console.log('📥 Получен вебхук:', JSON.stringify(data, null, 2));

  if (
    data.event === 'payment.succeeded' &&
    data.object &&
    data.object.paid === true
  ) {
    let userId = null;

    if (data.object.metadata?.user_id) {
      userId = data.object.metadata.user_id;
    } else if (data.object.description) {
      const match = data.object.description.match(/\d+/);
      if (match) {
        userId = match[0];
      }
    }

    if (!userId) {
      console.log('❌ Не удалось определить user_id');
      return res.status(400).send('Missing user_id');
    }

    const userRef = db.collection('users').doc(userId);
    const userDoc = await userRef.get();
    const userData = userDoc.data() || {};

    if (!userData.vpnActivated) {
      await userRef.set(
        {
          paid: true,
          vpnActivated: true,
          coins: (userData.coins || 0) + 1000,
          lastPayment: Date.now(),
        },
        { merge: true }
      );
      console.log(`✅ Пользователю ${userId} начислено 1000 монет`);
    } else {
      console.log(`ℹ️ VPN уже активирован для ${userId}, монеты не начислены повторно`);
    }

    return res.status(200).send('OK');
  }

  return res.status(200).send('Webhook received, but not handled.');
});

app.listen(port, () => {
  console.log(`🚀 Сервер запущен: http://localhost:${port}`);
});

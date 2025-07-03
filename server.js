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
  console.log('✅ Получен вебхук:', JSON.stringify(data, null, 2));

  if (data.event === 'payment.succeeded') {
    const userId = data.object.metadata?.user_id;

    if (userId) {
      const userRef = db.collection('users').doc(userId);
      const userSnap = await userRef.get();
      const userData = userSnap.exists ? userSnap.data() : { coins: 0 };

      const newCoins = (userData.coins || 0) + 1000;

      await userRef.set(
        {
          coins: newCoins,
          paid: true,
        },
        { merge: true }
      );

      console.log(`🎉 Начислено 1000 монет пользователю ${userId}`);
    }
  }

  res.sendStatus(200);
});

app.listen(port, () => {
  console.log(`🚀 Сервер запущен: http://localhost:${port}`);
});

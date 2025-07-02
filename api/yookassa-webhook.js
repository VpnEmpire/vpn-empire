// /api/yookassa-webhook.js
import admin from 'firebase-admin';
import { buffer } from 'micro';

const serviceAccount = JSON.parse(process.env.FIREBASE_SECRET_JSON);

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
  });
}

const db = admin.firestore();

export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).end('Method Not Allowed');
  }

  const rawBody = await buffer(req);
  const json = JSON.parse(rawBody.toString());

  if (json.event === 'payment.succeeded') {
    const userId = json.object.metadata?.user_id;
    const amount = json.object.amount?.value;

    if (userId) {
      await db.collection('users').doc(userId).set({
        paid: true,
        amount: Number(amount),
        timestamp: Date.now(),
      }, { merge: true });

      return res.status(200).send('OK');
    }
  }

  return res.status(400).send('Invalid payload');
}

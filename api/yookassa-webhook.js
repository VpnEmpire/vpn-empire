import admin from 'firebase-admin';
import { buffer } from 'micro';
 
 export const config = {
  api: {
    bodyParser: false,
  },
};
 
const serviceAccount = JSON.parse(process.env.FIREBASE_SECRET_JSON);
 
if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
  });
}
 
const db = admin.firestore();
 
export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).end('Method Not Allowed');
  }
 
  const rawBody = await buffer(req);
 console.log('Raw webhook body:', rawBody.toString());
 
  const json = JSON.parse(rawBody.toString());
  console.log('Parsed webhook JSON:', json);
 
  console.log('📥 Webhook получен:', JSON.stringify(json));
 
    const event = json.event;
    const metadata = json.object?.metadata;
    const description = json.object?.description;
    const amount = json.object?.amount?.value;
 
  let userId = null;
  if (json.object.metadata?.user_id) {
    userId = json.object.metadata.user_id;
  } else if (json.object.description) {
    const match = json.object.description.match(/\d+/);
    if (match) {
      userId = match[0];
    }
  }
 
  if (json.event === 'payment.succeeded' && userId) {
    const amount = json.object.amount?.value;
 
    await db.collection('users').doc(userId).set({
      paid: true,
      amount: Number(amount),
      timestamp: Date.now(),
    }, { merge: true });
  return res.status(200).send('OK');
  }
  const userRef = db.collection('users').doc(userId);
  const userDoc = await userRef.get();
  const userData = userDoc.exists ? userDoc.data() : {};
 
      await userRef.set({
        coins: (userData.coins || 0) + 1000,
        paid: true,
        vpnActivated: true,
        timestamp: Date.now(),
      }, { merge: true });
 
      console.log(`💰 Оплата подтверждена и монеты начислены для userId ${userId}`);
      return res.status(200).send('OK');
}

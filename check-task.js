import admin from 'firebase-admin';

const serviceAccount = JSON.parse(process.env.FIREBASE_SECRET_JSON);

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
  });
}

const db = admin.firestore();

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).send('Method not allowed');

  const { user_id, taskKey, taskType, requiredCount } = req.body;

  if (!user_id || !taskKey || !taskType) {
    return res.status(400).json({ error: 'Missing parameters' });
  }

  try {
    const userRef = db.collection('users').doc(user_id);
    const userDoc = await userRef.get();

    if (!userDoc.exists) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    const userData = userDoc.data();

    let isCompleted = false;

    if (taskType === 'vpn' && userData.paid === true && !userData.vpnActivated) {
      await userRef.update({
        coins: (userData.coins || 0) + 1000,
        vpnActivated: true,
      });
      isCompleted = true;

    } else if (taskType === 'subscribe' && userData.subscribed === true) {
      isCompleted = true;

    } else if (taskType === 'referral' && (userData.referrals || 0) >= requiredCount) {
      isCompleted = true;

    } else if (taskType === 'daily') {
      isCompleted = true;
    }

    if (isCompleted) {
      return res.status(200).json({ success: true });
    } else {
      return res.status(200).json({ success: false, message: 'Task not completed yet' });
    }

  } catch (err) {
    console.error('Ошибка в /check-task:', err);
    return res.status(500).json({ error: 'Server error' });
  }
}

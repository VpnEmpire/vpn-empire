import { initializeApp, cert } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';
import serviceAccount from './firebase-secret.json'; // убедись, что путь к ключу правильный

const app = initializeApp({
  credential: cert(serviceAccount),
});
const db = getFirestore(app);

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const { user_id, taskKey, taskType } = req.body;

  if (!user_id || taskKey !== 'activatedVpn' || taskType !== 'vpn') {
    return res.status(400).json({ error: 'Invalid parameters' });
  }

  try {
    const userRef = db.collection('users').doc(String(user_id));
    const userDoc = await userRef.get();

    if (!userDoc.exists) return res.status(404).json({ error: 'User not found' });

    const userData = userDoc.data();

    // Если уже выполнено — не начисляем заново
    if (userData.tasks?.activatedVpn === true) {
      return res.status(200).json({ message: 'Task already completed' });
    }

    // Проверяем, была ли оплата
    if (userData.paidVpn === true) {
      const reward = 1000;
      const updatedCoins = (userData.coins || 0) + reward;

      await userRef.update({
        coins: updatedCoins,
        'tasks.activatedVpn': true,
      });

      return res.status(200).json({ message: 'Reward granted', coins: updatedCoins });
    } else {
      return res.status(400).json({ error: 'VPN not paid yet' });
    }
  } catch (error) {
    console.error('Error checking task:', error);
    return res.status(500).json({ error: 'Server error' });
  }
}

    return res.status(405).json({ success: false, error: 'Метод не поддерживается' });
  }

  const { user_id } = req.body;

  if (!user_id) {
    return res.status(400).json({ success: false, error: 'Нет user_id' });
  }

  try {
    const userRef = db.collection('users').doc(user_id.toString());
    const userDoc = await userRef.get();

    if (!userDoc.exists) {
      return res.status(404).json({ success: false, error: 'Пользователь не найден' });
    }

    const userData = userDoc.data();

    if (userData.paid) {
      await userRef.update({
        coins: (userData.coins || 0) + 1000,
        hasVpnBoost: true,
        completedTasks: {
          ...(userData.completedTasks || {}),
          activateVpn: true,
        }
      });

      return res.status(200).json({ success: true, message: 'VPN оплачен, награда и boost выданы' });
    } else {
      return res.status(200).json({ success: false, message: 'Оплата не найдена' });
    }

  } catch (error) {
    console.error('Ошибка при проверке оплаты VPN:', error);
    return res.status(500).json({ success: false, error: 'Ошибка сервера' });
  }
}

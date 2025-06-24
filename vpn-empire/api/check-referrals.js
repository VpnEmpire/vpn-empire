// /api/check-referrals.js

import fs from 'fs';
import path from 'path';

const filePath = path.resolve('./referrals.json');

export default function handler(req, res) {
  const { user_id } = req.query;

  if (!user_id) {
    return res.status(400).json({ error: 'Missing user_id' });
  }

  let data = {};
  try {
    if (fs.existsSync(filePath)) {
      const file = fs.readFileSync(filePath, 'utf-8');
      data = JSON.parse(file);
    }
  } catch (e) {
    console.error('Ошибка чтения файла referrals.json:', e);
  }

  const referrals = Array.isArray(data[user_id]) ? data[user_id].length : 0;

  res.status(200).json({ referrals });
}

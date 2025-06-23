// /api/register-referral.js

import fs from 'fs';
import path from 'path';

const filePath = path.resolve('./referrals.json');

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const { user_id, ref } = req.body;

  if (!user_id || !ref || user_id === ref) {
    return res.status(400).json({ error: 'Invalid user_id or ref' });
  }

  let data = {};

  try {
    if (fs.existsSync(filePath)) {
      const file = fs.readFileSync(filePath, 'utf-8');
      data = JSON.parse(file);
    }
  } catch (e) {
    console.error('Ошибка чтения файла:', e);
  }

  if (!data[ref]) {
    data[ref] = [];
  }

  if (!data[ref].includes(user_id)) {
    data[ref].push(user_id);
  }

  fs.writeFileSync(filePath, JSON.stringify(data, null, 2));

  res.status(200).json({ success: true });
}


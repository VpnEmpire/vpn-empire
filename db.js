import sqlite3 from 'sqlite3';
import fs from 'fs';
import path from 'path';

const dataPath = path.resolve('./data');
if (!fs.existsSync(dataPath)) {
  fs.mkdirSync(dataPath);
}

const db = new sqlite3.Database('./data/database.sqlite', (err) => {
  if (err) {
    console.error('❌ Ошибка подключения к базе данных:', err.message);
  } else {
    console.log('✅ База данных подключена: ./data/database.sqlite');
  }
});

export default db;

import sqlite3 from 'sqlite3';
import { open } from 'sqlite';
import fs from 'fs';
import path from 'path';

// Создание папки "data", если нет
const dataPath = path.resolve('./data');
if (!fs.existsSync(dataPath)) {
  fs.mkdirSync(dataPath);
}

// Открываем или создаём базу в /data
const dbPromise = open({
  filename: path.resolve(dataPath, 'database.sqlite'),
  driver: sqlite3.Database
});

export default dbPromise;

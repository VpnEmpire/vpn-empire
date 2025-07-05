import sqlite3 from 'sqlite3';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const dbPath = path.join(__dirname, 'data', 'database.sqlite');
const initSqlPath = path.join(__dirname, 'init.sql');

const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error('Ошибка подключения к БД:', err.message);
  } else {
    console.log('✅ База данных подключена');

    const initSql = fs.readFileSync(initSqlPath, 'utf8');
    db.exec(initSql, (err) => {
      if (err) {
        console.error('[INIT SQL ERROR]', err.message);
      } else {
        console.log('✅ Таблица users создана или уже существует');
      }
    });
  }
});

export default db;


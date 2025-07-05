import sqlite3 from 'sqlite3';
import { open } from 'sqlite';

export const dbPromise = open({
  filename: './data/database.sqlite',
  driver: sqlite3.Database,
});

export const db = {
  run: async (...args) => (await dbPromise).run(...args),
  get: async (...args) => (await dbPromise).get(...args),
  all: async (...args) => (await dbPromise).all(...args),
};

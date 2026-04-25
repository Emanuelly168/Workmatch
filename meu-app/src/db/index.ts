import { drizzle } from 'drizzle-orm/expo-sqlite';
import * as SQLite from 'expo-sqlite';
import * as schema from './schema';

const expoDb = SQLite.openDatabaseSync('workmatch.db');

expoDb.execSync(`
  CREATE TABLE IF NOT EXISTS profissionais (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    nome TEXT NOT NULL,
    servico TEXT NOT NULL
  );
`);

export const db = drizzle(expoDb, { schema });